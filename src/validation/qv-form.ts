import {
  EventCallback,
  EventCallbackWithDetails,
  QvFormConfig,
  QvFormHandler,
  QvInputParms,
  RuleCallBack,
  ValidatableForm,
} from "../contracts";
import { QvLocal } from "../locale/qv-local";
import { FormValidator } from "../rules/form/form-validator";
import { QvBag } from "./qv-bag";
import { QvInput } from "./qv-input";

/**
 * @author Claude Fassinou
 * QvForm is responsible for applying live validation to an HTML form.
 * Creates an instance of QvForm.
 * @param formElement The HTML form element to apply live validation to.
 * Example:
 * ```
 * const formElement = document.getElementById("myForm") as HTMLFormElement;
 * const qvForm = new QvForm(formElement);
 * qvForm.init();
 * ```
 */
export class QvForm {
  /**
   * This status indicates the current state of the form
   */
  private _passed = false;
  /**
   * Form validator instance
   */
  private _formValidator!: FormValidator;
  /***
   * Check that if passes event can be emitted
   */
  private _emitOnPasses = true;
  /***
   * Check that if passes event can be emitted
   */
  private _emitOnFails = true;

  /**
   * The class that indicates the submit button is enabled
   */
  private _qvEnabledClass = "qvEnabled";
  /**
   * The class that indicates the submit button is disabled
   */
  private _qvDisabledClass = "qvDisabled";

  private _triggerValidationEvents = ["change", "qv.form.update"];
  /**
   * The html form
   */
  private container!: HTMLFormElement;

  /**
   * The inputs rules
   */
  private _qvInputs: QvInput[] = [];
  /**
   * The submition input
   */
  submitButton!: HTMLElement;

  /**
   * Qv Config object
   */
  protected config: QvFormConfig = {
    auto: true,
  };

  constructor(container: ValidatableForm, config?: QvFormConfig) {
    this.setContainer(container);
    this._formValidator = new FormValidator(this.container);
    this.setConfig(config);
    this._initQvInputs();
  }

  private setContainer(container: ValidatableForm) {
    if (!(container instanceof HTMLElement)) {
      const el = document.querySelector<HTMLFormElement>(container);
      if (el) {
        container = el;
      }
    }

    if (!(container instanceof HTMLElement)) {
      throw new Error("The 'html container or html form' doesn't exist.");
    }

    this.container = container;

    const submitButton =
      this.container.querySelector<HTMLElement>("[data-qv-submit]");

    if (submitButton) {
      this.submitButton = submitButton;
    }
  }
  /**
   * Initializes live validation on the form element.
   * Example:
   * ```
   * const qvForm = new QvForm(formElement);
   * qvForm.init();
   * ```
   */
  init() {
    this._runQvInputs();

    if (this.config.auto) {
      this.disableButton();
      this.validateOnQvEvent();
    }

    this.emit("qv.form.init", this);

    this._onSubmit();

    this.onFails((e) => {
      this.disableButton();
    });

    this.onPasses((e) => {
      this.enableButton();
    });
  }
  /**
   * Disable submission  button on failed
   */
  disableButton() {
    if (this.submitButton) {
      this.submitButton.setAttribute("disabled", "true");
      if (this._qvDisabledClass) {
        //removeClass enable
        const classArrayEnabled: string[] = this._qvEnabledClass.split(" ");
        for (const value of classArrayEnabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en disabled dataset
        this._qvDisabledClass =
          this.submitButton.dataset.qvDisabledClass ?? "qvDisabled";
        const classArray: string[] = this._qvDisabledClass.split(" ");
        for (const value of classArray) {
          this.submitButton.classList.add(value);
        }
      }
    }
  }

  /**
   * Enable submission button on success
   */
  enableButton() {
    if (this.submitButton) {
      this.submitButton.removeAttribute("disabled");
      if (this._qvEnabledClass) {
        //removeClass disabled
        const classArrayDisabled: string[] = this._qvDisabledClass.split(" ");
        for (const value of classArrayDisabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en enabled dataset
        this._qvEnabledClass =
          this.submitButton.dataset.qvEnabledClass ?? "qvEnabled";
        const classArray: string[] = this._qvEnabledClass.split(" ");
        for (const value of classArray) {
          this.submitButton.classList.add(value);
        }
      }
    }
  }

  /**
   * Registers an event listener for  this this._triggerValidationEvents event on the container element.
   * If a callback function is provided, it will be executed before Quickv handle the form validation.
   * For each QvInput instance attached to this class, the onPass and onFails methods will be executed with this handle method
   * @param fn - The callback function to execute.
   *
   * @example
   * const qvForm = new QvForm(formElement);
   *
   * qvForm.validateOnQvEvent((qvFormInstance) => {
   *   // Some code
   * });
   *
   */
  validateOnQvEvent(fn?: CallableFunction) {
    this.__call(fn, this);
    this._triggerValidationEvents.forEach((e) => {
      this.on(e, (e) => {
        this._handle();
      });
    });
    // Validates the entire form whenever a qv.input.passes or qv.input.fails event is listened to
    this._qvInputs.forEach((qvInput) => {
      qvInput.onFails(this._handle.bind(this));
      qvInput.onPasses(this._handle.bind(this));
    });
  }
  /**
   * Check if inputs are valid, and emit the corresponding event if necessary
   */
  private _handle() {
    this._passed = this.isValid();
    if (this._passed) {
      this._emitQvOnPassesEvent();
    } else {
      this._emitQvOnFailsEvent();
    }
  }

  /**
   * Check if the form is valid
   * @returns
   */
  isValid() {
    return this._qvInputs.every((qiv) => {
      return qiv.passes();
    });
  }

  passes() {
    return this.isValid();
  }
  /**
   * Handle validation before process submtion
   */
  private _onSubmit() {
    this.on("submit", (submitEvent) => {
      //A validation will be made only if very recently, the form was not valid
      if (!this._passed) {
        let results: boolean[] = [];
        //Don't use every method because, we need to run all validation and get it result
        // It will help also to display errors messages
        for (const qi of this._qvInputs) {
          // Validate each input
          // The false argument passed, tell that to input to not emit validation event
          results.push(qi.validate(false));
        }
        // Test whether each rule passed
        if (!results.every((passed) => passed)) {
          submitEvent.preventDefault();
          this._emitQvOnFailsEvent();
        } else {
          this._emitQvOnPassesEvent();
        }
      }
    });
  }

  /**
   * Add new rule
   * @param ruleName
   * @param call
   * @param message
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    QvBag.rule(ruleName, call, message);
  }

  protected setConfig(config?: QvFormConfig) {
    let lang =
      document.querySelector("html")?.getAttribute("data-qv-lang") ||
      document.querySelector("html")?.getAttribute("lang");

    if (this.container.dataset.qvLang) {
      lang = this.container.dataset.qvLang;
    }
    if (config && typeof config === "object") {
      this.config = { ...this.config, ...config };
      if (config.local) {
        const local = config.local;
        if (local.lang) {
          lang = local.lang;
        }
      }
    }

    QvLocal.LANG = lang ?? QvLocal.DEFAULT_LANG;

    this._syncRules();
  }

  /**
   * Attach an event listener to the container element.
   *
   * @param e - The name of the event to listen to.
   * @param fn - The callback function to execute when the event occurs.
   * This function takes an event of type `Event` as a parameter and returns nothing.
   * Example: `(event) => { ... }`
   */
  on(e: string, fn: EventCallback): void {
    this.container.addEventListener(e, fn);
  }

  /**
   * Emits a custom event to the container element.
   *
   * @param e - The name of the custom event to emit.
   * @param data - The additional data to pass with the event.
   */
  emit(e: string, data?: any): void {
    const event = new CustomEvent(e, { detail: data });
    this.container.dispatchEvent(event);
  }

  /**
   * Attaches an event listener to the "qv.form.fails" event.
   * This event is triggered when the form fails validation.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * qvForm.onFails((qvForm) => {
   *   console.log("Form validation failed", qvForm);
   * });
   * ```
   */
  onFails(fn: QvFormHandler): void {
    this.on("qv.form.fails", (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "qv.form.passes" event.
   * This event is triggered when the form passes validation.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * qvForm.onPasses((qvForm) => {
   *   console.log("Form validation passed", qvForm);
   * });
   * ```
   */
  onPasses(fn: QvFormHandler): void {
    this.on("qv.form.passes", (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "qv.form.validate" event.
   * This event is triggered when the form is validated.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * qvForm.onValidate((qvForm) => {
   *   console.log("Form validation executed", qvForm);
   * });
   * ```
   */
  onValidate(fn: QvFormHandler): void {
    this.on("qv.form.validate", (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "qv.form.updated" event.
   * When this event is triggered, the method initializes and runs the QvInputs for the form,
   * and then calls the provided function with the form instance as a parameter.
   * @param fn - The function to be called when the event occurs.
   * This function takes the form instance as a parameter and returns nothing.
   * Example:
   * ```typescript
   * qvForm.observeChanges((form) => {
   *   console.log("Form updated", form);
   * });
   * ```
   */
  observeChanges(fn?: EventCallback): void {
    this.on("qv.form.updated", (e) => {
      this.destroy();
      this.setContainer(this.container);
      this._initQvInputs();
      this._runQvInputs();
      this.__call(fn, this);
    });
  }
  /**
   * Triggers the validation process for the form.
   * This method emits the "qv.form.update" event, which initiates the validation of all form inputs.
   * Example:
   * ```typescript
   * qvForm.update ();
   * ```
   */
  update() {
    this.emit("qv.form.update", this);
  }

  /**
   * Initializes QvInputs for the form.
   */
  private _initQvInputs() {
    const qvInputs = Array.from(
      this.container.querySelectorAll<HTMLElement>("[data-qv-rules]")
    ).map(
      (el) =>
        new QvInput(el as HTMLInputElement, {
          validClass: this.config.validClass,
          invalidClass: this.config.invalidClass,
        })
    );

    this._qvInputs.push(...qvInputs);
  }

  /**
   * Runs the init method on each QvInput instance.
   */
  private _runQvInputs() {
    for (const qiv of this._qvInputs) {
      qiv.init();
    }
  }
  /**
   * Invokes the provided function with the given parameters if it is a valid function.
   * @param fn - The function to be called.
   * @param params - The parameters to be passed to the function.
   */
  private __call(fn?: CallableFunction, ...params: any) {
    if (typeof fn == "function") {
      fn(...params);
    }
  }

  /**
   * Destroys the QvForm instance and performs any necessary cleanup.
   * This method removes event handlers, destroys QvInput instances,
   * and clears the internal array of QvInput instances.
   *
   * Example:
   * ```typescript
   * const formElement = document.getElementById("myForm") as HTMLFormElement;
   * const qvForm = new QvForm(formElement);
   * qvForm.init();
   *
   * // Use the form...
   *
   * // When the form is no longer needed, destroy the QvForm instance
   * qvForm.destroy();
   * ```
   */
  destroy(): void {
    // Remove event handlers
    this.container.removeEventListener("submit", this._onSubmit);

    const evs = this._triggerValidationEvents.filter(
      (event) => event !== "qv.form.update"
    );
    evs.forEach((ev) => {
      this.container.removeEventListener(ev, this._handle);
    });

    for (const qvInput of this._qvInputs) {
      qvInput.destroy();
    }
    this._qvInputs = [];
    this.emit("qv.form.destroy");
  }

  /**
   * Emits the "qv.form.fails" event if the form fails validation.
   * This method is called when the form is considered invalid, meaning at least one input fails validation.
   */
  private _emitQvOnFailsEvent() {
    //If qv.form.fails
    if (this._emitOnFails) {
      this.emit("qv.form.fails", this);
      this.emit("qv.form.validate", this);
      this._emitOnFails = false;
      //Open _emitOnPasses, for the next qv.form.passes event
      this._emitOnPasses = true;
    }
  }
  /**
   * Emits the "qv.form.passes" event if the form passes validation.
   * This method is called when the form is considered valid, meaning all inputs pass validation.
   */
  private _emitQvOnPassesEvent() {
    //If qv.form.passes
    if (this._emitOnPasses) {
      this.emit("qv.form.passes", this);
      this.emit("qv.form.validate", this);
      this._emitOnPasses = false;
      //Open _emitOnFails, for the next qv.form.fails event
      this._emitOnFails = true;
    }
  }
  /**
   * Syncronize form rules with the global rules
   */
  private _syncRules() {
    this._formValidator.getFormRules().forEach((r) => {
      this.rule(r.ruleName, r.call.bind(this._formValidator));
    });
  }

  /**
   * Validate form input using javascript code.
   * Use this method to configure or update the parameters for a particular input in the form.
   *
   * @param inputName - The name of the input for which to specify the parameters.
   * @param params - The additional parameters to set for the input.
   *
   * @example
   * const formElement = document.getElementById("myForm") as HTMLFormElement;
   * const qvForm = new QvForm(formElement);
   * // Configure additional parameters for an input
   * qvForm.with("inputName", { rules: ['required','email']});
   * qvForm.init();
   *
   */
  with(inputName: string, params: QvInputParms) {
    const qvInput = this._qvInputs.find((qiv) => qiv.whereName(inputName));
    if (qvInput) {
      const qvInputIndex = this._qvInputs.indexOf(qvInput);
      qvInput.with(params);
      this._qvInputs[qvInputIndex] = qvInput;
    }
  }
  /**
   * Sets multiple input parameters for multiple inputs in the form.
   * @param inputs - An object containing input names as keys and their corresponding parameters as values.
   * Example:
   * ```typescript
   * const inputs = {
   *   input1: {  QvInputParms for input1   },
   *   input2: {  QvInputParms for input2   },
   *   // ...
   * };
   * qvForm.withMany(inputs);
   * ```
   */
  withMany(inputs: Record<string, QvInputParms>) {
    for (const [inputName, params] of Object.entries(inputs)) {
      this.with(inputName, params);
    }
  }

  onInit(fn: QvFormHandler) {
    this.on("qv.form.init", (event: any) => {
      this.__call(fn, event.detail);
    });
  }

  onUpdate(fn: QvFormHandler) {
    this.on("qv.form.update", (event: any) => {
      this.__call(fn, event.detail);
    });
  }
}
