import { separateNumbersWithComma } from "../../../../views/common/helpers/helperFunctions";

describe("separateNumbersWithComma", () => {
  // 1. Edge Cases: Invalid `text` argument
  test("should return the argument as is when text is null", () => {
    expect(separateNumbersWithComma(null)).toBe(null);
  });

  test("should return the argument as is when text is undefined", () => {
    expect(separateNumbersWithComma(undefined)).toBe(undefined);
  });

  test("should return the argument as is when text is not a string (number)", () => {
    expect(separateNumbersWithComma(12345)).toBe(12345);
  });

  test("should return the argument as is when text is not a string (object)", () => {
    const obj = { text: "sample" };
    expect(separateNumbersWithComma(obj)).toBe(obj);
  });

  test("should return the argument as is when text is an empty string", () => {
    expect(separateNumbersWithComma("")).toBe("");
  });

  // 2. Case: isDocumentScreen is true
  test("should return text as is when isDocumentScreen is true", () => {
    expect(separateNumbersWithComma("12345", false, true)).toBe("12345");
  });

  // 3. Numbers with formatting
  test("should add commas to valid standalone numbers", () => {
    expect(separateNumbersWithComma("1234")).toBe("1,234");
    expect(separateNumbersWithComma("1234567")).toBe("1,234,567");
  });

  test("should not add commas to numbers adjacent to letters or special characters", () => {
    expect(separateNumbersWithComma("a1234b")).toBe("a1234b");
    expect(separateNumbersWithComma("test-1234")).toBe("test-1234");
    expect(separateNumbersWithComma("@1234")).toBe("@1234");
    expect(separateNumbersWithComma("1234!")).toBe("1234!");
  });

  test("should not add commas to numbers starting with 0, N, or +", () => {
    expect(separateNumbersWithComma("01234")).toBe("01234");
    expect(separateNumbersWithComma("+1234")).toBe("+1234");
    expect(separateNumbersWithComma("N1234")).toBe("N1234");
  });

  test("should not add commas to numbers following 'staff id', 'staff-id', or 'staffid'", () => {
    expect(separateNumbersWithComma("staff id: 12345")).toBe("staff id: 12345");
    expect(separateNumbersWithComma("staff-id: 12345")).toBe("staff-id: 12345");
    expect(separateNumbersWithComma("staffid: 12345")).toBe("staffid: 12345");
  });

  test("should not add commas to four-digit numbers following month names", () => {
    expect(separateNumbersWithComma("Jan 2024")).toBe("Jan 2024");
    expect(separateNumbersWithComma("February: 2023")).toBe("February: 2023");
  });

  test("should not add commas to numbers after text ending with 'id'", () => {
    expect(separateNumbersWithComma("orderid: 12345")).toBe("orderid: 12345");
  });

  // 4. Combined scenarios
  test("should correctly add commas to numbers mixed with valid and invalid cases", () => {
    const text = "1234 test 56789 id: 98765 and 1234567";
    const expected = "1,234 test 56,789 id: 98,765 and 1,234,567";
    expect(separateNumbersWithComma(text)).toBe(expected);
  });

  test("should handle multiple valid standalone numbers in a string", () => {
    const text = "The numbers are 1234, 56789, and 1234567.";
    const expected = "The numbers are 1,234, 56,789, and 1,234,567.";
    expect(separateNumbersWithComma(text)).toBe(expected);
  });

  test("should format numbers after 'Test id:' as it is not part of staffIdPatterns", () => {
    const text = "Test id: 12345 and @6789, and 1234567";
    const expected = "Test id: 12,345 and @6789, and 1,234,567";
    expect(separateNumbersWithComma(text)).toBe(expected);
  });

  test("should not add commas when isFormattedText is false", () => {
    expect(separateNumbersWithComma("1234567", false)).toBe("1,234,567");
  });

  // 5. Case: Large strings with multiple contexts
  test("should perform accurately on large input text", () => {
    const largeText =
      "Report for Jan 2024 shows 1234 new entries. Staff id: 56789 is invalid, but total is 1234567.";
    const expected =
      "Report for Jan 2024 shows 1,234 new entries. Staff id: 56789 is invalid, but total is 1,234,567.";
    expect(separateNumbersWithComma(largeText)).toBe(expected);
  });
});
