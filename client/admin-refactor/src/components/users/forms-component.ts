import { store } from "@redux/store";
import { addElement, setCurrentTab } from "@redux/slices/users/forms-slice";
import { incrementCount, setQueuedUpdate } from "@redux/slices/users";
import createIcon from "@icons/create-icon.svg?raw";
import deleteIcon from "@icons/delete-icon.svg?raw";
import generalIcon from "@icons/general-icon.svg?raw";
import miscIcon from "@icons/misc-icon.svg?raw";
import saveIcon from "@icons/save-icon.svg?raw";

interface FormData {
  [key: string]: string;
}

interface TabConfig {
  selector: string;
  buttonId: string;
}

interface TabsConfig {
  general: TabConfig;
  misc: TabConfig;
  create: TabConfig;
}

class FormsUsersComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private unsubscribe?: () => void;
  private tabs: TabsConfig = {
    general: { selector: ".general-tab", buttonId: "#general-button" },
    misc: { selector: ".misc-tab", buttonId: "#misc-button" },
    create: { selector: ".create-tab", buttonId: "#create-button" },
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.setupStyles();
  }

  connectedCallback(): void {
    this.setupStateSubscription();
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private async setupStyles(): Promise<void> {
    try {
      const styleModule = await import(
        "../../assets/components/orders/forms.css?inline"
      );
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(styleModule.default);
      this.shadow.adoptedStyleSheets = [sheet];
    } catch (error) {
      console.error("Failed to load styles:", error);
    }
  }

  private setupStateSubscription(): void {
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.updateInputValues(state.users_forms.inputs);
      this.updateTabVisibility(state.users_forms.currentTab);
    });
  }

  private updateInputValues(inputs: Record<string, any>): void {
    for (const [id, input] of Object.entries(inputs)) {
      const element = this.shadow.querySelector(`#${id}`) as HTMLInputElement;
      if (element) {
        element.value = input.value;
      }
    }
  }

  private updateTabVisibility(currentTab: string): void {
    Object.entries(this.tabs).forEach(([tab, { selector, buttonId }]) => {
      const isActive = tab === currentTab;
      const tabElement = this.shadow.querySelector(selector) as HTMLElement;
      const buttonElement = this.shadow.querySelector(buttonId) as HTMLElement;

      if (tabElement) {
        tabElement.style.display = isActive ? "grid" : "none";
      }

      if (buttonElement) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isActive
          ? buttonElement.classList.add("active")
          : buttonElement.classList.remove("active");
      }
    });

    const createButtonTab = this.shadow.querySelector(
      ".create-button-tab"
    ) as HTMLElement;
    if (createButtonTab) {
      createButtonTab.style.display = currentTab === "create" ? "flex" : "none";
    }
  }

  private setupEventListeners(): void {
    this.shadow
      .querySelector(".header")
      ?.addEventListener("click", this.handleTabClick.bind(this));
    this.shadow
      .querySelector("a.actions > button-component")
      ?.addEventListener("click", this.handleActionClick.bind(this));
  }

  private handleTabClick(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const tab = target
      .closest(".tab")
      ?.querySelector("a")
      ?.getAttribute("href")
      ?.replace("#", "");
    if (tab) {
      store.dispatch(setCurrentTab(tab));
    }
  }

  private async handleActionClick(event: Event): Promise<void> {
    event.preventDefault();
    const currentTab = store.getState().users_forms.currentTab;

    if (currentTab === "general") {
      await this.saveUser();
    } else if (currentTab === "create") {
      await this.createUser();
    }
  }

  private async saveUser(): Promise<void> {
    const userForm = this.getFormData(".general-tab");
    const response = await this.sendRequest("PUT", {
      id: userForm.id,
      name: userForm.name,
      email: userForm.email,
    });

    if (response.ok) {
      store.dispatch(setQueuedUpdate(true));
      await this.clearFormInputs();
    }
  }

  private async createUser(): Promise<void> {
    const userForm = this.getFormData(".create-tab");
    const response = await this.sendRequest("POST", {
      name: userForm.name,
      email: userForm.email,
    });

    if (response.ok) {
      store.dispatch(incrementCount());
      store.dispatch(setQueuedUpdate(true));
      this.render();
    }
  }

  private async clearFormInputs(): Promise<void> {
    const currentTab = store.getState().users_forms.currentTab;
    const inputs = this.shadow.querySelectorAll(
      `div.inputs${this.tabs[currentTab as keyof TabsConfig].selector} > div > input`
    ) as NodeListOf<HTMLInputElement>;

    inputs.forEach((input) => {
      input.value = "";
      store.dispatch(
        addElement({
          id: input.id,
          element: {
            value: "",
            type: input.type || undefined,
            placeholder: input.placeholder,
          },
        })
      );
    });
  }

  private getFormData(selector: string): FormData {
    const formData: FormData = {};
    const inputs = this.shadow.querySelectorAll(
      `${selector} > div > input`
    ) as NodeListOf<HTMLInputElement>;

    inputs.forEach((input) => {
      if (input) {
        formData[input.id] = input.value;
      }
    });

    return formData;
  }

  private async sendRequest(
    method: string,
    data: Record<string, unknown>
  ): Promise<Response> {
    return await fetch("http://localhost:8080/api/admin/users/", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        published: true,
      }),
    });
  }

  private registerInputs(): void {
    const inputs = this.shadow.querySelectorAll(
      "input"
    ) as NodeListOf<HTMLInputElement>;
    inputs.forEach(async (input) => {
      await store.dispatch(
        addElement({
          id: input.id,
          element: {
            value: input.value,
            type: input.type || undefined,
            placeholder: input.placeholder,
          },
        })
      );
    });
  }

  private render(): void {
    this.shadow.innerHTML = `
      <div class="header">
        ${this.getTabsTemplate()}
        ${this.getActionButtonTemplate()}
      </div>
      ${this.getGeneralTabTemplate()}
      ${this.getMiscTabTemplate()}
      ${this.getCreateTabTemplate()}
    `;

    this.registerInputs();
  }

  private getTabsTemplate(): string {
    return `
      <div class="tab">
        <a id="general-button" href="#general">
          ${generalIcon}
          GENERAL
        </a>
      </div>
      <div class="tab">
        <a id="misc-button" href="#misc">
          ${miscIcon}
          MISC
        </a>
      </div>
      <div class="tab create-button-tab">
        <a id="create-button" href="#create">
          ${createIcon}
          CREATE
        </a>
      </div>
    `;
  }

  private getActionButtonTemplate(): string {
    return `
      <div class="tab-action">
        <a href="#save" class="actions">
          <button-component
            text="Guardar"
            background="#1f5314"
            background-hover="#206312"
            text-color="#51e633"
            border-radius="0.5rem"
          >
            ${saveIcon}
          </button-component>
        </a>
      </div>
    `;
  }

  private getGeneralTabTemplate(): string {
    return `
      <div class="inputs general-tab">
        ${this.getFormInputsTemplate()}
      </div>
    `;
  }

  private getMiscTabTemplate(): string {
    return `
      <div class="inputs misc-tab">
        <div>
          <button-component
            text="Relleno"
            background="#531414"
            background-hover="#621212"
            text-color="#e63535"
            border-radius="0.375rem"
          >
            ${deleteIcon}
          </button-component>
        </div>
      </div>
    `;
  }

  private getCreateTabTemplate(): string {
    return `
      <div class="inputs create-tab">
        ${this.getFormInputsTemplate()}
      </div>
    `;
  }

  private getFormInputsTemplate(): string {
    return `
      <div>
        <label for="name">Nombre</label>
        <input type="text" id="name" class="input" placeholder="Nombre" value="" />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" class="input" placeholder="Email" />
      </div>
      <div>
        <label for="date_of_creation">Fecha de creación</label>
        <input type="date" id="createdAt" class="input" placeholder="Date" disabled />
      </div>
      <div>
        <label for="date_of_update">Fecha de actualización</label>
        <input type="date" id="updatedAt" class="input" placeholder="Date" disabled />
      </div>
      <div class="id-input">
        <label for="date_of_update">User Id</label>
        <input type="text" id="id" class="input" placeholder="User Id" />
      </div>
    `;
  }
}

customElements.define("forms-users-component", FormsUsersComponent);
