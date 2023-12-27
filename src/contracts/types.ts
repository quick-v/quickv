import { RulesMessages } from ".";
import { QvForm } from "../validation";
import { Rule } from "./rule";

/**
 * Represents a CSS selector that can be either an HTMLElement or a string.
 * @typedef {HTMLElement | string} CssSelector
 */
export type CssSelector = HTMLElement | string;

/**
 * Represents a validatable HTML form input element.
 */
export type ValidatableInput =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | "select"
  | "textarea"
  | "input"
  | string;

/**
 * Represents a validatable HTML form element.
 */
export type ValidatableForm = HTMLElement | string | "form";
/**
 * The possible input types expected to be gotten
 */
export type InputValueType =
  | string
  | Blob
  | File
  | number
  | null
  | boolean
  | undefined
  | FileList;

/**
 * An Element or null type
 */
export type ElementOrNull = HTMLElement | null;

/**
 * Indicates whether the message should be displayed
 */
export type WayDisplayError = "first" | "last" | "full";

/**
 * Input parameters that can be passed to QvInput instance instead of qv-attributes
 */
export type QvInputParms = {
  /**
   * The HTML element that will be used to display error messages for this input element.
   */
  feedbackElement?: ElementOrNull;
  /**
   * An array of rules that will be used to validate the input element.
   */
  rules?: Rule[] | string[];
  /**
   * An object that maps rule names to error messages.
   */
  messages?: string[];
  /**
   * The name of the input element.
   */
  name?: string;
  /**
   * The way that error messages will be displayed.
   */
  showMessage?: WayDisplayError;
  /**
   * An array of events that will trigger validation of the input element.
   */
  events?: string[];
  /**
   * Check if input will be validated when user tape into input
   */
  autoValidate?: boolean;

  /**
   * The attribute that will be used to display the error message instead of using the input name directly
   */
  attribute?: string;

  /**
   *If this field is true, the validation will stop at the first error. And will display the error at the same time
   */
  failsOnfirst?: boolean;
  /**
   * If this field is true, each time the validation has been performed,
   * a qv.input.validated event will be emitted, on which we can connect listeners for example
   */
  emitEvent?: boolean;

  /**
   * This field is useful for customizing error messages. By to rewrite the default messages
   */
  errors?: RulesMessages;
  /**
   * The css class that will be added to the input each time the form is valid
   */
  validClass?: string;

  /**
   * The css class that will be added to the input each time the form is invalid
   */
  invalidClass?: string;
  /**
   * Indicates input type
   */
  type?: string;
};

/**
 * Callback function for handling events.
 *
 * @param event - The event object.
 */
export type EventCallback = (event: Event) => void;

/**
 * Callback function for handling events.
 *
 * @param details - The event object.
 */
export type EventCallbackWithDetails<T> = (details: T) => void;
export type QvFormConfig = {
  /**
   * Specifies whether the form will be validated as the user types in the form fields
   */
  auto?: boolean;

  local?: {
    lang?: string;
  };
  /**
   * The css valid class  that will be added to all the input in  the form
   */
  validClass?: string;

  /**
   * The css invalid class that will be added to all the input in the form
   */
  invalidClass?: string;
};

export type QvFormHandler = (qv: QvForm) => unknown;
