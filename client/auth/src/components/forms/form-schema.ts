const AUTOCOMPLETE_TOKENS = {
  ON: "on",
  OFF: "off",
  NAME: "name",
  HONORIFIC_PREFIX: "honorific-prefix",
  GIVEN_NAME: "given-name",
  ADDITIONAL_NAME: "additional-name",
  FAMILY_NAME: "family-name",
  HONORIFIC_SUFFIX: "honorific-suffix",
  NICKNAME: "nickname",
  USERNAME: "username",
  EMAIL: "email",
  IMPP: "impp",
  CURRENT_PASSWORD: "current-password",
  NEW_PASSWORD: "new-password",
  ONE_TIME_CODE: "one-time-code",
  ORGANIZATION_TITLE: "organization-title",
  ORGANIZATION: "organization",
  STREET_ADDRESS: "street-address",
  ADDRESS_LINE1: "address-line1",
  ADDRESS_LINE2: "address-line2",
  ADDRESS_LINE3: "address-line3",
  ADDRESS_LEVEL4: "address-level4",
  ADDRESS_LEVEL3: "address-level3",
  ADDRESS_LEVEL2: "address-level2",
  ADDRESS_LEVEL1: "address-level1",
  COUNTRY: "country",
  COUNTRY_NAME: "country-name",
  POSTAL_CODE: "postal-code",
  TEL: "tel",
  CC_NAME: "cc-name",
  CC_GIVEN_NAME: "cc-given-name",
  CC_ADDITIONAL_NAME: "cc-additional-name",
  CC_FAMILY_NAME: "cc-family-name",
  CC_NUMBER: "cc-number",
  CC_EXP: "cc-exp",
  CC_EXP_MONTH: "cc-exp-month",
  CC_EXP_YEAR: "cc-exp-year",
  CC_CSC: "cc-csc",
  CC_TYPE: "cc-type",
  TRANSACTION_CURRENCY: "transaction-currency",
  TRANSACTION_AMOUNT: "transaction-amount",
  LANGUAGE: "language",
  BDAY: "bday",
  BDAY_DAY: "bday-day",
  BDAY_MONTH: "bday-month",
  BDAY_YEAR: "bday-year",
  SEX: "sex",
  URL: "url",
  PHOTO: "photo",
} as const;

type AutoCompleteToken =
  (typeof AUTOCOMPLETE_TOKENS)[keyof typeof AUTOCOMPLETE_TOKENS];

interface FormField {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  autocomplete?: AutoCompleteToken;
}

interface TextField extends FormField {
  type: "text" | "email" | "password" | "number";
  placeholder?: string;
}

interface SelectField extends FormField {
  type: "select";
  options: (string | { value: string; label: string })[];
}

interface DateField extends FormField {
  type: "date";
  placeholder?: string;
  min?: string;
  max?: string;
}

type Field = TextField | SelectField | DateField;

interface FormSchema {
  fields: Field[];
}

interface InputConfig {
  element: "input" | "select";
  attributes: string[];
  defaultAttributes?: Record<string, any>;
  customHandler?: (element: HTMLElement, field: Field) => void;
  validator?: (field: Field) => boolean;
}

const INPUT_CONFIGS: Record<string, InputConfig> = {
  text: {
    element: "input",
    attributes: ["type", "placeholder", "maxlength", "minlength"],
    defaultAttributes: { type: "text" },
  },
  email: {
    element: "input",
    attributes: ["type", "placeholder"],
    defaultAttributes: { type: "email" },
  },
  password: {
    element: "input",
    attributes: ["type", "placeholder"],
    defaultAttributes: { type: "password" },
  },
  number: {
    element: "input",
    attributes: ["type", "min", "max", "step", "placeholder"],
    defaultAttributes: { type: "number" },
  },
  date: {
    element: "input",
    attributes: ["type", "min", "max"],
    defaultAttributes: { type: "date" },
    customHandler: (element, field) => {
      const dateField = field as DateField;
      const inputElement = element as HTMLInputElement;

      if (dateField.min) {
        inputElement.min = dateField.min;
      }
      if (dateField.max) {
        inputElement.max = dateField.max;
      }

      let previousValidationState: boolean | null = null;

      const validateDate = () => {
        const value = inputElement.value;
        let isValid = true;
        let errorMessage = "";

        if (dateField.required && !value) {
          isValid = false;
          errorMessage = "This field is required";
        } else if (value) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value)) {
            isValid = false;
            errorMessage = "Please enter a valid date format (YYYY-MM-DD)";
          } else {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              isValid = false;
              errorMessage = "Please enter a valid date";
            } else {
              if (dateField.min && value < dateField.min) {
                isValid = false;
                errorMessage = `Date must be after ${dateField.min}`;
              } else if (dateField.max && value > dateField.max) {
                isValid = false;
                errorMessage = `Date must be before ${dateField.max}`;
              }
            }
          }
        }

        if (previousValidationState !== isValid) {
          inputElement.classList.remove("invalid", "valid");

          if (isValid) {
            inputElement.classList.add("valid");
            inputElement.setCustomValidity("");
          } else {
            inputElement.classList.add("invalid");
            inputElement.setCustomValidity(errorMessage);
          }

          previousValidationState = isValid;
        }

        return isValid;
      };

      inputElement.addEventListener("input", validateDate);
      inputElement.addEventListener("blur", validateDate);
      inputElement.addEventListener("change", validateDate);
      inputElement.addEventListener("form-value-change", validateDate);

      validateDate();
    },
  },
  select: {
    element: "select",
    attributes: ["multiple"],
    customHandler: (element, field) => {
      const selectField = field as SelectField;
      selectField.options.forEach((option) => {
        const optionElement = document.createElement("option");
        if (typeof option === "string") {
          optionElement.value = option;
          optionElement.textContent = option;
        } else {
          optionElement.value = option.value;
          optionElement.textContent = option.label;
        }
        element.appendChild(optionElement);
      });
    },
  },
};

export {
  AutoCompleteToken,
  FormSchema,
  Field,
  TextField,
  SelectField,
  DateField,
  FormField,
  InputConfig,
  AUTOCOMPLETE_TOKENS,
  INPUT_CONFIGS,
};
