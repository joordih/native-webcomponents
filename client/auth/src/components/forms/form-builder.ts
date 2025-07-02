import {
  AutoCompleteToken,
  Field,
  FormSchema,
  INPUT_CONFIGS,
} from "./form-schema";

export class FormBuilder extends HTMLElement {
  get schema(): FormSchema | null {
    return this._schema;
  }

  set schema(value: FormSchema | null) {
    this._schema = value;
    this._render();
  }

  get value(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    this._inputs.forEach((input, name) => (data[name] = input.value));
    return data;
  }

  formData(): FormData {
    return new FormData(this._form);
  }

  static get observedAttributes() {
    return ["schema"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._form = document.createElement("form");
    this._form.addEventListener("input", () => this._dispatchChange());

    this.shadowRoot!.append(this._style(), this._form);
  }

  private _schema: FormSchema | null = null;
  private _form: HTMLFormElement;
  private _inputs = new Map<string, HTMLInputElement | HTMLSelectElement>();

  connectedCallback() {
    if (!this._schema && this.getAttribute("schema")) {
      try {
        this._schema = JSON.parse(this.getAttribute("schema")!);
      } catch (error) {
        console.error("Error in FormBuilder connectedCallback", error);
      }
    }
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ) {
    if (name === "schema" && value) {
      this.schema = JSON.parse(value);
    }
  }

  private _render() {
    this._form.replaceChildren();
    this._inputs.clear();

    if (!this._schema) return;

    for (const field of this._schema.fields) {
      try {
        const wrapper = document.createElement("div");
        wrapper.classList.add("field");

        const label = document.createElement("label");
        label.textContent = field.label ?? field.name;
        wrapper.append(label);

        const input = this._createInput(field);

        this._inputs.set(field.name, input);
        wrapper.append(input);
        this._form.append(wrapper);
      } catch (error) {
        console.error(`Error creating field ${field.name}:`, error);
      }
    }
  }

  private _createInput(field: Field): HTMLInputElement | HTMLSelectElement {
    const config = INPUT_CONFIGS[field.type];

    if (!config) {
      throw new Error(`Unsupported field type: ${field.type}`);
    }

    const element = document.createElement(config.element) as
      | HTMLInputElement
      | HTMLSelectElement;

    element.id = field.id;

    if (config.defaultAttributes) {
      Object.entries(config.defaultAttributes).forEach(([key, value]) => {
        (element as any)[key] = value;
      });
    }

    config.attributes.forEach((attr: string | number) => {
      if (field.hasOwnProperty(attr) && (field as any)[attr] !== undefined) {
        (element as any)[attr] = (field as any)[attr];
      }
    });

    element.name = field.name;
    const autocomplete: AutoCompleteToken | "off" = field.autocomplete ?? "off";
    element.setAttribute("autocomplete", autocomplete);
    if (field.required) element.required = true;

    if (config.customHandler) {
      config.customHandler(element, field);
    }

    return element;
  }

  private _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent("form-value-change", {
        detail: this.value,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _style() {
    const style = document.createElement("style");
    style.textContent = /* css */ `
      :host {
        display: block;
        font: 14px/1.4 system-ui;
        box-sizing: border-box;
      }
      .field {
        margin: 0 0 .75rem;
        box-sizing: border-box;
        max-width: 100%;
      }
      label {
        display: block;
        margin: 0 0 .25rem;
        font-weight: 600;
        box-sizing: border-box;
        max-width: 100%;
      }
      input, select {
        font: inherit;
        padding: .35rem .5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
      input.invalid {
        border-color: #dc3545;
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-transition-delay: 9999s;
        transition-delay: 9999s;
      }`;
    return style;
  }
}

customElements.define("form-builder", FormBuilder);
