import { rest } from "msw";
import { datasheetData } from "./datasheetData";

export const getDatasheet = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/datasheets/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          //message: "Datasheet successfully updated",
        },
        data: { ...datasheetData },
      })
    );
  }
);

export const editDatasheetColumn = rest.put(
  `${process.env.REACT_APP_ENDPOINT}/datasheets/:datasheetId/columns`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "Datasheet column successfully updated",
        },
        data: {
          // name: "Email",
          // dataType: "email",
          // isUnque: true,
          // hasNull: true,
          // defaultValue: "",
          // order: "0",
        },
      })
    );
  }
);

export const createDatasheetColumnOrRow = rest.put(
  `${process.env.REACT_APP_ENDPOINT}/datasheets/:datasheetId`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "Datasheet successfully updated",
        },
        data: datasheetData,
      })
    );
  }
);

export const deleteDatasheetColumn = rest.delete(
  `${process.env.REACT_APP_ENDPOINT}/datasheets/:datasheetId/columns`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "Datasheet column successfully deleted",
        },
        data: { ...datasheetData },
      })
    );
  }
);
