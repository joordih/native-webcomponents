interface OrderData {
  id: number;
  name: string;
  email: string;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
}

interface FilterState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

class DatatableOrdersComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private orders: OrderData[] = [];
  private filteredOrders: OrderData[] = [];
  private currentPage = 1;
  private itemsPerPage = 10;
  private totalItems = 0;
  private filters: FilterState = {
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    searchTerm: "",
  };
  private sortColumn = "";
  private sortDirection: "asc" | "desc" = "asc";
  private _debouncedSearchOrders: (searchTerm?: string) => Promise<void>;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this._debouncedSearchOrders = this.debounce(
      this.performSearch.bind(this),
      300
    );
  }

  connectedCallback(): void {
    this.render();
    this.loadOrders();
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

  private async loadOrders(): Promise<void> {
    try {
      const response = await fetch("http://localhost:8080/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        this.orders = data.rows || [];
        this.totalItems = data.count || this.orders.length;
        this.applyFilters();
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  }

  private async performSearch(searchTerm?: string): Promise<void> {
    try {
      this.filters.search = searchTerm || "";
      this.applyFilters();
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error in search:", error);
      }
    }
  }

  private applyFilters(): void {
    this.filteredOrders = this.orders.filter((order) => {
      const matchesSearch =
        !this.filters.search ||
        order.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        order.email.toLowerCase().includes(this.filters.search.toLowerCase());

      const matchesStatus =
        !this.filters.status || order.status === this.filters.status;

      const matchesDateRange = this.checkDateRange(order.created_at);

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    this.totalItems = this.filteredOrders.length;
    this.currentPage = 1;
    this.render();
  }

  private checkDateRange(dateString: string): boolean {
    if (!this.filters.dateFrom && !this.filters.dateTo) {
      return true;
    }

    const orderDate = new Date(dateString);
    const fromDate = this.filters.dateFrom
      ? new Date(this.filters.dateFrom)
      : null;
    const toDate = this.filters.dateTo ? new Date(this.filters.dateTo) : null;

    if (fromDate && orderDate < fromDate) {
      return false;
    }

    if (toDate && orderDate > toDate) {
      return false;
    }

    return true;
  }

  private getPaginatedOrders(): OrderData[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  private getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  private render(): void {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .datatable-header {
          padding: 1.5rem;
          border-bottom: 1px solid #dee2e6;
          background: #f8f9fa;
        }
        .datatable-title {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }
        .datatable-filters {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
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
          color: #333;
          font-size: 0.875rem;
        }
        .filter-group input,
        .filter-group select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.875rem;
        }
        .filter-group input:focus,
        .filter-group select:focus {
          outline: none;
          border-color: #007bff;
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
          border-bottom: 1px solid #dee2e6;
        }
        th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .sortable {
          cursor: pointer;
          user-select: none;
          position: relative;
        }
        .sortable:hover {
          background: #e9ecef;
        }
        .sort-icon {
          margin-left: 0.5rem;
          opacity: 0.5;
        }
        .sort-icon.active {
          opacity: 1;
        }
        tr:hover {
          background: #f8f9fa;
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }
        .status-pending {
          background: #fff3cd;
          color: #856404;
        }
        .status-processing {
          background: #cce5ff;
          color: #004085;
        }
        .status-completed {
          background: #d4edda;
          color: #155724;
        }
        .status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .action-button {
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .view-button {
          background: #17a2b8;
          color: white;
        }
        .view-button:hover {
          background: #138496;
        }
        .edit-button {
          background: #007bff;
          color: white;
        }
        .edit-button:hover {
          background: #0056b3;
        }
        .delete-button {
          background: #dc3545;
          color: white;
        }
        .delete-button:hover {
          background: #c82333;
        }
        .datatable-footer {
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pagination-info {
          color: #6c757d;
          font-size: 0.875rem;
        }
        .pagination-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .pagination-button {
          padding: 0.5rem 0.75rem;
          border: 1px solid #dee2e6;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.2s;
        }
        .pagination-button:hover:not(:disabled) {
          background: #f8f9fa;
        }
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination-button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }
        .empty-state {
          padding: 3rem;
          text-align: center;
          color: #6c757d;
        }
        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 500;
        }
        .empty-state p {
          margin: 0;
          font-size: 0.875rem;
        }
      </style>
      
      <div class="datatable-header">
        <h2 class="datatable-title">Orders Management</h2>
        <div class="datatable-filters">
          <div class="filter-group">
            <label for="search">Search</label>
            <input 
              type="text" 
              id="search" 
              placeholder="Search by name or email..."
              value="${this.filters.search}"
            >
          </div>
          <div class="filter-group">
            <label for="status">Status</label>
            <select id="status">
              <option value="">All Statuses</option>
              <option value="pending" ${this.filters.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="processing" ${this.filters.status === "processing" ? "selected" : ""}>Processing</option>
              <option value="completed" ${this.filters.status === "completed" ? "selected" : ""}>Completed</option>
              <option value="cancelled" ${this.filters.status === "cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="dateFrom">From Date</label>
            <input 
              type="date" 
              id="dateFrom" 
              value="${this.filters.dateFrom}"
            >
          </div>
          <div class="filter-group">
            <label for="dateTo">To Date</label>
            <input 
              type="date" 
              id="dateTo" 
              value="${this.filters.dateTo}"
            >
          </div>
        </div>
      </div>
      
      <div class="datatable-content">
        ${this.filteredOrders.length === 0 ? this.renderEmptyState() : this.renderTable()}
      </div>
      
      ${this.filteredOrders.length > 0 ? this.renderFooter() : ""}
    `;

    this.setupEventListeners();
  }

  private renderEmptyState(): string {
    return `
      <div class="empty-state">
        <h3>No orders found</h3>
        <p>There are no orders matching your current filters. Try adjusting your search criteria.</p>
      </div>
    `;
  }

  private renderTable(): string {
    const paginatedOrders = this.getPaginatedOrders();

    return `
      <table>
        <thead>
          <tr>
            <th class="sortable" data-column="id">
              Order ID
              <span class="sort-icon ${this.sortColumn === "id" ? "active" : ""}">
                ${this.getSortIcon("id")}
              </span>
            </th>
            <th class="sortable" data-column="name">
              Customer
              <span class="sort-icon ${this.sortColumn === "name" ? "active" : ""}">
                ${this.getSortIcon("name")}
              </span>
            </th>
            <th class="sortable" data-column="email">
              Email
              <span class="sort-icon ${this.sortColumn === "email" ? "active" : ""}">
                ${this.getSortIcon("email")}
              </span>
            </th>
            <th class="sortable" data-column="status">
              Status
              <span class="sort-icon ${this.sortColumn === "status" ? "active" : ""}">
                ${this.getSortIcon("status")}
              </span>
            </th>
            <th class="sortable" data-column="total">
              Total
              <span class="sort-icon ${this.sortColumn === "total" ? "active" : ""}">
                ${this.getSortIcon("total")}
              </span>
            </th>
            <th class="sortable" data-column="created_at">
              Created
              <span class="sort-icon ${this.sortColumn === "created_at" ? "active" : ""}">
                ${this.getSortIcon("created_at")}
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${paginatedOrders.map((order) => this.renderOrderRow(order)).join("")}
        </tbody>
      </table>
    `;
  }

  private renderOrderRow(order: OrderData): string {
    return `
      <tr data-id="${order.id}">
        <td>#${order.id}</td>
        <td>${this.escapeHtml(order.name)}</td>
        <td>${this.escapeHtml(order.email)}</td>
        <td>
          <span class="status-badge status-${order.status}">
            ${order.status}
          </span>
        </td>
        <td>$${order.total?.toFixed(2) || "0.00"}</td>
        <td>${this.formatDate(order.created_at)}</td>
        <td>
          <div class="actions">
            <button class="action-button view-button" data-id="${order.id}" data-action="view">
              View
            </button>
            <button class="action-button edit-button" data-id="${order.id}" data-action="edit">
              Edit
            </button>
            <button class="action-button delete-button" data-id="${order.id}" data-action="delete">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  private renderFooter(): string {
    const totalPages = this.getTotalPages();
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(
      this.currentPage * this.itemsPerPage,
      this.totalItems
    );

    return `
      <div class="datatable-footer">
        <div class="pagination-info">
          Showing ${startItem} to ${endItem} of ${this.totalItems} orders
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-button" 
            data-page="${this.currentPage - 1}"
            ${this.currentPage === 1 ? "disabled" : ""}
          >
            Previous
          </button>
          ${this.renderPageNumbers()}
          <button 
            class="pagination-button" 
            data-page="${this.currentPage + 1}"
            ${this.currentPage === totalPages ? "disabled" : ""}
          >
            Next
          </button>
        </div>
      </div>
    `;
  }

  private renderPageNumbers(): string {
    const totalPages = this.getTotalPages();
    const pages: string[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= this.currentPage - 2 && i <= this.currentPage + 2)
      ) {
        pages.push(`
          <button 
            class="pagination-button ${i === this.currentPage ? "active" : ""}" 
            data-page="${i}"
          >
            ${i}
          </button>
        `);
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        pages.push("<span>...</span>");
      }
    }

    return pages.join("");
  }

  private getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return "↕️";
    }
    return this.sortDirection === "asc" ? "↑" : "↓";
  }

  private setupEventListeners(): void {
    // Search input
    const searchInput = this.shadow.querySelector(
      "#search"
    ) as HTMLInputElement;
    searchInput?.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      this._debouncedSearchOrders(target.value);
    });

    // Status filter
    const statusSelect = this.shadow.querySelector(
      "#status"
    ) as HTMLSelectElement;
    statusSelect?.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      this.filters.status = target.value;
      this.applyFilters();
    });

    // Date filters
    const dateFromInput = this.shadow.querySelector(
      "#dateFrom"
    ) as HTMLInputElement;
    dateFromInput?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      this.filters.dateFrom = target.value;
      this.applyFilters();
    });

    const dateToInput = this.shadow.querySelector(
      "#dateTo"
    ) as HTMLInputElement;
    dateToInput?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      this.filters.dateTo = target.value;
      this.applyFilters();
    });

    // Sort functionality
    const sortableHeaders = this.shadow.querySelectorAll(".sortable");
    sortableHeaders.forEach((header) => {
      header.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLElement;
        const column = target.dataset.column;
        if (column) {
          this.handleSort(column);
        }
      });
    });

    // Action buttons
    const actionButtons = this.shadow.querySelectorAll(".action-button");
    actionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const id = parseInt(target.dataset.id || "0");
        const action = target.dataset.action;

        if (action && id) {
          this.handleAction(action, id);
        }
      });
    });

    // Pagination
    const paginationButtons = this.shadow.querySelectorAll(
      ".pagination-button[data-page]"
    );
    paginationButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const page = parseInt(target.dataset.page || "1");
        if (page >= 1 && page <= this.getTotalPages()) {
          this.currentPage = page;
          this.render();
        }
      });
    });
  }

  private handleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }

    this.filteredOrders.sort((a, b) => {
      let aValue = a[column as keyof OrderData];
      let bValue = b[column as keyof OrderData];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return this.sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    this.currentPage = 1;
    this.render();
  }

  private handleAction(action: string, id: number): void {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return;

    switch (action) {
      case "view":
        this.dispatchEvent(
          new CustomEvent("viewOrder", {
            detail: { order },
            bubbles: true,
            composed: true,
          })
        );
        break;
      case "edit":
        this.dispatchEvent(
          new CustomEvent("editOrder", {
            detail: { order },
            bubbles: true,
            composed: true,
          })
        );
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this order?")) {
          this.dispatchEvent(
            new CustomEvent("deleteOrder", {
              detail: { id },
              bubbles: true,
              composed: true,
            })
          );
        }
        break;
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Public methods for external control
  public refreshData(): void {
    this.loadOrders();
  }

  public setFilters(filters: Partial<FilterState>): void {
    this.filters = { ...this.filters, ...filters };
    this.applyFilters();
  }

  public clearFilters(): void {
    this.filters = {
      search: "",
      status: "",
      dateFrom: "",
      dateTo: "",
      searchTerm: "",
    };
    this.applyFilters();
  }
}

customElements.define("datatable-orders-component", DatatableOrdersComponent);
