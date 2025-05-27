import { transformData } from "./index";
import moment from "moment";

describe("transformData", () => {
  it("transforms date strings", () => {
    const date = "2024-04-12T06:25:05.412Z";
    expect(transformData(date)).toBe(moment(date).format("lll"));
  });

  it("transforms booleans", () => {
    expect(transformData(true)).toBe("Yes");
    expect(transformData(false)).toBe("No");
  });

  it("returns strings unchanged", () => {
    expect(transformData("test string")).toBe("test string");
  });

  it("transforms null/undefined to empty string", () => {
    expect(transformData(null)).toBe("");
    expect(transformData(undefined)).toBe("");
  });

  it("transforms arrays of strings", () => {
    expect(transformData(["a", "b", "c"])).toBe("a, b, c");
  });

  it("transforms numbers to strings", () => {
    expect(transformData(123)).toBe("123");
  });

  it("transforms empty arrays", () => {
    expect(transformData([])).toEqual("");
  });

  it("handles arrays with mixed types", () => {
    const input = [123, "test", true, null];
    expect(transformData(input)).toEqual(["123", "test", "Yes", ""]);
  });

  it("handles deeply nested objects", () => {
    const input = {
      user: {
        details: {
          active: true,
          joinDate: "2024-01-01",
        },
      },
    };

    expect(transformData(input)).toEqual({
      user: {
        details: {
          active: "Yes",
          joinDate: "Jan 1, 2024 12:00 AM",
        },
      },
    });
  });

  it("handles objects with array values", () => {
    const input = {
      tags: ["one", "two"],
      status: true,
    };

    expect(transformData(input)).toEqual({
      tags: "one, two",
      status: "Yes",
    });
  });
});
