import { rest } from "msw";

export const emptyDatasheetPermissions = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/permissions/datasheet/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: [],
      })
    );
  }
);
export const getViewDatasheetPermissions = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/permissions/datasheet/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: [
          {
            access: "read",
            identity: "user",
            value: "640b7e02c9b936457885113e",
            name: "David Ike-Njoku",
          },
        ],
      })
    );
  }
);
export const getEditDatasheetPermissions = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/permissions/datasheet/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: [
          {
            access: "modify",
            identity: "user",
            value: "640b7e02c9b936457885113e",
            name: "David Ike-Njoku",
          },
        ],
      })
    );
  }
);
export const getDeleteDatasheetPermissions = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/permissions/datasheet/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: [
          {
            access: "delete",
            identity: "user",
            value: "640b7e02c9b936457885113e",
            name: "David Ike-Njoku",
          },
        ],
      })
    );
  }
);

export const updateDatasheetPermissions = rest.put(
  `${process.env.REACT_APP_ENDPOINT}/permissions/datasheet/:datasheetId/:permsType/resource`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: {
          _id: "654d9453a8b8a0435e4d1644",
          name: "PERMISSION_DATASHEET_RESOURCE_READ_615ae60a3b0d9011ce1aecc9",
          resource: "datasheet",
          resourceId: "6546e7cbfff86f13935cb11b",
          level: "resource",
          access: "read",
          grantedList: [
            {
              _id: "654d9a3ea8b8a0435e4d164f",
              identity: "user",
              value: "631532a3c8bb7111243301fc",
            },
            {
              _id: "654d9a3ea8b8a0435e4d156s",
              identity: "user",
              value: "640b7e02c9b936457885113e",
            },
          ],
          deniedList: [],
          account: "615ae60a3b0d9011ce1aecc9",
          id: "654d9453a8b8a0435e4d1644",
        },
      })
    );
  }
);

export const removeDatasheetPermissions = rest.delete(
  `${process.env.REACT_APP_ENDPOINT}/permissions/datasheet/:datasheetId/:permsType/:value`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: {
          message: "Selected permission removed",
        },
      })
    );
  }
);

export const groupUpdateDatasheetPermissions = rest.delete(
  `${process.env.REACT_APP_ENDPOINT}/permissions/datasheet/:datasheetId/:permsType`,
  (req, res, ctx) => {
    //console.log(req.params);
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: {
          _id: "654d9453a8b8a0435e4d1644",
          name: "PERMISSION_DATASHEET_RESOURCE_READ_615ae60a3b0d9011ce1aecc9",
          resource: "datasheet",
          resourceId: "6546e7cbfff86f13935cb11b",
          level: "resource",
          access: "read",
          grantedList: [
            {
              _id: "654d9a3ea8b8a0435e4d164f",
              identity: "user",
              value: "631532a3c8bb7111243301fc",
            },
            {
              _id: "654d9a3ea8b8a0435e4d156s",
              identity: "user",
              value: "640b7e02c9b936457885113e",
            },
          ],
          deniedList: [],
          account: "615ae60a3b0d9011ce1aecc9",
          id: "654d9453a8b8a0435e4d1644",
        },
      })
    );
  }
);
