import { rest } from "msw";

export const signUp = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/auth/verify-recaptcha`,
  (req, res, ctx) => {
    const { response } = req.json;
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: {
          success: true,
          challenge_ts: "2023-08-28T20:30:29Z",
          hostname: "localhost",
          score: 0.9,
          action: "signUp",
        },
      })
    );
  }
);

export const emailExist = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/users/exists`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: {
          isValid: true,
        },
      })
    );
  }
);
