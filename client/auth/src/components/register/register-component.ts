
import css from './register-component.css?raw';

import successSvg from './svgs/success.svg?raw';
import errorSvg from './svgs/error.svg?raw';

class RegisterComponent extends HTMLElement {
  private shadow: ShadowRoot;

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
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
  }

  public attributeChangedCallback() { }
  public updateAttributes() { }

  public render() {
    this.shadow.innerHTML =
    /* html */`
      <div class="container">
        <div class="art">
          <div class="title">
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21.5L17.5 13L13 10L15 2.5L6.5 11L11 14L9 21.5Z" fill="currentColor" />
            </svg>
            <p>Admin Panel</p>
          </div>

          <div class="footer">
            <p>"Thanks for being part of my admin panel, I hope you enjoy!"</p>
            <p>Jordi X.</p>
          </div>
        </div>
        <div class="forms">
          <div class="change-auth">
            <h2>Login</h2>
          </div>
          <div class="form">
            <h1>Create an account</h1>
            <p>Enter your password to continue</p>

            <p class="requirement size error">
              ${successSvg}
              ${errorSvg}
              More than 8 characters
            </p>
            <p class="requirement special error">
              ${successSvg}
              ${errorSvg}
              At least 1 special character
            </p>
            <p class="requirement uppercase error">
              ${successSvg}
              ${errorSvg}
              At least 1 uppercase
            </p>
            <p class="requirement number error">
              ${successSvg}
              ${errorSvg}
              At least 1 number
            </p>
            <p class="requirement equals error">
              ${successSvg}
              ${errorSvg}
              Equal passwords
            </p>

            <div class="inputs">
              <input id="password" type="password" placeholder="Enter your password">
              <input id="repeat-password" type="password" placeholder="Repeat your password">
              <div class="checkbox-wrapper-4">
                <input class="inp-cbx" id="morning" type="checkbox">
                <label class="cbx" for="morning"><span>
                <svg width="12px" height="10px">
                  
                </svg></span><span>Show password</span></label>
                <svg class="inline-svg">
                  <symbol id="check-4" viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                  </symbol>
                </svg>
              </div>
              <button id="register">Register</button>

              <p>
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  private registerEvents() {
    const inputs = this.shadow.querySelectorAll("input");
    const checkbox = this.shadow.querySelector('input[type="checkbox"]');

    if (checkbox) {
      checkbox.addEventListener('change', (event) => {
        const input = event.target as HTMLInputElement;
        const passwordInput = this.shadow.getElementById('password') as HTMLInputElement;
        const repeatPasswordInput = this.shadow.getElementById('repeat-password') as HTMLInputElement;

        if (!input.checked) {
          passwordInput.type = "password";
          repeatPasswordInput.type = "password";
        } else {
          passwordInput.type = "text";
          repeatPasswordInput.type = "text";
        }
      });
    }

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const passwordInput = this.shadow.getElementById('password') as HTMLInputElement;
        const repeatPasswordInput = this.shadow.getElementById('repeat-password') as HTMLInputElement;
        const registerButton = this.shadow.getElementById('register') as HTMLButtonElement;

        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;

        const hasMinLength = password.length >= 8;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const equalPasswords = password === repeatPassword && password.length > 0;
        const valid = hasMinLength && hasSpecialChar && hasUppercase && hasNumber && equalPasswords;

        const sizeRequirement = this.shadow.querySelector('.requirement.size');
        const specialRequirement = this.shadow.querySelector('.requirement.special');
        const uppercaseRequirement = this.shadow.querySelector('.requirement.uppercase');
        const numberRequirement = this.shadow.querySelector('.requirement.number');
        const equalsRequirement = this.shadow.querySelector('.requirement.equals');

        const requirements = [
          { condition: hasMinLength, element: sizeRequirement },
          { condition: hasSpecialChar, element: specialRequirement },
          { condition: hasUppercase, element: uppercaseRequirement },
          { condition: hasNumber, element: numberRequirement },
          { condition: equalPasswords, element: equalsRequirement }
        ];

        requirements.forEach(({ condition, element }) => {
          this.changeValidatorState(condition, element as HTMLElement);
        });

        registerButton.disabled = !valid;
      });
    });
  }

  public changeValidatorState(valid: boolean, validator: HTMLElement): void {
    const error = validator.querySelector('.error-svg') as HTMLElement;
    const success = validator.querySelector('.success-svg') as HTMLElement;

    if (!error || !success) return;

    if (valid) {
      validator.classList.add('success');
      validator.classList.remove('error');

      error.classList.remove('active');
      success.classList.add('active');
    } else {
      validator.classList.remove('success');
      validator.classList.add('error');

      error.classList.add('active');
      success.classList.remove('active');
    }
  }
}

customElements.define('register-component', RegisterComponent);
