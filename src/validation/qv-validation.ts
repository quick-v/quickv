import { Rule, RulesMessages } from "../contracts";
import { QvBag } from "./qv-bag";
import { getRule } from "../utils";
import { InputValueType, QvInputParms } from "../contracts/types";
import { RuleExecuted } from ".";
import { QvMessages } from "../messages";
import { is_string } from "../rules";
import { QvLocal } from "../locale/qv-local";
/**
 * @author Claude Fassinou
 */
export class QValidation {
  private _rulesToMap = ["min", "max", "between", "size"];
  /**
   * Map of validation rules specific to field types.
   * This map associates field types with the corresponding validation rules.
   */
  private _rulesFromTypes: Record<string, Record<string, string>> = {
    min: {
      text: "minlength",
      file: "minFileSize",
      date: "beforeDate",
      "date-local": "beforeDate",
    },
    max: {
      text: "maxlength",
      file: "maxFileSize",
      date: "afterDate",
      "date-local": "afterDate",
    },
    between: {
      text: "stringBetween",
      file: "fileBetween",
      date: "dateBetween",
      "date-local": "dateBetween",
    },
    size: {
      text: "length",
    },
  };

  private _inputType = "text";
  /**
   * The list of rules that should be executed on the value
   */
  private _rules: Rule[] | string[] = [];

  /**
   * The current value to validate
   */
  private _value: InputValueType = undefined;

  /**
   * A list of rules run
   */
  private _ruleExecuted: RuleExecuted[] = [];

  /**
   * A boolean value indicating whether the validation rules should
   * fail on the first error or continue executing all rules
   */
  private _failOnfirst = true;

  /**
   * The attrabute name that should be used to display the validation errors
   */
  private _attr = "";

  /**
   * An object containing the original validation rules errors as key-value pairs (record) of rule names and error
   * messages
   */
  private _qvmessages: Record<string, string> = {};

  constructor(param?: QvInputParms) {
    if (param) {
      this.setParams(param);
    }
  }

  /**
   * This method performs the validation process. It iterates over the _rules array and executes each rule on the
   * _value. If _failOnfirst is set to true, the method stops executing rules after the first failure. The method
   * updates the _ruleExecuted array with the result of each rule execution.
   * It returns a boolean value indicating whether the validation passed (true) or not (false)
   * @example
   * const qvalidation = new QValidation(param)
   * qvalidation.validate()
   */
  validate() {
    const rules = this._rules;

    if (!Array.isArray(rules)) {
      throw new Error("The rule provided must be an array of Rule");
    }

    for (const rule of rules) {
      //Get rulename and param
      let { ruleName, params } = getRule(rule);
      let ruleToRun = this._getRuleToRunName(ruleName);

      const ruleCallback = QvBag.getRule(ruleToRun);

      const ruleExec = this._makeRuleExcutedInstance(ruleToRun, ruleName);

      ruleExec.params = params;

      if (!ruleCallback) {
        throw new Error(`The rule ${ruleName} is not defined`);
      }
      /**
       * For the same value, same rule, if rule was executed it will not be executed again
       */
      if (ruleExec.wasRunWith(this._value)) {
        ruleExec.passed = ruleExec.passed;
      } else {
        ruleExec.passed = ruleCallback(this._value, params);
        ruleExec.valueTested = this._value;
        ruleExec.run = true;
      }
      if (this._failOnfirst) {
        if (!ruleExec.passed) {
          this._parseRuleMessage(ruleExec);
          this._addRuleExecuted(ruleExec);
          break;
        }
      } else {
        if (!ruleExec.passed) {
          this._parseRuleMessage(ruleExec);
        } else {
          ruleExec.message = "";
        }
        this._addRuleExecuted(ruleExec);
      }
    }
    return !this.hasErrors();
  }
  /**
   * Get rule/message error
   * @returns
   */
  getErrors() {
    const r: Record<string, string> = {};
    for (const rx of this._ruleExecuted) {
      if (!rx.passed) {
        r[rx.orignalName] = rx.message ?? "";
      }
    }
    return r;
  }
  /**
   * Check if validation failed
   * @returns
   */
  hasErrors(): boolean {
    return this._ruleExecuted.some((rx) => !rx.passed);
  }

  /**
   * This method is an alias for hasErrors(). It returns true if there are no errors, false otherwise
   */
  passes() {
    return !this.hasErrors();
  }

  /**
   * Set rules to run
   * @param rules
   */
  setRules(rules: Rule[] | string[]): void {
    this._rules = rules;
  }

  /**
   * Get rules to run
   * @returns
   */
  getRules() {
    return this._rules;
  }

  /**
   * Create an instance of RuleExcuted
   * @param r
   * @returns
   */
  private _makeRuleExcutedInstance(r: string | Rule, originalRuleName: string) {
    let re = this._ruleExecuted.find((rx) => {
      return rx.isNamed(r);
    });
    return re ?? new RuleExecuted(r, originalRuleName);
  }

  private _addRuleExecuted(ruleExecuted: RuleExecuted) {
    if (!this._ruleExecuted.includes(ruleExecuted)) {
      this._ruleExecuted.push(ruleExecuted);
    }
  }
  private _parseRuleMessage(ruleExec: RuleExecuted) {
    const orgMesage = QvLocal.getRuleMessage(ruleExec.orignalName);
    const supliedMessage = this._qvmessages[ruleExec.orignalName];

    if (supliedMessage !== orgMesage) {
      this._qvmessages[ruleExec.ruleName] = supliedMessage;
    } else {
      this._qvmessages[ruleExec.ruleName] = QvLocal.getRuleMessage(
        ruleExec.ruleName
      );
    }

    const qvMessages = new QvMessages().setMessages(
      this._qvmessages as RulesMessages
    );

    const message = qvMessages.parseMessage(
      this._attr,
      ruleExec.ruleName as Rule,
      qvMessages.getRulesMessages([ruleExec.ruleName as Rule])[0],
      ruleExec.params
    );

    ruleExec.message = message;

    return ruleExec;
  }

  /***
   * This method returns an array of error messages from the
   * _ruleExecuted array for the rules that did not pass.
   */
  getMessages() {
    const mssages = this._ruleExecuted
      .filter((ruleExec) => !ruleExec.passed)
      .map((ruleExec) => ruleExec.message);

    return mssages;
  }

  /**
   * Set the value and validate it automatically
   */
  set value(v: InputValueType) {
    this._value = v;

    const isNullable = this._rules.includes("nullable");
    if (isNullable) {
      if (this._value || this._value === "0") {
        this.validate();
      }
    } else {
      this.validate();
    }
  }

  get value(): InputValueType {
    return this._value;
  }

  /**
   * Set validation parameters
   * @param param
   */

  setParams(param: QvInputParms) {
    this._attr = param.attribute ?? "";
    this._failOnfirst = param.failsOnfirst !== undefined && param.failsOnfirst;

    this._rules = param.rules ?? [];
    this._qvmessages = param.errors ?? {};
    this._inputType = param.type ?? this._inputType;
  }

  private _getRuleToRunName(ruleName: string) {
    let ruleToRun = ruleName;
    //If the rule can be mapped
    if (this._rulesToMap.includes(ruleName)) {
      const ruleMap = this._rulesFromTypes[ruleName];
      if (ruleMap) {
        const gettedRule = ruleMap[this._inputType];
        if (is_string(gettedRule) && gettedRule.length > 0) {
          ruleToRun = gettedRule as Rule;
        }
      }
    }
    return ruleToRun;
  }
}
