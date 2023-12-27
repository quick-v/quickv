import { RuleCallBack } from "../../contracts";

export abstract class AbstractFormValidator {
  protected formRules: {
    ruleName: string;
    call: RuleCallBack;
  }[] = [];

  constructor(protected form: HTMLElement) {}
  getInputByName(inputName: string) {
    return this.form.querySelector<HTMLInputElement>(`[name=${inputName}]`);
  }

  getInputValueByName(inputName: string) {
    const input = this.getInputByName(inputName);
    return input ? input.value : undefined;
  }

  getFormRules() {
    return this.formRules;
  }
}
