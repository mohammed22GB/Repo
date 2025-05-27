import { render } from "@testing-library/react";
import { rest, responseResolver } from "msw";
import * as React from "react";

export const login = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/auth/login`,
  (req, res, ctx) => {
    //

    //const populationParam = req.url.searchParams.get("population");
    //populationParam = '["account"]';

    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YmQ2Mzg2ZTdjODhlMzFhZDI4MjFlMSIsImF2YXRhciI6e30sImVtYWlsIjoia2FoZWVtLmRlZWdhbkBmaXhlZGZvci5jb20iLCJtb2JpbGUiOiI1NDkiLCJmaXJzdE5hbWUiOiJLYWhlZW0iLCJsYXN0TmFtZSI6IkRlZWdhbiIsImFjY291bnQiOiI2NDA4YmQ4NDdlZmJjYTY2MjQ3NGFjMDIifSwiYWNjZXNzVG9rZW4iOiJBVF82NGJkNjM4NmU3Yzg4ZTMxYWQyODIxZTEtS3hCMW15dlU0ckZkV24yd1pMRUhUQUlrIiwiYXV0aElkIjoiNjRiZDYzODZlN2M4OGUzMWFkMjgyMWUxIiwiYWNjb3VudCI6IjY0MDhiZDg0N2VmYmNhNjYyNDc0YWMwMiIsImV4cCI6MTY5NDQxOTI2NiwiaWF0IjoxNjkzODE0NDY2fQ.kC3xQl4LuiJy2mX539aouUthDgiUgAG6_x4WUizT1g0",
          accessToken: "AT_64bd6386e7c88e31ad2821e1-KxB1myvU4rFdWn2wZLEHTAIk",
        },
        data: {
          id: "64bd6386e7c88e31ad2821e1",
          emailVerified: true,
          mobileVerified: false,
          email: "kaheem.deegan@fixedfor.com",
          account: {
            twoFactorAuthEnabled: false,
            webhookEnabled: false,
            active: false,
            _id: "6408bd847efbca662474ac02",
            user: "6408bd847efbca662474abff",
            __v: 0,
            country: "NG",
            createdAt: "2023-03-08T16:53:24.940Z",
            industry: "Information Technology",
            name: "Jenscable",
            noOfEmployee: "101 - 500",
            slug: "jenscable",
            updatedAt: "2023-04-13T02:33:15.445Z",
            id: "6408bd847efbca662474ac02",
          },
        },
      })
    );
  }
);
