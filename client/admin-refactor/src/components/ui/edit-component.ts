class EditComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private isMenuOpen: boolean = false;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.loadStyles();
  }

  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
  }

  private async loadStyles(): Promise<void> {
    try {
      const styleModule = await import(
        "../../assets/components/ui/edit-menu.css?inline"
      );
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(styleModule.default);
      this.shadow.adoptedStyleSheets = [sheet];
    } catch (error) {
      console.error("Failed to load styles:", error);
    }
  }

  private async getSvgIcon(iconName: string): Promise<string> {
    try {
      const iconModule = await import(`@icons/${iconName}.svg?raw`);
      return iconModule.default;
    } catch (error) {
      console.error(`Failed to load icon ${iconName}:`, error);
      return "";
    }
  }

  private async render(): Promise<void> {
    const [menuEditIcon, menuTrashIcon] = await Promise.all([
      this.getSvgIcon("menu-edit-icon"),
      this.getSvgIcon("menu-trash-icon"),
    ]);

    this.shadow.innerHTML = `
      <div class="context-menu-container">
        <slot name="trigger"></slot>
        <div class="context-menu slide-in-blurred-top">
          <div class="section">
            <div class="section-title">Actions</div>
            <div class="menu-item">
              <div class="icon">${menuEditIcon}</div>
              <div class="menu-item-content">
                <div class="menu-item-title">Edit file</div>
                <div class="menu-item-description text-foreground-500">Allows you to edit the file</div>
              </div>
              <div class="shortcut">⌘E</div>
            </div>
          </div>
          <div class="separator"></div>
          <div class="section">
            <div class="section-title">Danger zone</div>
            <div class="menu-item danger">
              <div class="icon">${menuTrashIcon}</div>
              <div class="menu-item-content">
                <div class="menu-item-title">Delete file</div>
                <div class="menu-item-description text-foreground-500">Permanently delete the file</div>
              </div>
              <div class="shortcut">⌘D</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    const trigger = this.shadow.querySelector('slot[name="trigger"]');

    trigger?.addEventListener("contextmenu", (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const mouseEvent = e as MouseEvent;
      this.showContextMenu(mouseEvent.clientX, mouseEvent.clientY);
      this.isMenuOpen = true;
    });

    document.addEventListener("contextmenu", (e: Event) => {
      if (!this.isMenuOpen) return;

      const target = e.target as Node;
      const isOutside = !this.shadow.contains(target);
      if (isOutside) {
        e.preventDefault();
        this.hideContextMenu();
        this.isMenuOpen = false;
      }
    });

    document.addEventListener("click", (e: Event) => {
      if (!this.isMenuOpen) return;

      const target = e.target as Node;
      const isOutside = !this.shadow.contains(target);
      if (isOutside) {
        this.hideContextMenu();
        this.isMenuOpen = false;
      }
    });
  }

  private showContextMenu(x: number, y: number): void {
    const menu = this.shadow.querySelector(".context-menu") as HTMLElement;
    if (menu) {
      menu.style.display = "block";
      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
    }
  }

  private hideContextMenu(): void {
    const menu = this.shadow.querySelector(".context-menu") as HTMLElement;
    if (menu) {
      menu.style.display = "none";
    }
  }
}

customElements.define("edit-component", EditComponent);
