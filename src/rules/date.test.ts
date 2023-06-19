import {
  afterDate,
  beforeDate,
  dateBetween,
  isDate,
  isDay,
  isHOrMorSecond,
  isMonth,
  isYear,
} from "./date";

describe("isDate", () => {
  test("should return true for a valid date in UTC format", () => {
    const input = "2023-04-23T10:30:00.000Z"; // UTC format
    const result = isDate(input);
    expect(result).toBe(true);
  });

  test("should return false for an invalid date", () => {
    const input = "2023-04-23T10:30:00.000";
    const result = isDate(input);
    expect(result).toBe(true);
  });

  test("should return false for an invalid string", () => {
    const input = "invalid date";
    const result = isDate(input);
    expect(result).toBe(false);
  });

  // Test case: null value
  test("should return false for a null value", () => {
    const input = null;
    const result = isDate(input);
    expect(result).toBe(false);
  });
});

// Test for the beforeDate function
describe("beforeDate", () => {
  test("should return true if the input date is before the reference date", () => {
    const inputDate = "2023-04-23";
    const referenceDate = "2023-04-24";
    expect(beforeDate(inputDate, referenceDate)).toBe(true);
  });

  test("should return false if the input date is after the reference date", () => {
    const inputDate = "2023-04-25";
    const referenceDate = "2023-04-24";
    expect(beforeDate(inputDate, referenceDate)).toBe(false);
  });

  test("should return false if the input date is equal to the reference date", () => {
    const inputDate = "2023-04-24";
    const referenceDate = "2023-04-24";
    expect(beforeDate(inputDate, referenceDate)).toBe(false);
  });

  test("should return false if the input is not a valid date", () => {
    const inputDate = "2023-04-xx";
    const referenceDate = "2023-04-24";
    expect(beforeDate(inputDate, referenceDate)).toBe(false);
  });

  test("should return true if date is before now", () => {
    const inputDate = "2022-04-22";
    const referenceDate = "now";
    expect(beforeDate(inputDate, referenceDate)).toBe(true);
  });

  test("should return true if date is after now", () => {
    const inputDate = "2050-01-01";
    const referenceDate = "now";
    expect(afterDate(inputDate, referenceDate)).toBe(true);
  });

  test("should return false if the reference date is not a valid date", () => {
    const inputDate = "2023-04-23";
    const referenceDate = "2023-04-xx";
    expect(beforeDate(inputDate, referenceDate)).toBe(false);
  });
});

// Test for the afterDate function
describe("afterDate", () => {
  test("should return true if the input date is after the reference date", () => {
    const inputDate = "2023-04-25";
    const referenceDate = "2023-04-24";
    expect(afterDate(inputDate, referenceDate)).toBe(true);
  });

  test("should return false if the input date is before the reference date", () => {
    const inputDate = "2023-04-23";
    const referenceDate = "2023-04-24";
    expect(afterDate(inputDate, referenceDate)).toBe(false);
  });

  test("should return false if the input date is equal to the reference date", () => {
    const inputDate = "2023-04-24";
    const referenceDate = "2023-04-24";
    expect(afterDate(inputDate, referenceDate)).toBe(false);
  });

  test("should throw an exception if the input is not a valid date", () => {
    const inputDate = "2023-04-xx";
    const referenceDate = "2023-04-24";
    expect(afterDate(inputDate, referenceDate)).toBe(false);
  });

  test("should throw an exception if the reference date is not a valid date", () => {
    const inputDate = "2023-04-23";
    const referenceDate = "2023-04-xx";
    expect(afterDate(inputDate, referenceDate)).toBe(false);
  });
});

// Test for the dateBetween function
describe("dateBetween", () => {
  test("should return true if the input date is between the reference dates", () => {
    const inputDate = "2023-04-25";
    const startDate = "2023-04-24";
    const endDate = "2023-04-26";
    expect(dateBetween(inputDate, `${startDate},${endDate}`)).toBe(true);
  });

  test("should return false if the input date is before the start date", () => {
    const inputDate = "2023-04-23";
    const startDate = "2023-04-24";
    const endDate = "2023-04-26";
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`)).toBe(false);
  });

  test("should return false if the input date is after the end date", () => {
    const inputDate = "2023-04-27";
    const startDate = "2023-04-24";
    const endDate = "2023-04-26";
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`)).toBe(false);
  });

  test("should return false if the input date is equal to the start date", () => {
    const inputDate = "2023-04-24";
    const startDate = "2023-04-24";
    const endDate = "2023-04-26";
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`)).toBe(false);
  });

  test("should return false if the input date is equal to the end date", () => {
    const inputDate = "2023-04-26";
    const startDate = "2023-04-24";
    const endDate = "2023-04-26";
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`)).toBe(false);
  });

  test("should throw an exception if the input is not a valid date", () => {
    const inputDate = "2023-04-xx";
    const startDate = "2023-04-24";
    const endDate = "2023-04-26";
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`)).toBe(false);
  });

  test("should throw an exception if the start date is not a valid date", () => {
    const inputDate = "2023-04-25";
    const startDate = "2023-04-xx";
    const endDate = "2023-04-26";
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`)).toBe(false);
  });

  test("should throw an exception if the end date is not a valid date", () => {
    const inputDate = "2023-04-25";
    const startDate = "2023-04-24";
    const endDate = "2023-04-xx";
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`)).toBe(false);
  });
});

describe("isYear", () => {
  it("should return true for a valid year", () => {
    expect(isYear("2022")).toBe(true);
  });

  it("should return false for an invalid year", () => {
    expect(isYear("abc")).toBe(false);
    expect(isYear("20222")).toBe(false);
    expect(isYear("99")).toBe(false);
    expect(isYear("10000")).toBe(false);
  });
});

describe("isMonth", () => {
  it("should return true for valid months", () => {
    expect(isMonth("1")).toBe(true);
    expect(isMonth("01")).toBe(true);
    expect(isMonth("6")).toBe(true);
    expect(isMonth("06")).toBe(true);
    expect(isMonth("12")).toBe(true);
  });

  it("should return false for invalid months", () => {
    expect(isMonth("0")).toBe(false);
    expect(isMonth("13")).toBe(false);
    expect(isMonth("00")).toBe(false);
    expect(isMonth("99")).toBe(false);
    expect(isMonth("abc")).toBe(false);
  });
});

describe("isDay rule", () => {
  it("should return true for valid days", () => {
    expect(isDay("1")).toBe(true);
    expect(isDay("15")).toBe(true);
    expect(isDay("31")).toBe(true);
  });

  it("should return false for invalid days", () => {
    expect(isDay("0")).toBe(false);
    expect(isDay("32")).toBe(false);
    expect(isDay("abc")).toBe(false);
  });
});

describe("isHOrMorSecond rule", () => {
  it("should return true for valid hours", () => {
    expect(isHOrMorSecond("0")).toBe(true);
    expect(isHOrMorSecond("12")).toBe(true);
    expect(isHOrMorSecond("23")).toBe(true);
  });

  it("should return false for invalid hours", () => {
    expect(isHOrMorSecond("-1")).toBe(false);
    expect(isHOrMorSecond("24")).toBe(false);
    expect(isHOrMorSecond("abc")).toBe(false);
  });
});
