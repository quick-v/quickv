import {
  isFile,
  maxFileSize,
  minFileSize,
  length,
  isNumber,
  maxRule,
  minRule,
  is_string,
  stringBetween,
} from ".";
import { spliteParam, throwEmptyArgsException } from "../utils";
import { ArgumentParser } from "../validation/utils/argument-parser";
import { RuleCallBack } from "./../contracts/rule-callback";
import { dateBetween, isDate } from "./date";
/**
 * Checks if the input is required.
 *
 * @param input - The input to check.
 * @example
 *  ```html
 * <input data-qv-rules="required" />
 * ```
 * @param options - Optional parameters.
 * @returns `true` if the input is not empty, `false` otherwise.
 */
export const required: RuleCallBack = (input, ...options) => {
  return !!input && input !== "";
};

export const nullable: RuleCallBack = (input) => {
  return true;
};

/**
 * Checks if the input is in the specified list.
 * @param input - The input to check.
 * @param params - The list of values to check against.
 * @example
 *  ```html
 * <input data-qv-rules="in:active,inactive" />
 * ```
 * @returns `true` if the input is in the list, `false` otherwise.
 */
export const inInput: RuleCallBack = (input, params) => {
  if (!params) {
    throwEmptyArgsException("in");
  }
  const list = spliteParam(params as string);
  return list.includes(input);
};
/**
 * Checks if the input is at most the specified size.
 * If the input value is not a file, then the number of characters must be exactly maxSize
 * @param input - The input to check.
 * @param maxSize - The maximum size.
 *  @example
 *  ```html
 * <input data-qv-rules="size:6" />
 * ```
 * @returns `true` if the input is at most the specified size, `false` otherwise.
 */
export const size: RuleCallBack = (input, maxSize) => {
  if (isFile(input)) {
    return maxFileSize(input, maxSize);
  } else {
    return length(input, maxSize); // Apply length rule for non-file inputs
  }
};
/**
 * Checks if the input is a boolean value.
 *
 * @param value - The input to check.
 * @example
 *  ```html
 * <input data-qv-rules="boolean" />
 * ```
 * @returns `true` if the input is a boolean value, `false` otherwise.
 */
export const isBoolean: RuleCallBack = (value) => {
  if (typeof value === "boolean") {
    return true;
  }
  if (typeof value === "string") {
    value = value.toLowerCase();
    if (
      value === "true" ||
      value === "false" ||
      value === "0" ||
      value === "1" ||
      value === "yes" ||
      value === "no"
    ) {
      return true;
    }
  }
  return false;
};
/**
 * Checks if the input is between the specified minimum and maximum values.
 * This rule between validates data according to its type. It can be used to validate numbers, strings, dates, file size, etc.
 * @param input - The input to check.
 * @param min_max - The minimum and maximum values, separated by a comma.
 * @example
 * ```html
 * <!--valide number-->
 * <input type="number" data-qv-rules="between:6,7" />
 * <!--valide string-->
 * <input type="text" data-qv-rules="between:6,7" />
 * <!--valide date-->
 * <input type="date-local" data-qv-rules="between:01-01-2021,now" />
 * <!--valide file size-->
 * <input type="file" data-qv-rules="between:2MB,3MB" />
 * ```
 * @returns `true` if the input is between the specified values, `false` otherwise.
 */
export const between: RuleCallBack = (input, min_max) => {
  var [min, max] = spliteParam(min_max ?? "");
  //for file
  if (isFile(input)) {
    return maxFileSize(input, max) && minFileSize(input, min);
  }
  // for date
  if (!isNumber(input) && !isFile(input)) {
    if (isDate(input)) {
      return dateBetween(input, min_max);
    } else {
      return stringBetween(input, min_max);
    }
  }
  //for number
  min = Number(min);
  max = Number(max);
  if (input !== undefined && input !== Number && input !== "") {
    if (isNumber(min) && isNumber(max)) {
      input = Number(input);
      if (!isNumber(input)) {
        return false;
      }
      return maxRule(input, max) && minRule(input, min);
    }
  }
  return false;
};
/**
 * Checks if the input matches the specified regular expression.
 *
 * @param input - The input to check.
 * @param pattern - The regular expression to match against.
 * @returns `true` if the input matches the regular expression, `false` otherwise.
 * @example
 * ```html
 *  <input data-qv-rules="regex:^[A-Z]+$"/>
 * ```
 */
export const regex: RuleCallBack = (input: string, pattern?: string) => {
  if (!pattern) {
    throw new Error("The regex rule argument must not be empty");
  }
  const parser = new ArgumentParser(pattern);
  const regex = new RegExp(parser.replacePipes());
  return regex.test(input);
};

/**
 * Only accepts inputs of a specific type.
 *
 * @param input - The input to check.
 * @param param - The parameter specifying the expected type ("string" or "number").
 *  ```html
 *  <input data-qv-rules="only:letter"/>
 * ```
 * @returns `true` if the input matches the expected type, `false` otherwise.
 */
export const only: RuleCallBack = (input, param) => {
  if (param === "string") {
    if (!is_string(input) || input.length === 0) {
      return false;
    }
    return !/\d/.test(input); // Return true if input doesn't contain any digit
  }

  if (param === "number") {
    return isNumber(input); // Use the isNumber function from quickv
  }

  return false; // Invalid parameter, return false
};

/**
 * Checks if the input is a digit (numeric value) with the specified number of digits.
 *
 * @param input - The input to check.
 * @param digitCount - The number of digits.
 * @example
 * ```html
 * <input data-qv-rules="digit:8"/>
 * ```
 * @returns `true` if the input is a digit with the specified number of digits, `false` otherwise.
 */
export const digitRule: RuleCallBack = (input, digitCount) => {
  if (!isNumber(digitCount)) {
    throw new Error("Digit rule parameter must be a number");
  }

  if (isNumber(input)) {
    const inputValue = String(input);
    return /^\d+$/.test(inputValue) && inputValue.length === Number(digitCount);
  }

  return false;
};

/**
 * Checks if the input is a digit (numeric value) with a number of digits less than or equal to the specified maximum.
 *
 * @param input - The input to check.
 * @param maxDigitCount - The maximum number of digits.
 * @example
 * ```html
 * <input data-qv-rules="max_digit:10"/>
 * ```
 * @returns `true` if the input is a digit with a number of digits less than or equal to the specified maximum, `false` otherwise.
 */
export const maxDigitRule: RuleCallBack = (input, maxDigitCount) => {
  if (!isNumber(maxDigitCount)) {
    throw new Error("Max_digit rule parameter must be a number");
  }

  if (isNumber(input)) {
    const inputValue = String(input);
    return (
      /^\d+$/.test(inputValue) && inputValue.length <= Number(maxDigitCount)
    );
  }

  return false;
};

/**
 * Checks if the input is a digit (numeric value) with a number of digits greater than or equal to the specified minimum.
 *
 * @param input - The input to check.
 * @param minDigitCount - The minimum number of digits.
 * @example
 * ```html
 * <input data-qv-rules="min_digit:5"/>
 * ```
 * @returns `true` if the input is a digit with a number of digits greater than or equal to the specified minimum, `false` otherwise.
 */
export const minDigitRule: RuleCallBack = (input, minDigitCount) => {
  if (!isNumber(minDigitCount)) {
    throw new Error("Min_digit rule parameter must be a number");
  }

  if (isNumber(input)) {
    const inputValue = String(input);
    return (
      /^\d+$/.test(inputValue) && inputValue.length >= Number(minDigitCount)
    );
  }

  return false;
};
