import { populate } from "./index";

describe("populate function", () => {
  it("should convert fields object to population array", () => {
    const fields = {
      users: ["firstName", "lastName", "email"],
      account: ["name", "country"],
    };

    const expected = [
      { path: "users", select: "firstName lastName email" },
      { path: "account", select: "name country" },
    ];

    expect(populate(fields)).toEqual(expected);
  });

  it("should handle empty fields object", () => {
    const fields = {};
    expect(populate(fields)).toEqual([]);
  });

  it("should handle fields with empty arrays", () => {
    const fields = {
      users: [],
      account: ["name"],
    };

    const expected = [
      { path: "users", select: "" },
      { path: "account", select: "name" },
    ];

    expect(populate(fields)).toEqual(expected);
  });
});
