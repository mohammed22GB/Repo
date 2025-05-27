import { rest } from "msw";

export const getUserGroupsApps = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/user-groups`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 4,
            per_page: 10,
            current: 1,
            current_page: `${process.env.REACT_APP_ENDPOINT}/user-groups`,
          },
        },
        data: [
          {
            _id: "631532a27dcc68d5b21c9340",
            name: "Legal",
            id: "631532a27dcc68d5b21c9340",
          },
          {
            _id: "623cc92216389338ebfdc6f7",
            name: "Quota",
            id: "623cc92216389338ebfdc6f7",
          },
          {
            _id: "623cc8b016389338ebfdc6eb",
            name: "Wells",
            id: "623cc8b016389338ebfdc6eb",
          },
          {
            _id: "6188d47fb1202701fbc1ca23",
            name: "Senior Executives",
            id: "6188d47fb1202701fbc1ca23",
          },
        ],
      })
    );
  }
);
export const getUserGroupsList = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/user-groups`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 4,
            per_page: 10,
            current: 1,
            current_page: `${process.env.REACT_APP_ENDPOINT}/user-groups`,
          },
        },
        data: [
          {
            _id: "65ae9e2e7220d8b56471a77a",
            admins: [],
            name: "Male",
            users: [
              {
                userGroups: [
                  "6408be0f7efbca662474adbb",
                  "6408bdfb7efbca662474adb6",
                  "65ae9e2c7220d8b56471a3a4",
                  "65ae9e2e7220d8b56471a77a",
                ],
                _id: "6408bd847efbca662474abff",
                firstName: "Jens",
                lastName: "cable",
                id: "6408bd847efbca662474abff",
              },
            ],
            id: "65ae9e2e7220d8b56471a77a",
          },
          {
            admins: ["64bd96d2e7c88e31ad282619"],
            _id: "6408be0f7efbca662474adbb",
            user: "6408bd847efbca662474abff",
            name: "Excos",
            description: "Association Executives",
            users: [
              {
                userGroups: [
                  "6408be0f7efbca662474adbb",
                  "6408bdfb7efbca662474adb6",
                  "65ae9e2c7220d8b56471a3a4",
                  "65ae9e2e7220d8b56471a77a",
                ],
                _id: "6408bd847efbca662474abff",
                firstName: "Jens",
                lastName: "cable",
                id: "6408bd847efbca662474abff",
              },
              {
                userGroups: ["6408be0f7efbca662474adbb"],
                _id: "667c030a5a8bc978778d1ffd",
                firstName: "Sahir",
                lastName: "shyheim",
                id: "667c030a5a8bc978778d1ffd",
              },
            ],
            id: "6408be0f7efbca662474adbb",
          },
        ],
      })
    );
  }
);
