import css from "./home-component.css?raw";
import documentation from './svgs/documentation.svg?raw';
import pricing from './svgs/pricing.svg?raw';

import "@assets/font/Ndot-57.otf";

class HomeComponent extends HTMLElement {
  private shadow: ShadowRoot;

  static get observedAttributes() {
    return [];
  }

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

  public connectedCallback() {
    this.render();
    this.registerEvents();
    this.type();
  }

  public attributeChangedCallback() { }
  public updateAttributes() { }

  public type() {
    const typewriter = this.shadow.querySelector(
      ".typewriter h1"
    ) as HTMLElement;
    const cursor = this.shadow.querySelector(".cursor") as HTMLElement;

    const text = typewriter.textContent || "";
    let index = 0;
    let isDeleting = false;

    const typeEffect = () => {
      if (isDeleting) {
        typewriter.textContent = text.substring(0, index--);
      } else {
        typewriter.textContent = text.substring(0, index++);
      }

      if (!isDeleting && index === text.length) {
        setTimeout(() => (isDeleting = true), 3000);
      } else if (isDeleting && index === 0) {
        isDeleting = false;
      }

      setTimeout(typeEffect, isDeleting ? 100 : 200);
    };

    const blinkEffect = () => {
      if (cursor instanceof HTMLElement) {
        cursor.style.visibility =
          cursor.style.visibility === "hidden" ? "visible" : "hidden";
      }
      setTimeout(blinkEffect, 500);
    };

    typeEffect();
    blinkEffect();
  }

  public render() {
    this.shadow.innerHTML = /* html */ `
      <navbar-component></navbar-component>
      <section class="container">
        <div class="hero">
          <div class="hero-text">
            <div class="typewriter">
              <h1>Heap</h1>
            </div>
            <p>Best <span class="highlight">development</span> services!</p>
          </div>
          <div class="hero-actions">
            <button class="pricing">
              ${pricing}
              <span>Pricing</span>
            </button>
            <button class="documentation">
              ${documentation}
              <span>About</span>
          </button>
          </div>
        </div>
        <div class="section1">
          <services-component></services-component>
        </div>
      </section>
    `;

    // UIkit.tooltip(this.shadow.getElementById('register'))
  }
  private registerEvents() {
    const inputs = this.shadow.querySelectorAll("input");
    const checkbox = this.shadow.querySelector('input[type="checkbox"]');

    if (checkbox) {
      checkbox.addEventListener("change", (event) => {
        const input = event.target as HTMLInputElement;
        const passwordInput = this.shadow.getElementById(
          "password"
        ) as HTMLInputElement;
        const repeatPasswordInput = this.shadow.getElementById(
          "repeat-password"
        ) as HTMLInputElement;

        if (!input.checked) {
          passwordInput.type = "password";
          repeatPasswordInput.type = "password";
        } else {
          passwordInput.type = "text";
          repeatPasswordInput.type = "text";
        }
      });
    }

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        const passwordInput = this.shadow.getElementById(
          "password"
        ) as HTMLInputElement;
        const repeatPasswordInput = this.shadow.getElementById(
          "repeat-password"
        ) as HTMLInputElement;
        const registerButton = this.shadow.getElementById(
          "register"
        ) as HTMLButtonElement;

        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;

        const hasMinLength = password.length >= 8;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const equalPasswords =
          password === repeatPassword && password.length > 0;
        const valid =
          hasMinLength &&
          hasSpecialChar &&
          hasUppercase &&
          hasNumber &&
          equalPasswords;

        const sizeRequirement = this.shadow.querySelector(".requirement.size");
        const specialRequirement = this.shadow.querySelector(
          ".requirement.special"
        );
        const uppercaseRequirement = this.shadow.querySelector(
          ".requirement.uppercase"
        );
        const numberRequirement = this.shadow.querySelector(
          ".requirement.number"
        );
        const equalsRequirement = this.shadow.querySelector(
          ".requirement.equals"
        );

        const requirements = [
          { condition: hasMinLength, element: sizeRequirement },
          { condition: hasSpecialChar, element: specialRequirement },
          { condition: hasUppercase, element: uppercaseRequirement },
          { condition: hasNumber, element: numberRequirement },
          { condition: equalPasswords, element: equalsRequirement },
        ];

        requirements.forEach(({ condition, element }) => {
          this.changeValidatorState(condition, element as HTMLElement);
        });

        registerButton.disabled = !valid;
      });
    });
  }

  public changeValidatorState(valid: boolean, validator: HTMLElement): void {
    const error = validator.querySelector(".error-svg") as HTMLElement;
    const success = validator.querySelector(".success-svg") as HTMLElement;

    if (!error || !success) return;

    if (valid) {
      validator.classList.add("success");
      validator.classList.remove("error");

      error.classList.remove("active");
      success.classList.add("active");
    } else {
      validator.classList.remove("success");
      validator.classList.add("error");

      error.classList.add("active");
      success.classList.remove("active");
    }
  }
}

customElements.define("home-component", HomeComponent);
