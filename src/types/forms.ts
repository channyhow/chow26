import { Action } from "./content";

export type FormFieldType = "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "date" | "time" | "number";

export type FormField = {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  minLength?: number;
  maxLength?: number;
  autoComplete?: string;
};

export type FormSchema = {
  id: string;
  name: string;
  provider?: "netlify" | "tally";
  formId?: string;
  embedUrl?: string;
  title?: string;
  fallbackHeight?: number;
  submitLabel?: string;
  fields: FormField[];
  links?: Action[];
};
