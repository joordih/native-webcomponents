import { FormSchema } from "../components/forms/form-schema";

declare namespace JSX {
  interface IntrinsicElements {
    form: HTMLFormElement & {
      schema?: FormSchema;
    };
  }
}
