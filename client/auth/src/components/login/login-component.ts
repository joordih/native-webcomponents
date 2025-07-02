import { AUTOCOMPLETE_TOKENS, FormSchema } from "../forms/form-schema";

class LoginComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private schema: FormSchema | null = null;

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.schema = {
      fields: [
        {
          id: "name",
          type: "text",
          name: "firstName",
          label: "Nombre",
          required: true,
          autocomplete: AUTOCOMPLETE_TOKENS.NAME,
        },
        {
          id: "email",
          type: "email",
          name: "email",
          label: "Correo",
          autocomplete: AUTOCOMPLETE_TOKENS.EMAIL,
        },
        {
          id: "country",
          type: "select",
          name: "country",
          label: "País",
          options: ["ES", "FR", "PT"],
        },
        {
          id: "birthDate",
          type: "date",
          name: "birth",
          label: "Fecha de nacimiento",
          min: "1900-01-01",
          max: new Date().toISOString().split("T")[0],
          autocomplete: AUTOCOMPLETE_TOKENS.OFF,
        },
      ],
    } as FormSchema;
  }

  connectedCallback() {
    this.render();
    this.registerEvents();
  }

  private registerEvents(): void {
    const form = this.shadow.getElementById("user-form") as HTMLFormElement;
    form.schema = this.schema;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.addEventListener("form-value-change", (event: any) => {
      console.log("Changed value to: ", event.detail);
    });
  }

  private render(): void {
    this.shadow.innerHTML = /* html */ `
      <form-builder id="user-form"></form-builder>
    `;
  }
}

customElements.define("login-component", LoginComponent);
