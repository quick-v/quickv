import { spliteParam } from "../../utils";
import { required } from "../global";
import { AbstractFormValidator } from "./abstract-form-validator";

export class FormValidator extends AbstractFormValidator {
  constructor(form: HTMLElement) {
    super(form);
    this.register();
  }

  private register() {
    //Register  form rules
    this.formRules = [
      {
        ruleName: "same",
        call: this.same,
      },
      {
        ruleName: "requiredIf",
        call: this.requiredIf,
      },
      {
        ruleName: "requiredWhen",
        call: this.requiredWhen,
      },
    ];
  }
  /**
   * Same rule
   * @param input
   * @param inputName
   * @returns
   */
  same(input: any, inputName?: string): boolean {
    if (inputName) {
      return input === this.getInputValueByName(inputName);
    }
    return false;
  }

  /**
   * Required if rule
   * @param input
   * @param inputName
   * @param parameter
   * @returns
   */
  requiredIf(input: any, parameter?: string) {
    const [inputName, ...params] = spliteParam(parameter ?? "");

    if (inputName && params.length > 0) {
      const otherInputValue = this.getInputValueByName(inputName);
      if (params.includes(otherInputValue)) {
        return required(input);
      }
      return true;
    }

    return false;
  }

  requiredWhen(input: any, parameter?: string) {
    const [inputName, ...params] = spliteParam(parameter ?? "");
    if (inputName && params.length > 0) {
      const isNotEmpty = params.some((name) => {
        console.log(name);
        return required(this.getInputValueByName(name));
      });
      if (isNotEmpty) {
        return required(input);
      }
      return true;
    }

    return false;
  }
}
