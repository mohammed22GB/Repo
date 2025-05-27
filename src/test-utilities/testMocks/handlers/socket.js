import { rest} from "msw";

export const getNotificationSockets = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/socket.io`,
  (req, res, ctx) => {
    //
    return res(ctx.status(200), ctx.json({}));
  }
);
