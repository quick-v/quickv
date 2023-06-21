import { QValidation, QvBag } from ".";
import { Rule, RulesMessages } from "../contracts";
import { QvInputParms, ValidatableInput } from "../contracts/types";
import { QvLocal } from "../locale/qv-local";
import { ValidationErrorMessage } from "../messages";
import { getRule } from "../utils";
import { NativeValidation } from "./native-validation";

/**
 * @author Claude Fassinou
 */
export abstract class AbstractInputValidator {
  /**
   * This status indicates the current state of the form
   */
  protected _passed = false;
  /**
   * Quickv Validator
   */
  protected validator!: QValidation;
  /** Input element which must be validate */
  protected inputElement!: HTMLInputElement;
  /** Error feedback element */
  protected feedbackElement: HTMLElement | null = null;

  /**
   * Rules list
   */
  protected rules: Rule[] = [];

  /**
   * Input messages
   */
  protected messages = {} as RulesMessages;

  /** Current input errors */
  protected _errors: string[] = [];

  /**
   * Input name
   */
  protected name = "";

  /**
   * How to show the message
   */
  protected showMessage = "first";

  protected showMessages = ["first", "full", "last"];

  /** Wich class assign to input if validation pass */
  protected validClass = "";

  /** Wich class assign to input if validation failed */
  protected invalidClass = "is-invalid";

  protected param: QvInputParms = {
    emitEvent: true,
    autoValidate: true,
    failsOnfirst: true,
    events: ["blur", "input", "change"],
    validClass: "",
    invalidClass: "is-invalid",
    type: "text",
  };

  constructor(selector: ValidatableInput, params?: QvInputParms) {
    this.validator = new QValidation(this.param);
    this.setInputElement(selector);
    this._setParams(params);

    this.setRules(params?.rules);
    this.setInputName();
    this.setFeedbackElement();
    this.setShowMessage();
    this._setValidationClass();

    this._setErrors();
    this._setEvent(params?.events);
    this.validator.setParams(this.param);
  }
  /**
   *Set input rules from input
   * @returns
   */
  setRules(rules?: string[]) {
    let ruleSrring: string = this.inputElement.dataset.qvRules ?? "";

    if (ruleSrring) {
      const rulesClean = ruleSrring.split("|").filter((r) => r.length > 0);
      //Register each rule
      for (const rule of rulesClean as Rule[]) {
        if (QvBag.hasRule(getRule(rule).ruleName)) {
          this.rules.push(rule);
        } else {
          throw new Error(
            `The validation rule ${rule} is not supported by QuickV`
          );
        }
      }
    }
    //Merge with natve attributes validation rules
    const nativeValidation = new NativeValidation(this.inputElement);
    //Merge rules
    this.rules = nativeValidation.merge((rules as Rule[]) ?? this.rules);

    this.param.rules = this.rules;
    return this;
  }

  abstract validate(): boolean;

  protected _setEvent(events?: string[]) {
    const ev = this.inputElement.dataset.qvEvents;

    if (ev) {
      this.param.events = ev.split("|").length
        ? ev.split("|")
        : this.param.events;
    }

    this.param.events = events ?? this.param.events;
  }

  /**
   * Sets the input element for validation.
   * This method should be called before calling the 'init' method.
   * @param {ValidatableInput} inputElement - The input element or selector string representing the input element.
   * @throws {Error} If the input element is not valid or cannot be found.
   */
  private setInputElement(inputElement: ValidatableInput) {
    if (!(inputElement instanceof Element)) {
      const el = document.querySelector<HTMLElement>(inputElement);
      if (el) {
        inputElement = el as ValidatableInput;
      }
    }

    if (!(inputElement instanceof Element)) {
      throw new Error(
        "The 'inputElement' parameter must be valide 'ValidatableInput' type."
      );
    }

    this.inputElement = inputElement as HTMLInputElement;
    this.param.type = this.inputElement.type;
    if (this.inputElement.tagName.toLowerCase() === "textarea") {
      this.param.type = "text";
    }
  }

  private setInputName() {
    let name: string | undefined = this.inputElement.name;

    if (
      name === undefined ||
      name === null ||
      (typeof name === "string" && name.length < 0)
    ) {
      throw new Error("The input name could not be empty or null");
    }

    this.name = name;
    let attr = this.name;

    if (this.inputElement.dataset.qvName) {
      attr = this.inputElement.dataset.qvName;
    }

    this.param.attribute = attr;
  }

  set errors(value: any) {
    if (value) {
      this._errors = value ?? [];
    }
    this.showErrorMessages();
  }

  /**
   * Searches for the closest HTML element with a custom data attribute "data-qv-feedback"
   * that is associated with the current input element, and stores a reference to it.
   *
   */
  private setFeedbackElement() {
    const inputElement = this.inputElement;

    let parentElement = inputElement.parentElement;
    let feedbackElement: HTMLElement | null = null;

    while (parentElement && !feedbackElement) {
      feedbackElement = parentElement.querySelector(
        `[data-qv-feedback='${this.name}']`
      );
      parentElement = parentElement.parentElement;
    }
    this.feedbackElement = feedbackElement;
    this.param.feedbackElement = this.param.feedbackElement ?? feedbackElement;
  }

  /**
   * Shows error messages based on the value of the "qv-show" attribute
   * The "showMessage" property determines how the error messages are displayed.
   *
   */
  private showErrorMessages() {
    this.feedbackElement instanceof HTMLElement;

    //If feedback element existe
    if (this.feedbackElement instanceof HTMLElement) {
      let message = "";
      if (Array.isArray(this._errors)) {
        //Get error
        message = this._errors[0];
        if (this.showMessage == "full") {
          message = this._errors.join("<br>");
        } else if (this.showMessage == "last") {
          if (this._errors.length > 0) {
            message = this._errors[this._errors.length - 1];
          }
        }
      }
      this.feedbackElement.innerHTML = message ?? "";
    }
  }
  /**
   * Get and set the ways error message will be displayed
   */
  private setShowMessage() {
    this.showMessage = this.inputElement.dataset.qvShow ?? "first";
    this.showMessage = this.showMessages.includes(this.showMessage)
      ? this.showMessage
      : "first";
  }

  private _setValidationClass() {
    //Set class from config

    this.invalidClass =
      this.inputElement.dataset.qvInvalidClass ?? this.invalidClass;
    this.validClass = this.inputElement.dataset.qvValidClass ?? this.validClass;

    //Overwrite class if they on attribute
    this.invalidClass = this.param.invalidClass ?? this.invalidClass;
    this.validClass = this.param.validClass ?? this.validClass;
  }

  protected setValidationClass() {
    const isValid = this._passed;
    const removeClass = (cls: string) => {
      if (cls.length > 0) {
        this.inputElement.classList.remove(cls);
      }
    };
    const addClass = (cls: string) => {
      if (cls.length > 0) {
        this.inputElement.classList.add(cls);
      }
    };

    if (isValid) {
      this.invalidClass.split(" ").forEach(removeClass);
      this.validClass.split(" ").forEach(addClass);
      this.inputElement.setAttribute("data-qv-valid", "1");
    } else {
      this.validClass.split(" ").forEach(removeClass);
      this.invalidClass.split(" ").forEach(addClass);
      this.inputElement.setAttribute("data-qv-valid", "0");
    }
  }

  private _setErrors(errors?: RulesMessages) {
    const elMessages = this.inputElement.dataset.qvMessages;
    let oms: RulesMessages = {} as any;
    for (let i = 0; i < this.rules.length; i++) {
      let messages =
        elMessages?.split("|").map((message) => message.trim()) ?? [];
      if (messages) {
        const vem = new ValidationErrorMessage(this.rules, messages);
        messages = vem.getMessages();
      }
      const customMessage = messages !== undefined ? messages[i] : "";
      const rule = getRule(this.rules[i]).ruleName;
      if (typeof customMessage == "string" && customMessage.length > 0) {
        oms[rule] = customMessage;
      } else {
        oms[rule] = QvLocal.getRuleMessage(rule, QvLocal.getLocal());
      }
    }

    if (
      typeof errors !== "undefined" &&
      typeof errors === "object" &&
      Object.values(errors).length > 0
    ) {
      this.param.errors = errors;
    } else {
      this.param.errors = oms;
    }
  }

  getName() {
    return this.name;
  }
  getValue() {
    if (this.inputElement.type.toLowerCase() == "file") {
      return this.inputElement.files ? this.inputElement.files[0] : null;
    } else {
      return this.inputElement.value;
    }
  }

  protected _setParams(param?: QvInputParms) {
    if (typeof param === "object" && typeof param !== "undefined") {
      this.param = { ...this.param, ...param };
    }
  }
}
