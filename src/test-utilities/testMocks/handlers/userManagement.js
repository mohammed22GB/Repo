import { rest } from "msw";

export const getUsers = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/users`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 26,
            per_page: 100,
            current: 1,
            current_page: "https://api-dev.plugonline.io/api/v1/users",
          },
        },
        data: [
          {
            roles: ["Designer"],
            userGroups: [
              {
                _id: "6408be0f7efbca662474adbb",
                name: "Excos",
                id: "6408be0f7efbca662474adbb",
              },
            ],
            twoFactorAuthType: "email",
            _id: "667c030a5a8bc978778d1ffd",
            firstName: "Sahir",
            lastName: "shyheim",
            email: "sahir.shyheim@floodouts.com",
            mobile: "444",
            id: "667c030a5a8bc978778d1ffd",
          },
          {
            roles: ["Employee"],
            userGroups: [
              {
                _id: "6408bdfb7efbca662474adb6",
                name: "Members",
                id: "6408bdfb7efbca662474adb6",
              },
            ],
            twoFactorAuthType: "email",
            _id: "661dbd15671e285a528d921f",
            email: "tyray.dahir@foodfarms.net",
            lastName: "Dahir",
            firstName: "Tyray",
            mobile: "808",
            id: "661dbd15671e285a528d921f",
          },
          {
            roles: ["Designer", "Employee"],
            userGroups: [
              {
                _id: "6408bdfb7efbca662474adb6",
                name: "Members",
                id: "6408bdfb7efbca662474adb6",
              },
              {
                _id: "6408be0f7efbca662474adbb",
                name: "Excos",
                id: "6408be0f7efbca662474adbb",
              },
            ],
            twoFactorAuthType: "email",
            _id: "650312d7dc262642834e5987",
            email: "vasily.wynton@feerock.com",
            firstName: "Vasily",
            lastName: "Wynton",
            mobile: "32314",
            id: "650312d7dc262642834e5987",
          },
          {
            roles: ["Employee"],
            userGroups: [
              {
                _id: "6408bdfb7efbca662474adb6",
                name: "Members",
                id: "6408bdfb7efbca662474adb6",
              },
              {
                _id: "6408be0f7efbca662474adbb",
                name: "Excos",
                id: "6408be0f7efbca662474adbb",
              },
            ],
            twoFactorAuthType: "email",
            _id: "64bd96d2e7c88e31ad282619",
            firstName: "Aditya",
            lastName: "Marcell",
            email: "aditya.marcell@fixedfor.com",
            mobile: "769",
            id: "64bd96d2e7c88e31ad282619",
          },
        ],
      })
    );
  }
);
