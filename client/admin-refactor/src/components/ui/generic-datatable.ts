import { store } from "@redux/store";

interface GenericDataItem {
  id: number;
  [key: string]: any;
}

interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: GenericDataItem) => string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date";
  options?: { value: string; label: string }[];
}

interface GenericDatatableConfig {
  apiEndpoint: string;
  columns: ColumnConfig[];
  filters?: FilterConfig[];
  itemsPerPage?: number;
  searchPlaceholder?: string;
  title?: string;
  reduxSlice?: {
    selector: (state: any) => any;
    actions: {
      addItems: (items: GenericDataItem[]) => any;
      setCount: (count: number) => any;
      clearItems: () => any;
      setQueuedUpdate: (value: boolean) => any;
    };
  };
}

class GenericDatatable extends HTMLElement {
  private shadow: ShadowRoot;
  private config!: GenericDatatableConfig;
  private items: GenericDataItem[] = [];
  private filteredItems: GenericDataItem[] = [];
  private currentPage = 1;
  private totalItems = 0;
  private filters: Record<string, string> = {};
  private sortColumn = "";
  private sortDirection: "asc" | "desc" = "asc";
  private unsubscribe?: () => void;
  private abortController?: AbortController;
  private _debouncedSearch: (searchTerm?: string) => Promise<void>;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this._debouncedSearch = this.debounce(this.performSearch.bind(this), 300);
  }

  static get observedAttributes(): string[] {
    return ["config"];
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    if (name === "config" && newValue) {
      try {
        this.config = JSON.parse(newValue);
        this.setupReduxSubscription();
        this.render();
        this.loadData();
      } catch (error) {
        console.error("Error parsing config:", error);
      }
    }
  }

  public setConfig(config: GenericDatatableConfig): void {
    this.config = config;
    this.setupReduxSubscription();
    this.render();
    this.loadData();
  }

  connectedCallback(): void {
    this.setupStyles();
  }

  disconnectedCallback(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private async setupStyles(): Promise<void> {
    const styles = `
      :host {
        display: block;
        background: var(--bg-primary, #ffffff);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          background: var(--bg-primary-dark, #1a1a1a);
          color: var(--text-primary-dark, #ffffff);
        }
      }

      .datatable-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color, #dee2e6);
        background: var(--bg-secondary, #f8f9fa);
      }

      @media (prefers-color-scheme: dark) {
        .datatable-header {
          background: var(--bg-secondary-dark, #2d2d2d);
          border-bottom-color: var(--border-color-dark, #404040);
        }
      }

      .datatable-title {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary, #333);
      }

      @media (prefers-color-scheme: dark) {
        .datatable-title {
          color: var(--text-primary-dark, #ffffff);
        }
      }

      .datatable-filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        align-items: end;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
      }

      .filter-group label {
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-secondary, #666);
        font-size: 0.875rem;
      }

      @media (prefers-color-scheme: dark) {
        .filter-group label {
          color: var(--text-secondary-dark, #cccccc);
        }
      }

      .filter-group input,
      .filter-group select {
        padding: 0.75rem;
        border: 1px solid var(--border-color, #ddd);
        border-radius: 4px;
        font-size: 0.875rem;
        background: var(--bg-primary, #ffffff);
        color: var(--text-primary, #333);
      }

      @media (prefers-color-scheme: dark) {
        .filter-group input,
        .filter-group select {
          background: var(--bg-primary-dark, #1a1a1a);
          color: var(--text-primary-dark, #ffffff);
          border-color: var(--border-color-dark, #404040);
        }
      }

      .filter-group input:focus,
      .filter-group select:focus {
        outline: none;
        border-color: var(--accent-color, #007bff);
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
      }

      .datatable-content {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }

      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color, #dee2e6);
      }

      @media (prefers-color-scheme: dark) {
        th, td {
          border-bottom-color: var(--border-color-dark, #404040);
        }
      }

      th {
        background: var(--bg-secondary, #f8f9fa);
        font-weight: 600;
        color: var(--text-primary, #333);
        cursor: pointer;
        user-select: none;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      @media (prefers-color-scheme: dark) {
        th {
          background: var(--bg-secondary-dark, #2d2d2d);
          color: var(--text-primary-dark, #ffffff);
        }
      }

      th:hover {
        background: var(--bg-hover, #e9ecef);
      }

      @media (prefers-color-scheme: dark) {
        th:hover {
          background: var(--bg-hover-dark, #404040);
        }
      }

      th.sortable::after {
        content: '↕';
        margin-left: 0.5rem;
        opacity: 0.5;
      }

      th.sort-asc::after {
        content: '↑';
        opacity: 1;
      }

      th.sort-desc::after {
        content: '↓';
        opacity: 1;
      }

      tbody tr {
        transition: background-color 0.2s;
      }

      tbody tr:hover {
        background: var(--bg-hover, #f5f5f5);
      }

      @media (prefers-color-scheme: dark) {
        tbody tr:hover {
          background: var(--bg-hover-dark, #2d2d2d);
        }
      }

      .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--border-color, #dee2e6);
        background: var(--bg-secondary, #f8f9fa);
      }

      @media (prefers-color-scheme: dark) {
        .pagination {
          background: var(--bg-secondary-dark, #2d2d2d);
          border-top-color: var(--border-color-dark, #404040);
        }
      }

      .pagination-info {
        color: var(--text-secondary, #666);
        font-size: 0.875rem;
      }

      @media (prefers-color-scheme: dark) {
        .pagination-info {
          color: var(--text-secondary-dark, #cccccc);
        }
      }

      .pagination-controls {
        display: flex;
        gap: 0.5rem;
      }

      .pagination-button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color, #ddd);
        background: var(--bg-primary, #ffffff);
        color: var(--text-primary, #333);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }

      @media (prefers-color-scheme: dark) {
        .pagination-button {
          background: var(--bg-primary-dark, #1a1a1a);
          color: var(--text-primary-dark, #ffffff);
          border-color: var(--border-color-dark, #404040);
        }
      }

      .pagination-button:hover:not(:disabled) {
        background: var(--accent-color, #007bff);
        color: white;
        border-color: var(--accent-color, #007bff);
      }

      .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .no-data {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary, #666);
      }

      @media (prefers-color-scheme: dark) {
        .no-data {
          color: var(--text-secondary-dark, #cccccc);
        }
      }

      .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary, #666);
      }

      @media (prefers-color-scheme: dark) {
        .loading {
          color: var(--text-secondary-dark, #cccccc);
        }
      }
    `;

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  private setupReduxSubscription(): void {
    if (!this.config.reduxSlice) return;

    this.unsubscribe = store.subscribe(() => {
      const state = this.config.reduxSlice!.selector(store.getState());
      if (state.queuedUpdate) {
        store.dispatch(this.config.reduxSlice!.actions.setQueuedUpdate(false));
        this.loadData();
      }
      this.render();
    });
  }

  private debounce(
    func: (searchTerm?: string) => Promise<void>,
    wait: number
  ): (searchTerm?: string) => Promise<void> {
    let timeout: NodeJS.Timeout;
    return async (searchTerm?: string): Promise<void> => {
      clearTimeout(timeout);
      return new Promise((resolve) => {
        timeout = setTimeout(async () => {
          await func(searchTerm);
          resolve();
        }, wait);
      });
    };
  }

  private async loadData(): Promise<void> {
    await this.performSearch();
  }

  private async performSearch(searchTerm?: string): Promise<void> {
    try {
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      const params = new URLSearchParams({
        page: (this.currentPage - 1).toString(),
        limit: (this.config.itemsPerPage || 10).toString(),
        ...(searchTerm && { search: searchTerm }),
        ...this.filters,
      });

      const response = await fetch(`${this.config.apiEndpoint}?${params}`, {
        signal: this.abortController.signal,
      });

      if (response.ok) {
        const data = await response.json();
        this.items = data.rows || data.items || [];
        this.totalItems = data.count || this.items.length;

        if (this.config.reduxSlice) {
          store.dispatch(this.config.reduxSlice.actions.addItems(this.items));
          store.dispatch(
            this.config.reduxSlice.actions.setCount(this.totalItems)
          );
        }

        this.applyClientSideFilters();
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error loading data:", error);
      }
    }
  }

  private applyClientSideFilters(): void {
    this.filteredItems = this.items.filter((item) => {
      return Object.entries(this.filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key];
        if (typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        return String(itemValue) === value;
      });
    });

    this.applySorting();
    this.render();
  }

  private applySorting(): void {
    if (!this.sortColumn) return;

    this.filteredItems.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return this.sortDirection === "desc" ? -comparison : comparison;
    });
  }

  private handleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.applySorting();
    this.render();
  }

  private handleFilter(key: string, value: string): void {
    this.filters[key] = value;
    this.currentPage = 1;
    this.applyClientSideFilters();
  }

  private handlePageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  private getPaginatedItems(): GenericDataItem[] {
    const itemsPerPage = this.config.itemsPerPage || 10;
    const startIndex = (this.currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return this.filteredItems.slice(startIndex, endIndex);
  }

  private getTotalPages(): number {
    const itemsPerPage = this.config.itemsPerPage || 10;
    return Math.ceil(this.filteredItems.length / itemsPerPage);
  }

  private render(): void {
    if (!this.config) return;

    const paginatedItems = this.getPaginatedItems();
    const totalPages = this.getTotalPages();

    this.shadow.innerHTML = `
      <div class="datatable-header">
        ${this.config.title ? `<h2 class="datatable-title">${this.config.title}</h2>` : ""}
        ${this.renderFilters()}
      </div>
      
      <div class="datatable-content">
        ${this.renderTable(paginatedItems)}
      </div>
      
      ${this.renderPagination(totalPages)}
    `;

    this.setupEventListeners();
  }

  private renderFilters(): string {
    if (!this.config.filters || this.config.filters.length === 0) {
      return `
        <div class="datatable-filters">
          <div class="filter-group">
            <label>Search</label>
            <input 
              type="text" 
              placeholder="${this.config.searchPlaceholder || "Search..."}"
              class="search-input"
            >
          </div>
        </div>
      `;
    }

    return `
      <div class="datatable-filters">
        <div class="filter-group">
          <label>Search</label>
          <input 
            type="text" 
            placeholder="${this.config.searchPlaceholder || "Search..."}"
            class="search-input"
          >
        </div>
        ${this.config.filters
          .map(
            (filter) => `
          <div class="filter-group">
            <label>${filter.label}</label>
            ${
              filter.type === "select"
                ? `
              <select class="filter-select" data-key="${filter.key}">
                <option value="">All</option>
                ${
                  filter.options
                    ?.map(
                      (option) => `
                  <option value="${option.value}">${option.label}</option>
                `
                    )
                    .join("") || ""
                }
              </select>
            `
                : `
              <input 
                type="${filter.type}" 
                class="filter-input" 
                data-key="${filter.key}"
                placeholder="Filter by ${filter.label.toLowerCase()}"
              >
            `
            }
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  private renderTable(items: GenericDataItem[]): string {
    if (items.length === 0) {
      return '<div class="no-data">No data available</div>';
    }

    return `
      <table>
        <thead>
          <tr>
            ${this.config.columns
              .map(
                (column) => `
              <th 
                class="${column.sortable !== false ? "sortable" : ""} ${this.sortColumn === column.key ? `sort-${this.sortDirection}` : ""}"
                data-column="${column.key}"
              >
                ${column.label}
              </th>
            `
              )
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr data-id="${item.id}">
              ${this.config.columns
                .map(
                  (column) => `
                <td>
                  ${column.render ? column.render(item[column.key], item) : item[column.key] || ""}
                </td>
              `
                )
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  private renderPagination(totalPages: number): string {
    if (totalPages <= 1) return "";

    const startItem =
      (this.currentPage - 1) * (this.config.itemsPerPage || 10) + 1;
    const endItem = Math.min(
      this.currentPage * (this.config.itemsPerPage || 10),
      this.filteredItems.length
    );

    return `
      <div class="pagination">
        <div class="pagination-info">
          Showing ${startItem}-${endItem} of ${this.filteredItems.length} items
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-button" 
            ${this.currentPage === 1 ? "disabled" : ""}
            data-page="${this.currentPage - 1}"
          >
            Previous
          </button>
          <button 
            class="pagination-button" 
            ${this.currentPage === totalPages ? "disabled" : ""}
            data-page="${this.currentPage + 1}"
          >
            Next
          </button>
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    // Search input
    const searchInput = this.shadow.querySelector(
      ".search-input"
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        this._debouncedSearch(target.value);
      });
    }

    // Filter inputs
    this.shadow
      .querySelectorAll(".filter-input, .filter-select")
      .forEach((input) => {
        input.addEventListener("change", (e) => {
          const target = e.target as HTMLInputElement | HTMLSelectElement;
          const key = target.dataset.key!;
          this.handleFilter(key, target.value);
        });
      });

    // Sort headers
    this.shadow.querySelectorAll("th.sortable").forEach((th) => {
      th.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const column = target.dataset.column!;
        this.handleSort(column);
      });
    });

    // Pagination buttons
    this.shadow.querySelectorAll(".pagination-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const target = e.target as HTMLButtonElement;
        if (!target.disabled) {
          const page = parseInt(target.dataset.page!);
          this.handlePageChange(page);
        }
      });
    });

    // Row clicks (emit custom event)
    this.shadow.querySelectorAll("tbody tr").forEach((row) => {
      row.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLElement;
        const id = target.dataset.id!;
        const item = this.items.find((item) => item.id.toString() === id);

        this.dispatchEvent(
          new CustomEvent("row-click", {
            detail: { item, id },
            bubbles: true,
          })
        );
      });
    });
  }

  // Public methods for external control
  public refresh(): void {
    this.loadData();
  }

  public setFilters(filters: Record<string, string>): void {
    this.filters = { ...filters };
    this.applyClientSideFilters();
  }

  public clearFilters(): void {
    this.filters = {};
    this.applyClientSideFilters();
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.handlePageChange(page);
    }
  }
}

customElements.define("generic-datatable", GenericDatatable);

export default GenericDatatable;
