import { rest } from "msw";

export const getAccountById = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/users/:id`,
  (req, res, ctx) => {
    //
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: {
          mobileVerified: false,
          emailVerified: false,
          roles: ["Admin", "Employee", "Designer", "PlugAdmin"],
          userGroups: [],
          passwordReset: false,
          changePassword: false,
          twoFactorAuthType: "email",
          active: false,
          _id: "615ae60a3b0d9011ce1aecc8",
          // userType: "User",
          email: "kallkenny@email.com",
          emailVerifyCodeExpiration: "2021-10-04T12:31:22.781Z",
          account: {
            twoFactorAuthEnabled: false,
            webhookEnabled: true,
            active: false,
            _id: "615ae60a3b0d9011ce1aecc9",
            user: "615ae60a3b0d9011ce1aecc8",
            country: "NG",
            email: "busayo100@gmail.com",
            industry: "IT",
            name: "Descasio Inc",
            noOfEmployee: "1 - 25",
            slug: "descasio-inc",
            apiKeyDate: "2023-06-18T22:33:10.011Z",
            id: "615ae60a3b0d9011ce1aecc9",
          },
          socketId: null,
          businessRole: "CTO",
          firstName: "Kala",
          lastName: "Pata",
          resetCodeExpiration: "2023-12-03T08:05:28.029Z",
          twoFactorAuthEnabled: true,
          twoFactorAuthSecret: "w",
          mobileVerificationCodeExpiration: "2022-07-01T14:16:58.424Z",
          mobile: "2348089898089",
          id: "615ae60a3b0d9011ce1aecc8",
        },
      })
    );
  }
);

export const editUser = rest.put(
  `${process.env.REACT_APP_ENDPOINT}/users/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "Account successfully updated",
        },
        data: {
          twoFactorAuthEnabled: false,
          webhookEnabled: false,
          active: false,
          _id: "6408bd847efbca662474ac02",
          user: "6408bd847efbca662474abff",
          __v: 0,
          country: "Nigeria",
          createdAt: "2023-03-08T16:53:24.940Z",
          industry: "Information Technology",
          name: "Jenscable",
          noOfEmployee: "101 - 500",
          slug: "jenscable",
          updatedAt: "2023-12-06T02:45:37.119Z",
          id: "6408bd847efbca662474ac02",
        },
      })
    );
  }
);

export const editAccount = rest.put(
  `${process.env.REACT_APP_ENDPOINT}/accounts/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "Account successfully updated",
        },
        data: {
          twoFactorAuthEnabled: false,
          webhookEnabled: false,
          active: false,
          _id: "6408bd847efbca662474ac02",
          user: "6408bd847efbca662474abff",
          __v: 0,
          country: "Nigeria",
          createdAt: "2023-03-08T16:53:24.940Z",
          industry: "Information Technology",
          name: "Jenscable",
          noOfEmployee: "101 - 500",
          slug: "jenscable",
          updatedAt: "2023-12-06T02:45:37.119Z",
          id: "6408bd847efbca662474ac02",
        },
      })
    );
  }
);

export const editMobileNum = rest.put(
  `${process.env.REACT_APP_ENDPOINT}/users/send-verify-mobile`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "Account successfully updated",
        },
        data: {
          twoFactorAuthEnabled: false,
          webhookEnabled: false,
          active: false,
          _id: "6408bd847efbca662474ac02",
          user: "6408bd847efbca662474abff",
          __v: 0,
          country: "Nigeria",
          createdAt: "2023-03-08T16:53:24.940Z",
          industry: "Information Technology",
          name: "Jenscable",
          noOfEmployee: "101 - 500",
          slug: "jenscable",
          updatedAt: "2023-12-06T02:45:37.119Z",
          id: "6408bd847efbca662474ac02",
        },
      })
    );
  }
);

export const getAccountInfo = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/accounts/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: {
          twoFactorAuthEnabled: false,
          webhookEnabled: false,
          active: false,
          _id: "6408bd847efbca662474ac02",
          user: "6408bd847efbca662474abff",
          __v: 0,
          country: "Nigeria",
          createdAt: "2023-03-08T16:53:24.940Z",
          industry: "Information Technology",
          name: "Jenscable",
          noOfEmployee: "101 - 500",
          slug: "jenscable",
          updatedAt: "2023-12-06T02:45:37.119Z",
          id: "6408bd847efbca662474ac02",
        },
      })
    );
  }
);

export const getAccountWebhookInfo = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/accounts/webhook/status`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: {
          webhookEnabled: false,
          webhookApiKey: "1234567890",
          webhookUrl: "https://example.com/webhook",
        },
      })
    );
  }
);
