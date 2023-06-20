import dayjs from "dayjs";
import { RuleCallBack } from "../contracts";
import { now, spliteParam, throwEmptyArgsException } from "../utils";
/**
 * This is a callback function that checks if the input is a valid date.
 *
 * @param input The input string to be validated.
 * @example
 * ```html
 * <input type="date-local" data-qv-rules="date" />
 * ```
 * @returns Returns true if the input is a valid date, false otherwise.
 */
export const isDate: RuleCallBack = (input) => {
  return dayjs(input, undefined, true).isValid();
};

/**
 * Checks whether a given date is before another date.
 *
 * @param input - The date to check, as a string in ISO 8601 format or a `Date` object.
 * @param date - The date to compare against, as a string in ISO 8601 format or the string "now" to use the current date and time. It can take the `now` value
 *   @example
 * ```html
 * <input type="date-local" data-qv-rules="before:2020-11-11" />
 * ```
 * @returns `true` if the input date is before the comparison date, `false` otherwise.
 */
export const beforeDate: RuleCallBack = (input, date) => {
  if (date === "now") {
    date = now();
  }
  return dayjs(input).isBefore(date);
};

/**
 * Checks whether a given date is after another date.
 *
 * @param input - The date to check, as a string in ISO 8601 format or a `Date` object.
 * @param date - The date to compare against, as a string in ISO 8601 format or the string "now" to use the current date and time. date can be `now
 * @example
 * ```js
 *  {
 *    rules:['after:now']
 * }
 * ```
 * ```html
 * <input data-qv-rules="after:now" />
 * ```
 * @returns `true` if the input date is after the comparison date, `false` otherwise.
 */
export const afterDate: RuleCallBack = (input, date) => {
  if (date === "now") {
    date = now();
  }
  return dayjs(input).isAfter(date);
};

/**
 * Checks whether a given date is between two other dates.
 *
 * @param input - The date to check, as a string in ISO 8601 format or a `Date` object.
 * @param date - The range of dates to compare against, as a string in the format "startDate,endDate", where startDate and endDate are strings in ISO 8601 format or the string "now" to use the current date and time.
 *  ```html
 * <input type="date-local" data-qv-rules="dateBetween:2020-11-11,now" />
 * ```
 * @returns `true` if the input date is between the start and end dates (inclusive), `false` otherwise.
 * @throws An exception with the message "Missing required argument: dateBetween" if the `date` parameter is falsy.
 */
export const dateBetween: RuleCallBack = (input, date) => {
  if (!date) {
    throwEmptyArgsException("dateBetween");
  }
  const [startDate, endDate] = spliteParam(date ?? "");
  return afterDate(input, startDate) && beforeDate(input, endDate);
};

/**
 * Checks whether a given string represents a valid time in 24-hour format.
 *
 * @param input - The string to check.
 * @returns `true` if the input string represents a valid time in 24-hour format, `false` otherwise.
 * @example
 * ```js
 * {
 *    rules:['time']
 * }
 * ```
 * ```html
 * <input data-qv-rules="time" />
 * ```
 *
 */
export const isTime: RuleCallBack = (input: string) => {
  // If the input does not have three parts separated by colons (H:m:i)
  if (input.split(":").length < 3) {
    // Complete the input with ":00" until it has the format H:m:i
    while (input.split(":").length < 3) {
      input += ":00";
    }
  }
  return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(input);
};
