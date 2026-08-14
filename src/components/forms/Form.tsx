import { useState, type FormEvent } from "react";

import siteData from "@/data/site.json";

import type { Action } from "@/types/content";
import type { FormField, FormSchema } from "@/types/forms";

import { Actions } from "../navigation/Actions";
import { TallyFormEmbed } from "./TallyFormEmbed";

type FormControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const DEFAULT_MAX_LENGTH: Partial<Record<FormField["type"], number>> = {
  text: 120,
  email: 254,
  tel: 32,
  textarea: 3000,
};

const normalizeText = (value: string) =>
  Array.from(value)
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return (
        codePoint === 9 ||
        codePoint === 10 ||
        codePoint === 13 ||
        (codePoint >= 32 && codePoint !== 127)
      );
    })
    .join("")
    .trim();

const resolveTallyFormId = (schema: FormSchema) => {
  if (schema.formId) return schema.formId;

  if (schema.name === "project-call") {
    return import.meta.env.VITE_TALLY_RESERVATION_FORM_ID;
  }

  return import.meta.env.VITE_TALLY_CONTACT_FORM_ID;
};

export function Form({ schema }: { schema: FormSchema }) {
  const formCopy = siteData.ui.copy.forms;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const tallyFormId = resolveTallyFormId(schema);
  const hasTallySource = Boolean(tallyFormId || schema.embedUrl);
  const useTally =
    hasTallySource &&
    (schema.provider === "tally" || schema.name === "project-enquiry");

  if (useTally) {
    return (
      <div className="form form--tally">
        <TallyFormEmbed
          formId={tallyFormId}
          embedUrl={schema.embedUrl}
          title={schema.title ?? "Formulaire de contact"}
          fallbackHeight={schema.fallbackHeight}
        />
      </div>
    );
  }

  const formActions: Action[] = [
    {
      label: schema.submitLabel ?? formCopy.defaultSubmitLabel,
      intent: "submit",
      priority: "primary",
      variant: "primary",
    },
  ];

  const getErrorMessage = (control: FormControl) => {
    if (control.validity.valueMissing) return formCopy.requiredError;
    if (control.validity.typeMismatch && control.type === "email") return formCopy.emailError;
    if (
      control.validity.badInput ||
      control.validity.rangeOverflow ||
      control.validity.rangeUnderflow ||
      control.validity.stepMismatch
    ) {
      return formCopy.numberError;
    }
    return formCopy.genericError;
  };

  const handleInvalid = (event: FormEvent<FormControl>) => {
    event.preventDefault();
    const control = event.currentTarget;
    setErrors((current) => ({
      ...current,
      [control.name]: getErrorMessage(control),
    }));
  };

  const clearError = (name: string) => {
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const normalizeControl = (control: HTMLInputElement | HTMLTextAreaElement) => {
    if (control.type === "checkbox") return;
    control.value = normalizeText(control.value);
  };

  return (
    <form
      className="form"
      name={schema.name}
      method="POST"
      action="/contact"
      acceptCharset="UTF-8"
      data-netlify="true"
      data-netlify-honeypot="website"
    >
      <input type="hidden" name="form-name" value={schema.name} />

      <p hidden aria-hidden="true">
        <label>
          Ne pas remplir ce champ
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="form__body">
        {schema.fields.map((field) => {
          const fieldId = `${schema.name}-${field.name}`;
          const errorId = `${fieldId}-error`;
          const error = errors[field.name];
          const maxLength = field.maxLength ?? DEFAULT_MAX_LENGTH[field.type];

          if (field.type === "checkbox") {
            return (
              <label className="form__field form__field--checkbox" key={field.name} htmlFor={fieldId}>
                <input
                  id={fieldId}
                  className="form__control form__control--checkbox"
                  name={field.name}
                  type="checkbox"
                  required={field.required}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onInvalid={handleInvalid}
                  onChange={() => clearError(field.name)}
                />
                <span className="form__label">{field.label}</span>
                {error ? <span id={errorId} className="form__error" role="alert">{error}</span> : null}
              </label>
            );
          }

          return (
            <label className="form__field" key={field.name} htmlFor={fieldId}>
              <span className="form__label">{field.label}</span>

              {field.type === "textarea" ? (
                <textarea
                  id={fieldId}
                  className="form__control"
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  rows={6}
                  minLength={field.minLength}
                  maxLength={maxLength}
                  autoComplete={field.autoComplete}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onInvalid={handleInvalid}
                  onChange={() => clearError(field.name)}
                  onBlur={(event) => normalizeControl(event.currentTarget)}
                />
              ) : field.type === "select" ? (
                <select
                  id={fieldId}
                  className="form__control"
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                  autoComplete={field.autoComplete}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onInvalid={handleInvalid}
                  onChange={() => clearError(field.name)}
                >
                  <option value="" disabled>{formCopy.selectPlaceholder}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={fieldId}
                  className="form__control"
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  minLength={field.minLength}
                  maxLength={maxLength}
                  autoComplete={field.autoComplete}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onInvalid={handleInvalid}
                  onChange={() => clearError(field.name)}
                  onBlur={(event) => normalizeControl(event.currentTarget)}
                />
              )}

              {error ? <span id={errorId} className="form__error" role="alert">{error}</span> : null}
            </label>
          );
        })}
      </div>

      <footer className="form__footer">
        <Actions links={formActions} className="form__actions" />
      </footer>
    </form>
  );
}
