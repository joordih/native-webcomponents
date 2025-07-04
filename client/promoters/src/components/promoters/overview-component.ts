import style from "../../assets/components/promoters/promoters.css?inline";

interface PromoterStats {
  totalPromoters: number;
  activePromoters: number;
  newPromotersThisMonth: number;
  pendingPromoters: number;
}

class OverviewComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private stats: PromoterStats = {
    totalPromoters: 0,
    activePromoters: 0,
    newPromotersThisMonth: 0,
    pendingPromoters: 0,
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(style);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  connectedCallback(): void {
    this.render();
    this.fetchStats();
  }

  private render(): void {
    this.shadow.innerHTML = /* html */ `
      <div class="overview-container">
        <div class="overview-header">
          <h2 class="overview-title">Resumen de Promoters</h2>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">${this.stats.totalPromoters}</div>
              <div class="stat-label">Total Promoters</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon active">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">${this.stats.activePromoters}</div>
              <div class="stat-label">Promoters Activos</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon new">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">${this.stats.newPromotersThisMonth}</div>
              <div class="stat-label">Nuevos este mes</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon pending">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">${this.stats.pendingPromoters}</div>
              <div class="stat-label">Pendientes</div>
            </div>
          </div>
        </div>

        <div class="overview-actions">
          <button class="action-button primary" id="refresh-stats">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23,4 23,10 17,10"></polyline>
              <polyline points="1,20 1,14 7,14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      <style>
        .overview-container {
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .overview-header {
          margin-bottom: 24px;
        }

        .overview-title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: #e2e8f0;
          color: #64748b;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .stat-icon.active {
          background: #dcfce7;
          color: #16a34a;
        }

        .stat-icon.new {
          background: #dbeafe;
          color: #2563eb;
        }

        .stat-icon.pending {
          background: #fef3c7;
          color: #d97706;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .overview-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button.primary {
          background: #3b82f6;
          color: white;
        }

        .action-button.primary:hover {
          background: #2563eb;
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .overview-container {
            padding: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stat-card {
            padding: 16px;
          }

          .stat-value {
            font-size: 28px;
          }

          .overview-actions {
            justify-content: center;
          }
        }
      </style>
    `;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const refreshButton = this.shadow.querySelector("#refresh-stats");
    refreshButton?.addEventListener("click", () => {
      this.fetchStats();
    });
  }

  private async fetchStats(): Promise<void> {
    try {
      const refreshButton = this.shadow.querySelector(
        "#refresh-stats"
      ) as HTMLButtonElement;
      if (refreshButton) {
        refreshButton.disabled = true;
        refreshButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <polyline points="23,4 23,10 17,10"></polyline>
            <polyline points="1,20 1,14 7,14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
          Actualizando...
        `;
      }

      const response = await fetch("http://localhost:8080/api/admin/promoters/stats");

      if (response.ok) {
        const data = await response.json();
        this.stats = {
          totalPromoters: data.total || 0,
          activePromoters: data.active || 0,
          newPromotersThisMonth: data.newThisMonth || 0,
          pendingPromoters: data.pending || 0,
        };
      } else {
        this.stats = this.getMockStats();
      }
    } catch (error) {
      console.error("Error fetching promoter stats:", error);
      this.stats = this.getMockStats();
    } finally {
      this.render();
    }
  }

  private getMockStats(): PromoterStats {
    // Datos de ejemplo para desarrollo
    const mockPromoters = [
      {
        id: "1",
        name: "Juan Pérez",
        email: "juan@example.com",
        status: "active",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        name: "María García",
        email: "maria@example.com",
        status: "active",
        createdAt: "2024-02-10",
      },
      {
        id: "3",
        name: "Carlos López",
        email: "carlos@example.com",
        status: "pending",
        createdAt: "2024-03-05",
      },
      {
        id: "4",
        name: "Ana Martínez",
        email: "ana@example.com",
        status: "active",
        createdAt: "2024-03-20",
      },
      {
        id: "5",
        name: "Luis Rodríguez",
        email: "luis@example.com",
        status: "inactive",
        createdAt: "2024-03-25",
      },
    ];

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const newThisMonth = mockPromoters.filter((promoter) => {
      const createdDate = new Date(promoter.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;

    const activePromoters = mockPromoters.filter(
      (p) => p.status === "active"
    ).length;
    const pendingPromoters = mockPromoters.filter(
      (p) => p.status === "pending"
    ).length;

    return {
      totalPromoters: mockPromoters.length,
      activePromoters,
      newPromotersThisMonth: newThisMonth,
      pendingPromoters,
    };
  }

  public refreshStats(): void {
    this.fetchStats();
  }

  public updateStats(stats: Partial<PromoterStats>): void {
    this.stats = { ...this.stats, ...stats };
    this.render();
  }
}

customElements.define("overview-component", OverviewComponent);

export default OverviewComponent;
