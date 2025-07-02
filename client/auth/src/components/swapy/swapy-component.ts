import { createSwapy, SwapEvent } from "swapy";
import css from "./swapy-component.css?raw";

class SwapyComponent extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.loadStyles();
  }

  private loadStyles(): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  connectedCallback(): void {
    this.render();
    this.initSwapy();
  }

  render(): void {
    this.shadow.innerHTML = `
      <div class="parent">
        <div class="div1" data-swapy-slot="1">
          <div data-swapy-item="item1">1</div>
        </div>
        <div class="div2" data-swapy-slot="2">
          <div data-swapy-item="item2">2</div>
        </div>
        <div class="div3" data-swapy-slot="3">
          <div data-swapy-item="item3">3</div>
        </div>
        <div class="div4" data-swapy-slot="4">
          <div data-swapy-item="item4">4</div>
        </div>
        <div class="div5" data-swapy-slot="5">
          <div data-swapy-item="item5">5</div>
        </div>
        <div class="div6" data-swapy-slot="6">
          <div data-swapy-item="item6">6</div>
        </div>
        <div class="div7" data-swapy-slot="7">
          <div data-swapy-item="item7">7</div>
        </div>
        <div class="div8" data-swapy-slot="8">
          <div data-swapy-item="item8">8</div>
        </div>
        <div class="div9" data-swapy-slot="9">
          <div data-swapy-item="item9">9</div>
        </div>
        <div class="div10" data-swapy-slot="10">
          <div data-swapy-item="item10">10</div>
        </div>
        <div class="div11" data-swapy-slot="11">
          <div data-swapy-item="item11">11</div>
        </div>
        <div class="div12" data-swapy-slot="12">
          <div data-swapy-item="item12">12</div>
        </div>
      </div>
    `;
  }

  initSwapy(): void {
    const parent = this.shadow.querySelector(".parent") as HTMLElement;
    const swapy = createSwapy(parent, {
      animation: "spring",
      swapMode: "drop",
    });

    swapy.onSwap((event: SwapEvent) => {
      console.log(event);
    });
  }
}

customElements.define("swapy-component", SwapyComponent);
