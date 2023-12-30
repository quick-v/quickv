import { endWithLetter, stringBetween } from "./../rules/string";
import { isMimes, minFileSize } from "./../rules/file";
import { Rule, RuleCallBack, RulesBag, RulesMessages } from "../contracts";
import {
  between,
  contains,
  email,
  endWith,
  inInput,
  integer,
  isNumber,
  is_string,
  maxRule,
  maxlength,
  minRule,
  minlength,
  required,
  startWith,
  length,
  url,
  isFile,
  maxFileSize,
  size,
  isBoolean,
  startWithUpper,
  nullable,
  startWithLower,
  passwordRule,
  startWithLetter,
  excludes,
  containsLetter,
  regex,
  lower,
  upper,
  modulo,
  only,
  digitRule,
  minDigitRule,
  lessthan,
  maxDigitRule,
  greaterthan,
} from "../rules";
import { afterDate, beforeDate, isDate, isTime } from "../rules/date";
import { QvLocal } from "../locale/qv-local";
import { phone } from "../rules/phone";
interface IQvBag {
  [key: string | Rule]: any;
}
export class QvBag implements IQvBag {
  private static rules: RulesBag = {
    required: required,
    email: email,
    maxlength: maxlength,
    minlength: minlength,
    min: minRule,
    max: maxRule,
    string: is_string,
    between: between,
    startWith: startWith,
    endWith: endWith,
    contains: contains,
    in: inInput,
    integer: integer,
    int: integer,
    modulo: modulo,
    number: isNumber,
    numeric: isNumber,
    url: url,
    length: length,
    len: length,
    file: isFile,
    maxFileSize: maxFileSize,
    minFileSize: minFileSize,
    size: size,
    boolean: isBoolean,
    startWithUpper: startWithUpper,
    nullable: nullable,
    startWithLower: startWithLower,
    password: passwordRule,
    date: isDate,
    before: beforeDate,
    after: afterDate,
    phone: phone,
    time: isTime,
    startWithLetter: startWithLetter,
    endWithLetter: endWithLetter,
    excludes: excludes,
    hasLetter: containsLetter,
    regex: regex,
    lower: lower,
    upper: upper,
    stringBetween: stringBetween,
    mod: modulo,
    only: only,
    mimes: isMimes,
    digit: digitRule,
    minDigit: minDigitRule,
    lessThan: lessthan,
    lthan: lessthan,
    maxDigit: maxDigitRule,
    greaterThan: greaterthan,
    gthan: greaterthan,
  };

  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   * @param message - The error message for the custom rule
   */
  static rule(
    rule: string,
    callback: RuleCallBack,
    message?: string,
    local?: string
  ) {
    QvBag.addRule(rule, callback);
    QvBag.addMessage(rule, message, local);
  }
  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   */
  static addRule(rule: string, callback: RuleCallBack) {
    QvBag.rules[rule as keyof RulesBag] = callback;
  }

  /**
   * Add a custom error message for a validation rule to the messages bag
   * @param rule - The name of the validation rule
   * @param message - The error message for the validation rule
   */
  static addMessage(rule: string, message?: string, local?: string) {
    QvLocal.addMessage(rule, message, local);
  }

  /**
   * Check if a validation rule exists in the rules bag
   * @param rule - The name of the validation rule
   * @returns True if the rule exists, false otherwise
   */
  static hasRule(rule: string): boolean {
    return rule in QvBag.rules;
  }

  static getRule(name: string) {
    return QvBag.rules[name as Rule];
  }
  static getMessage(name: string | Rule, local?: string): string {
    return QvLocal.getRuleMessage(name, local);
  }

  static allRules() {
    return QvBag.rules;
  }
  static allMessages(local?: string) {
    return QvLocal.getMessages(local);
  }
}
