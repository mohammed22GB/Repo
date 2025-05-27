import { makeHeaders } from "./index";

describe("makeHeaders", () => {
  it("should generate correct headers from config", () => {
    const config = {
      selection: ["totalApps", "totalUsers"],
      totalApps: ["total"],
      totalUsers: ["total"],
    };
    const allowedFields = ["totalApps", "totalUsers"];

    const result = makeHeaders(config, allowedFields);

    expect(result).toEqual([
      {
        label: "Total Apps Total",
        key: "totalApps.total",
      },
      {
        label: "Total Users Total",
        key: "totalUsers.total",
      },
    ]);
  });

  it("should handle non-nested fields", () => {
    const config = {
      selection: ["name", "email"],
      name: [],
      email: [],
    };
    const allowedFields = [];

    const result = makeHeaders(config, allowedFields);

    expect(result).toEqual([
      {
        label: "Email",
        key: "email",
      },
      {
        label: "Name",
        key: "name",
      },
    ]);
  });
});
