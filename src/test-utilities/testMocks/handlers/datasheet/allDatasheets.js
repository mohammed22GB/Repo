import { rest } from "msw";

export const fetchDatasheets = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/datasheets`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          //message: "Datasheet successfully updated",
        },
        data: [
          {
            active: true,
            _id: "63eb56c974e7d3eb14943143",
            user: "615ae60a3b0d9011ce1aecc8",
            name: "For Reports",
            createdAt: "2023-02-14T09:39:21.921Z",
            updatedAt: "2023-02-14T09:56:14.726Z",
            id: "63eb56c974e7d3eb14943143",
          },
          {
            active: true,
            _id: "638f663175acc02d07f9526e",
            user: "640b7e02c9b936457885113e",
            name: "TestSheet",
            createdAt: "2022-12-06T15:56:33.740Z",
            updatedAt: "2023-07-10T13:22:22.502Z",
            id: "638f663175acc02d07f9526e",
          },
        ],
      })
    );
  }
);

export const createDatasheet = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/datasheets`,
  (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        _meta: {
          status_code: 201,
          success: true,
          message: "Datasheet successfully created",
        },
        data: {
          importCount: 0,
          data: [],
          active: true,
          deleted: false,
          _id: "65430b112422247d541255f0",
          user: "62b1e8e6c3d82b1ddd3dec0f",
          account: "615ae60a3b0d9011ce1aecc9",
          name: "A New Datasheet",
          columns: [],
          id: "65430b112422247d541255f0",
        },
      })
    );
  }
);

export const duplicateDatasheet = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/datasheets/duplicate`,
  (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        _meta: {
          status_code: 201,
          success: true,
          message: "Datasheet successfully created",
        },
        data: {
          importCount: 0,
          data: [],
          active: true,
          deleted: false,
          _id: "6546e7cbfff86f13935cb11b",
          user: "615ae60a3b0d9011ce1aecc8",
          account: "615ae60a3b0d9011ce1aecc9",
          name: "New datasheet copy",
          columns: [],
          id: "6546e7cbfff86f13935cb11b",
        },
      })
    );
  }
);

export const deleteDatasheet = rest.delete(
  `${process.env.REACT_APP_ENDPOINT}/datasheets/:id`,
  (req, res, ctx) => {
    const { id } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "App successfully deleted",
        },
        data: {
          _id: id,
        },
      })
    );
  }
);
