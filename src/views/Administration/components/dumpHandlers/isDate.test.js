import { isDate } from "./index";
import moment from "moment";

describe("isDate", () => {
  it("should return true for valid ISO 8601 date strings", () => {
    expect(isDate("2023-05-20T10:30:00Z")).toBe(true);
    expect(isDate("2023-05-20")).toBe(true);
  });

  it("should return false for invalid date strings", () => {
    expect(isDate("not a date")).toBe(false);
    expect(isDate("2023/05/20")).toBe(false);
    expect(isDate("")).toBe(false);
  });

  it("should return false for non-string inputs", () => {
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
    expect(isDate(123)).toBe(false);
    expect(isDate({})).toBe(false);
    expect(isDate([])).toBe(false);
  });

  it("should return true for current date in ISO format", () => {
    const now = moment().toISOString();
    expect(isDate(now)).toBe(true);
  });
});
