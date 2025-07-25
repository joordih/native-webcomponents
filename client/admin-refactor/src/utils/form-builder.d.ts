export interface FormFieldConfig {
  id: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "datetime-local"
    | "tel"
    | "url"
    | "search"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  value?: string | number | boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
  options?: Array<{ value: string | number; label: string }>;
  attributes?: Record<string, string | number | boolean>;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export interface TabConfig {
  id: string;
  label: string;
  icon?: string;
  fields: FormFieldConfig[];
  visible?: boolean;
  disabled?: boolean;
}

export interface FormBuilderConfig {
  id: string;
  title?: string;
  tabs: TabConfig[];
  actions?: {
    save?: {
      label?: string;
      endpoint?: string;
      method?: "POST" | "PUT" | "PATCH";
      onSuccess?: (response: any) => void;
      onError?: (error: any) => void;
    };
    cancel?: {
      label?: string;
      onClick?: () => void;
    };
    delete?: {
      label?: string;
      endpoint?: string;
      onSuccess?: (response: any) => void;
      onError?: (error: any) => void;
    };
  };
  validation?: {
    validateOnChange?: boolean;
    validateOnSubmit?: boolean;
    showErrorMessages?: boolean;
  };
  styling?: {
    theme?: "light" | "dark" | "auto";
    customCSS?: string;
    classes?: {
      container?: string;
      header?: string;
      tabs?: string;
      content?: string;
      actions?: string;
    };
  };
}

export interface FormBuilderEventDetail {
  formId: string;
  action:
    | "save"
    | "cancel"
    | "delete"
    | "tabChange"
    | "fieldChange"
    | "validate";
  data?: Record<string, any>;
  field?: string;
  tab?: string;
  errors?: Record<string, string>;
}

export interface FormBuilderState {
  activeTab: string;
  formData: Record<string, any>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

declare namespace JSX {
  interface IntrinsicElements {
    "visual-form-builder": HTMLElement & {
      config?: FormBuilderConfig;
      data?: Record<string, any>;
      mode?: "create" | "edit" | "view";
      onFormSubmit?: (event: CustomEvent<FormBuilderEventDetail>) => void;
      onFormCancel?: (event: CustomEvent<FormBuilderEventDetail>) => void;
      onFormDelete?: (event: CustomEvent<FormBuilderEventDetail>) => void;
      onTabChange?: (event: CustomEvent<FormBuilderEventDetail>) => void;
      onFieldChange?: (event: CustomEvent<FormBuilderEventDetail>) => void;
    };
  }
}

export declare class VisualFormBuilder extends HTMLElement {
  config: FormBuilderConfig;
  data: Record<string, any>;
  mode: "create" | "edit" | "view";
  state: FormBuilderState;

  setConfig(config: FormBuilderConfig): void;
  setData(data: Record<string, any>): void;
  setMode(mode: "create" | "edit" | "view"): void;
  getData(): Record<string, any>;
  validate(): boolean;
  reset(): void;
  show(): void;
  hide(): void;
  switchTab(tabId: string): void;
}
