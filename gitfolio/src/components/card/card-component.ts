import UIkit from "uikit";
import css from "../../assets/franken-ui.css?raw";

class CardComponent extends HTMLElement {
  private shadow: ShadowRoot;

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  public loadStyles(): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  public connectedCallback() {
    this.render();
  }

  public render(): void {
    this.shadow.innerHTML = /* html */ `
      <div id="gitcard" class="uk-card max-w-sm">
        <div class="uk-card-header">
          <h3 class="uk-card-title">Create project</h3>
          <p class="mt-2 text-muted-foreground">
            Deploy your new project in one-click.
          </p>
        </div>
        <div class="uk-card-body">
          <div class="">
            <label class="uk-form-label" for="name">Name</label>
            <div class="uk-form-controls mt-2">
              <input
                class="uk-input"
                id="name"
                type="text"
                aria-describedby="name-help-block"
                placeholder="Name"
              />
              <div id="name-help-block" class="uk-form-help mt-2">
                The name of your project.
              </div>
            </div>
          </div>


          <div class="mt-4">
            <label class="uk-form-label" for="framework">Framework</label>
            <div class="uk-form-controls mt-2">
              <select class="uk-select" name="framework">
                <option value="sveltekit">Sveltekit</option>
                <option value="astro" selected>Astro</option>
              </select>
            </div>
          </div>
        </div>


        <div class="uk-card-footer flex justify-between">
          <button class="uk-btn uk-btn-default">Cancel</button>
          <button class="uk-btn uk-btn-primary">Deploy</button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const buttons = this.shadow.querySelectorAll(".uk-btn");
      const cards = this.shadow.querySelectorAll(".uk-card");
      const inputs = this.shadow.querySelectorAll(".uk-input");
      const selects = this.shadow.querySelectorAll(".uk-select");

      if (typeof UIkit !== "undefined" && UIkit.util) {
        UIkit.util.ready(() => {
          console.log("UIKit components ready in shadow DOM");
          console.log(
            `Found ${buttons.length} buttons, ${cards.length} cards, ${inputs.length} inputs, ${selects.length} selects`
          );
        });
      }
    }, 0);
  }
}

customElements.define("card-component", CardComponent);
