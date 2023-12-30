import { maxlength, minlength } from "./string";
import { RuleCallBack } from "../contracts/rule-callback";
import { isFile, maxFileSize, minFileSize } from "./file";
/**
 * When the value is a number, it checks whether the input value is greater than or equal to min
 * When the value is a character string, it checks whether the number of characters is greater than or equal to min
 * @param input - The input to check.
 * @param min - The minimum length.
 * @example
 *  ```html
 *  <input qv-rules="min:2"/>
 * ```
 * @returns `true` if the input is at least the specified length, `false` otherwise.
 */
export const minRule: RuleCallBack = (input, min) => {
  if (isFile(input)) {
    return minFileSize(input, min);
  }
  if (input === undefined || input === null) {
    input = 0;
  }

  if (!isNumber(min)) {
    throw new Error("Min rule parameter must be an integer");
  }
  if (isNumber(input)) {
    return Number(input) >= Number(min);
  } else {
    return minlength(input, min);
  }
};
/**
 * When the value is a number, it checks whether the input value is less than or equal to max
 * When the value is a character string, it checks whether the number of characters is less than or equal to max
 *
 * @param input - The input to check.
 * @param max - The maximum length.
 *  @example
 *  ```html
 *  <input qv-rules="max:20"/>
 * ```
 * @returns `true` if the input is at most the specified length, `false` otherwise.
 */
export const maxRule: RuleCallBack = (input, max) => {
  if (isFile(input)) {
    return maxFileSize(input, max);
  }
  if (!isNumber(max)) {
    throw new Error("Min rule parameter must be an integer");
  }
  if (input === undefined || input === null) {
    input = 0;
  }
  if (isNumber(input)) {
    return Number(input) <= Number(max);
  } else {
    return maxlength(input, max);
  }
};

/**
 * Checks if the input is an integer. It has alias (int)
 *
 * @param input - The input to check.
 * ```html
 *  <input qv-rules="integer"/> or
 *  <input qv-rules="int"/>
 * ```
 * @returns `true` if the input is an integer, `false` otherwise.
 */
export const integer: RuleCallBack = (input) => {
  if (isNumber(input)) {
    return Number.isInteger(Number(input));
  }
  return false;
};

/**
 * Checks if the input is a number.
 *
 * @param input - The input to check.
 * ```html
 *  <input qv-rules="number"/>
 * ```
 * @returns `true` if the input is a number, `false` otherwise.
 */
export const isNumber: RuleCallBack = (input) => {
  if (input === "" || input === null) {
    return false;
  }

  if (input === "0" || input === 0) {
    return true;
  }

  if (input === "1" || input === 1) {
    return true;
  }
  return (
    !isNaN(Number(input)) &&
    typeof input !== "boolean" &&
    typeof input !== "object"
  );
};

/**
 * Checks whether a number is a multiple or divisible by another number. Has alias (mod)
 * @param input - The input to check.
 * ```html
 *  <input qv-rules="modulo:2"/>
 * <input qv-rules="mod:2"/>
 * ```
 * @returns `true` if the input is a number, `false` otherwise.
 */
export const modulo: RuleCallBack = (input, mod) => {
  if (!isNumber(mod)) {
    throw new Error("Modulo rule parameter must be an integer");
  }

  if (isNumber(input)) {
    return Number(input) % Number(mod) === 0;
  }

  return false;
};

/**
 * Checks whether the input is less than the specified value.
 *
 * @param input - The input to check.
 * @param threshold - The threshold value.
 * @example
 * ```html
 * <input qv-rules="lessThan:10"/>
 * ```
 * @returns `true` if the input is less than the specified value, `false` otherwise.
 */
export const lessthan: RuleCallBack = (input, threshold) => {
  if (!isNumber(threshold)) {
    throw new Error("Lessthan rule parameter must be a number");
  }

  if (isNumber(input)) {
    return Number(input) < Number(threshold);
  }

  return false;
};

/**
 * Checks whether the input is greater than the specified value.
 *
 * @param input - The input to check.
 * @param threshold - The threshold value.
 * @example
 * ```html
 * <input qv-rules="greaterThan:5"/>
 * ```
 * @returns `true` if the input is greater than the specified value, `false` otherwise.
 */
export const greaterthan: RuleCallBack = (input, threshold) => {
  if (!isNumber(threshold)) {
    throw new Error("Greaterthan rule parameter must be a number");
  }

  if (isNumber(input)) {
    return Number(input) > Number(threshold);
  }

  return false;
};
