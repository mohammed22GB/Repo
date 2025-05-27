import { render } from "@testing-library/react";
import { rest, responseResolver } from "msw";
import * as React from "react";

export const getIntegrations = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/integrations`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 79,
            per_page: 10,
            current: 1,
            current_page:
              `https://mockurl/api/v1/integrations?per_page=10&page=1`,
          },
        },
        data: [
          {
            properties: {
              connectionCredentials: {
                scopes: [
                  "email",
                  "profile",
                  `https://mail.google.com/`,
                  `https://www.googleapis.com/auth/userinfo.profile`,
                  `https://www.googleapis.com/auth/userinfo.email`,
                  "openid",
                ],
                authType: "GoogleAuth",
                tokenType: "Bearer",
                userInfo: {
                  //sub: "102091656761996322813",
                  name: "Kehinde Shogbanmu",
                  given_name: "Kehinde",
                  family_name: "Shogbanmu",
                  // picture:
                  //   `https://lh3.googleusercontent.com/a/AAcHTtffu-RgEfs8u9lWM8JVhsOwxbQqRHK_YEbSs3mX=s96-c`,
                  email: "kehinde.shogbanmu@descasio.io",
                  // email_verified: true,
                  // locale: "en",
                  hd: "descasio.io",
                },
              },
              resources: [],
              type: "RestApiIntegration",
            },
            type: "RestApiIntegration",
            disabled: false,
            //active: false,
            //_id: "647e20c8fd0e005ec1802b7d",
            name: "g-dev-na-hv,,hvhj",
            group: "payment",
            //account: "615ae60a3b0d9011ce1aecc9",
            user: "615ae60a3b0d9011ce1aecc8",
            // __v: 0,
            id: "647e20c8fd0e005ec1802b7d",
          },
          {
            properties: {
              connectionCredentials: {
                scopes: [],
                authType: "None",
              },
              resources: [],
              type: "RestApiIntegration",
            },
            type: "RestApiIntegration",
            disabled: false,
            //active: false,
            //_id: "6489801bee01bc6edc896e9a",
            user: "615ae60a3b0d9011ce1aecc8",
            account: "615ae60a3b0d9011ce1aecc9",
            name: "hyi",
            group: "payment",
            //__v: 0,
            id: "6489801bee01bc6edc896e9a",
          },
          {
            properties: {
              connectionCredentials: {
                url: "db4free.net",
              },
              resources: [
                {
                  _id: "64899c0ec9acc2756c97d6a6",
                  name: "my_table_1",
                  columns: [
                    {
                      name: "id",
                      fieldType: "int",
                      required: true,
                    },
                    {
                      name: "name",
                      fieldType: "varchar(20)",
                      required: true,
                    },
                  ],
                },
              ],
              type: "MySQL",
              database: "plugatest",
            },
            type: "DatabaseIntegration",
            disabled: false,
            user: "615ae60a3b0d9011ce1aecc8",
            account: "615ae60a3b0d9011ce1aecc9",
            name: "mymy-sql",
            group: "data",
            id: "64899b9bc9acc2756c97d68c",
          },
        ],
      })
    );
  }
);

export const editIntegrations = rest.put(
  `${process.env.REACT_APP_ENDPOINT}/integrations/:id`,
  (req, res, ctx) => {
    const data = {
      name: "Test REST API",
      type: "RestApiIntegration",
      group: "data",
      properties: {
        type: "RestApiIntegration",
        connectionCredentials: {
          authType: "None",
        },
      },
      active: true,
    };
    req.json({ ...data });

    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "Integration successfully updated",
        },
        data: {
          properties: {
            connectionCredentials: {
              scopes: [],
              authType: "None",
            },
            resources: [],
            type: "RestApiIntegration",
          },
          type: "RestApiIntegration",
          disabled: false,
          active: false,
          _id: "6521eb54e6de56cfab34acdb",
          user: "62b1e8e6c3d82b1ddd3dec0f",
          account: "615ae60a3b0d9011ce1aecc9",
          name: "Test REST API",
          group: "data",
          createdAt: "2023-10-07T23:35:48.540Z",
          updatedAt: "2023-10-07T23:35:48.540Z",
          __v: 0,
          id: "6521eb54e6de56cfab34acdb",
        },
      })
    );
  }
);
