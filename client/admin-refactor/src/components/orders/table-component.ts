import { store } from "@redux/store";
import {
  createElement,
  editElement,
  setCurrentTab,
} from "@redux/slices/orders/forms-slice";
import {
  addOrders,
  clearOrders,
  decrementCount,
  removeOrder,
  setCount,
  setQueuedUpdate,
  setSearchTerm,
} from "@redux/slices/orders/orders-slice";
import plusIcon from "@icons/plus-icon.svg?raw";
import arrowLeftIcon from "@icons/arrow-left-icon.svg?raw";
import arrowRightIcon from "@icons/arrow-right-icon.svg?raw";
import orderEditIcon from "@icons/order-edit-icon.svg?raw";
import orderDeleteIcon from "@icons/order-delete-icon.svg?raw";

interface OrderData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  rows: OrderData[];
  count: number;
}

class TableOrdersComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private currentPage = 0;
  private limit = 5;
  private unsubscribe?: () => void;
  private abortController?: AbortController;
  private debouncedSearch: (...args: any[]) => void;
  private boundHandleTableClick: (event: Event) => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.setupStyles();
    this.debouncedSearch = this.debounce(this.performSearch.bind(this), 1000);
    this.boundHandleTableClick = this.handleTableClick.bind(this);
  }

  connectedCallback(): void {
    this.unsubscribe = store.subscribe(async () => {
      if (store.getState().orders.queuedUpdate) {
        await store.dispatch(setQueuedUpdate(false));
        await this.performSearch();
      }
      this.render();
    });

    this.performSearch();
    this.render();
  }

  disconnectedCallback(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.abortController?.abort();
  }

  private async setupStyles(): Promise<void> {
    try {
      const styleModule = await import(
        "../../assets/components/orders/table.css?inline"
      );
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(styleModule.default);
      this.shadow.adoptedStyleSheets = [sheet];
    } catch (error) {
      console.error("Failed to load styles:", error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private debounce(func: Function, wait: number): (...args: any[]) => void {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  private async fetchOrders(searchTerm?: string): Promise<ApiResponse> {
    const offset = this.currentPage * this.limit;
    let url = `http://localhost:8080/api/admin/orders/${this.limit}/${offset}`;

    if (searchTerm) {
      url += `?search=${searchTerm}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { rows: [], count: 0 };
    }
  }

  private handleNextPage = async (): Promise<void> => {
    if (
      this.currentPage < Math.floor(store.getState().orders.count / this.limit)
    ) {
      this.currentPage++;
      await this.performSearch();
    }
  };

  private handlePrevPage = async (): Promise<void> => {
    if (this.currentPage > 0) {
      this.currentPage--;
      await this.performSearch();
    }
  };

  private async performSearch(searchTerm?: string): Promise<void> {
    try {
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      store.dispatch(clearOrders());
      const data = await this.fetchOrders(searchTerm);

      if (searchTerm === "") {
        store.dispatch(setSearchTerm(undefined));
      }

      if (data.rows?.length) {
        store.dispatch(setSearchTerm(searchTerm));
        store.dispatch(addOrders(data.rows));
      } else {
        store.dispatch(setSearchTerm(searchTerm));
      }

      store.dispatch(setCount(data.count));
      this.render();
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error en búsqueda:", error);
      }
    }
  }

  private createOrderRow(): void {
    const tableBody = this.shadow.querySelector("#orders tbody");
    if (!tableBody) return;

    const orders = store.getState().orders.orders;
    orders.forEach((order: OrderData) => {
      const row = document.createElement("tr");
      row.classList.add("order-card");
      row.dataset.id = order.id.toString();

      const actionCell = document.createElement("td");
      const nameCell = document.createElement("td");
      const emailCell = document.createElement("td");
      const creationDateCell = document.createElement("td");
      const updateDateCell = document.createElement("td");

      const div = document.createElement("div");
      div.classList.add("card-header", `header-${order.id}`);

      const headerTitle = document.createElement("span");
      headerTitle.textContent = `Order #${order.id}`;
      div.appendChild(headerTitle);

      const editButton = document.createElement("a");
      editButton.classList.add(
        "edit-button",
        "transition-colors",
        `edit-${order.id}`
      );
      editButton.innerHTML = orderEditIcon;
      div.appendChild(editButton);

      const deleteButton = document.createElement("a");
      deleteButton.classList.add(
        "delete-button",
        "transition-colors",
        `delete-${order.id}`
      );
      deleteButton.innerHTML = orderDeleteIcon;
      div.appendChild(deleteButton);

      nameCell.innerHTML = `Nombre: <span>${order.name}</span>`;
      emailCell.innerHTML = `Email: <span>${order.email}</span>`;
      creationDateCell.innerHTML = `Fecha de creación: <span>${new Date(order.createdAt).toISOString().slice(0, 10)}</span>`;
      updateDateCell.innerHTML = `Fecha de actualización: <span>${new Date(order.updatedAt).toISOString().slice(0, 10)}</span>`;

      actionCell.appendChild(div);
      row.appendChild(actionCell);
      row.appendChild(nameCell);
      row.appendChild(emailCell);
      row.appendChild(creationDateCell);
      row.appendChild(updateDateCell);

      tableBody.appendChild(row);
    });
  }

  private render(): void {
    this.disconnectEventListeners();

    const orders = store.getState().orders;
    const searchTerm = store.getState().orders.searchTerm;

    this.shadow.innerHTML = `
      <div class="orders-header">
        Amount of orders: ${orders.count}
        <div class="filter">
          <input type="text" placeholder="Search orders" value="${searchTerm || ""}" />
        </div>
      </div>
      <table id="orders">
        <tbody class="hidden-scrollbar">
        </tbody>
      </table>
      <div class="footer">
        <button-component id="create-button" text="Nuevo" background="transparent" background-hover="#17171A" text-color="#FAFAFA" padding="0.375rem" margin-left="0.2rem" border-radius="0.5rem">
          ${plusIcon}
        </button-component>
        <div class="paginator-container">
          <button-component class="paginator-previous" text="" background="transparent" background-hover="#17171A" text-color="#FAFAFA" padding="0.375rem" margin-left="0.2rem" border-radius="0.5rem">
            ${arrowLeftIcon}
          </button-component>
          <span class="paginator-current">Page ${this.currentPage}/${Math.floor(orders.count / this.limit)}</span>
          <button-component class="paginator-next" reverse-side="true" text="" background="transparent" background-hover="#17171A" text-color="#FAFAFA" padding="0.375rem" margin-left="0.2rem" border-radius="0.5rem">
            ${arrowRightIcon}
          </button-component>
        </div>
      </div>
    `;

    this.createOrderRow();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const searchInput = this.shadow.querySelector(
      ".filter input"
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        this.debouncedSearch(target.value.trim());
      });

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const target = e.target as HTMLInputElement;
          this.performSearch(target.value.trim());
        }
      });
    }

    const tbody = this.shadow.querySelector("#orders tbody");
    if (tbody) {
      tbody.removeEventListener("click", this.boundHandleTableClick);
      tbody.addEventListener("click", this.boundHandleTableClick);
    }

    const createButton = this.shadow.querySelector("#create-button");
    if (createButton) {
      createButton.addEventListener("click", () => {
        const inputs = store.getState().orders_forms.inputs;
        Object.keys(inputs).forEach((input) => {
          store.dispatch(createElement({ id: input, element: { value: "" } }));
        });
      });
    }

    const nextButton = this.shadow.querySelector(".paginator-next");
    const prevButton = this.shadow.querySelector(".paginator-previous");

    if (nextButton) nextButton.addEventListener("click", this.handleNextPage);
    if (prevButton) prevButton.addEventListener("click", this.handlePrevPage);
  }

  private disconnectEventListeners(): void {
    const tbody = this.shadow.querySelector("#orders tbody");
    if (tbody) {
      tbody.removeEventListener("click", this.boundHandleTableClick);
    }
  }

  private handleTableClick(event: Event): void {
    const target = event.target as HTMLElement;
    const orderCard = target.closest(".order-card") as HTMLElement;
    if (!orderCard || !orderCard.dataset.id) return;

    const orderId = orderCard.dataset.id;
    const order = store
      .getState()
      .orders.orders.find((o: OrderData) => o.id === Number(orderId));
    if (!order) return;

    if (target.closest(".delete-button")) {
      this.handleDelete(order, orderCard);
    } else if (target.closest(".edit-button")) {
      this.handleEdit(order);
      store.dispatch(setCurrentTab("general"));
    }
  }

  private handleDelete(order: OrderData, orderCard: HTMLElement): void {
    this.pushPopup();
    const popup = document.querySelector("#popup-component");
    const continueButton = popup?.shadowRoot?.querySelector("#continue-button");

    if (continueButton) {
      continueButton.addEventListener("click", async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/admin/orders/${order.id}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.ok) {
            store.dispatch(removeOrder(order.id));
            store.dispatch(decrementCount());
            orderCard.remove();
          }
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      });
    }
  }

  private handleEdit(order: OrderData): void {
    store.dispatch(setCurrentTab("general"));

    Object.entries(order).forEach(([key, value]) => {
      store.dispatch(
        editElement({
          id: key,
          element: {
            value: ["createdAt", "updatedAt"].includes(key)
              ? new Date(value as string).toISOString().slice(0, 10)
              : value,
          },
        })
      );
    });
  }

  private pushPopup(): void {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<popup-component 
        id='popup-component' 
        title='Are you sure you want to delete this order?' 
        message='Remember that this action cannot be undone.'
      ></popup-component>`
    );
  }
}

customElements.define("table-orders-component", TableOrdersComponent);
