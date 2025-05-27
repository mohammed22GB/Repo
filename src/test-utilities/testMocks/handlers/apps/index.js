import { rest } from "msw";
import { duplicateAppData } from "./duplicateAppData";

export const getApps = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/apps`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 100,
            per_page: 10,
            current: 1,
            next: 2,
            current_page: `${process.env.REACT_APP_ENDPOINT}/apps?population=['account','category']&sort={'updatedAt':'desc'}&page=1&per_page=10`,
            next_page: `${process.env.REACT_APP_ENDPOINT}/apps?population=['account','category']&sort={'updatedAt':'desc'}&page=2&per_page=10`,
          },
        },
        data: [
          {
            hasPlugTrigger: true,
            hasWebhookTrigger: false,
            //_id: "65256dbe6b4ba10980454bac",
            isPublic: false,
            active: false,
            user: "615ae60a3b0d9011ce1aecc8",
            account: {
              //twoFactorAuthEnabled: false,
              webhookEnabled: true,
              //active: false,
              //_id: "615ae60a3b0d9011ce1aecc9",
              //__v: 0,
              //createdAt: "2021-10-04T11:31:22.784Z",
              //updatedAt: "2023-09-05T21:29:02.497Z",
              //country: "NG",
              //email: "busayo100@gmail.com",
              //industry: "IT",
              //noOfEmployee: "1 - 25",
              //slug: "descasio-inc",
              user: "615ae60a3b0d9011ce1aecc8",
              name: "Descasio Inc",
              apiKeyDate: "2023-06-18T22:33:10.011Z",
              id: "615ae60a3b0d9011ce1aecc9",
            },
            name: "Timplenta 1",
            description: "sdcasd csdc asdac sd",
            category: {
              active: true,
              type: "ACCOUNT",
              account: "615ae60a3b0d9011ce1aecc9",
              user: "615ae60a3b0d9011ce1aecc8",
              name: "HR & Admin",
              color: "#822765",
              id: "64a2880fd2e3ff52ee53994e",
              //_id: "64a2880fd2e3ff52ee53994e",
              //createdAt: "2023-07-03T08:34:23.992Z",
              //updatedAt: "2023-07-03T08:34:23.992Z",
              //__v: 0,
            },
            //createdAt: "2023-10-10T15:29:02.397Z",
            //updatedAt: "2023-10-10T15:29:02.397Z",
            //__v: 0,
            slug: "timplenta-1-2",
            id: "65256dbe6b4ba10980454bac",
          },
          {
            hasPlugTrigger: true,
            hasWebhookTrigger: false,
            //_id: "64be3973b1c14f4983a775e7",
            isPublic: false,
            active: true,
            user: "615ae60a3b0d9011ce1aecc8",
            account: {
              //twoFactorAuthEnabled: false,
              webhookEnabled: true,
              //_id: "615ae60a3b0d9011ce1aecc9",
              //__v: 0,
              //createdAt: "2021-10-04T11:31:22.784Z",
              //updatedAt: "2023-09-05T21:29:02.497Z",
              //country: "NG",
              //email: "busayo100@gmail.com",
              //industry: "IT",
              //noOfEmployee: "1 - 25",
              //slug: "descasio-inc",
              active: false,
              user: "615ae60a3b0d9011ce1aecc8",
              name: "Descasio Inc",
              apiKeyDate: "2023-06-18T22:33:10.011Z",
              id: "615ae60a3b0d9011ce1aecc9",
            },
            name: "CROSS XJ",
            description: "sdsdcds",
            category: {
              active: true,
              type: "ACCOUNT",
              account: "615ae60a3b0d9011ce1aecc9",
              user: "615ae60a3b0d9011ce1aecc8",
              name: "HR & Admin",
              color: "#822765",
              id: "64a2880fd2e3ff52ee53994e",
              //_id: "64a2880fd2e3ff52ee53994e",
              //createdAt: "2023-07-03T08:34:23.992Z",
              //updatedAt: "2023-07-03T08:34:23.992Z",
              //__v: 0,
            },
            //createdAt: "2023-07-24T08:42:27.633Z",
            //updatedAt: "2023-08-02T12:27:38.195Z",
            //__v: 0,
            slug: "cross-xj",
            id: "64be3973b1c14f4983a775e7",
          },
        ],
      })
    );
  }
);

export const getMoreApps = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/apps`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 100,
            per_page: 10,
            current: 1,
            next: 2,
            current_page: `${process.env.REACT_APP_ENDPOINT}/apps?population=['account','category']&sort={'updatedAt':'desc'}&page=1&per_page=10`,
            next_page: `${process.env.REACT_APP_ENDPOINT}/apps?population=['account','category']&sort={'updatedAt':'desc'}&page=2&per_page=10`,
          },
        },
        data: [
          {
            hasPlugTrigger: true,
            hasWebhookTrigger: false,
            //_id: "65256dbe6b4ba10980454bac",
            isPublic: false,
            active: false,
            user: "615ae60a3b0d9011ce1aecc8",
            account: {
              //twoFactorAuthEnabled: false,
              webhookEnabled: true,
              //active: false,
              //_id: "615ae60a3b0d9011ce1aecc9",
              //__v: 0,
              //createdAt: "2021-10-04T11:31:22.784Z",
              //updatedAt: "2023-09-05T21:29:02.497Z",
              //country: "NG",
              //email: "busayo100@gmail.com",
              //industry: "IT",
              //noOfEmployee: "1 - 25",
              //slug: "descasio-inc",
              user: "615ae60a3b0d9011ce1aecc8",
              name: "Descasio Inc",
              apiKeyDate: "2023-06-18T22:33:10.011Z",
              id: "615ae60a3b0d9011ce1aecc9",
            },
            name: "Timplenta 1",
            description: "sdcasd csdc asdac sd",
            category: {
              active: true,
              type: "ACCOUNT",
              account: "615ae60a3b0d9011ce1aecc9",
              user: "615ae60a3b0d9011ce1aecc8",
              name: "HR & Admin",
              color: "#822765",
              id: "64a2880fd2e3ff52ee53994e",
              //_id: "64a2880fd2e3ff52ee53994e",
              //createdAt: "2023-07-03T08:34:23.992Z",
              //updatedAt: "2023-07-03T08:34:23.992Z",
              //__v: 0,
            },
            //createdAt: "2023-10-10T15:29:02.397Z",
            //updatedAt: "2023-10-10T15:29:02.397Z",
            //__v: 0,
            slug: "timplenta-1-2",
            id: "65256dbe6b4ba10980454bac",
          },
          {
            hasPlugTrigger: true,
            hasWebhookTrigger: false,
            //_id: "64be3973b1c14f4983a775e7",
            isPublic: false,
            active: true,
            user: "615ae60a3b0d9011ce1aecc8",
            account: {
              //twoFactorAuthEnabled: false,
              webhookEnabled: true,
              //_id: "615ae60a3b0d9011ce1aecc9",
              //__v: 0,
              //createdAt: "2021-10-04T11:31:22.784Z",
              //updatedAt: "2023-09-05T21:29:02.497Z",
              //country: "NG",
              //email: "busayo100@gmail.com",
              //industry: "IT",
              //noOfEmployee: "1 - 25",
              //slug: "descasio-inc",
              active: false,
              user: "615ae60a3b0d9011ce1aecc8",
              name: "Descasio Inc",
              apiKeyDate: "2023-06-18T22:33:10.011Z",
              id: "615ae60a3b0d9011ce1aecc9",
            },
            name: "CROSS XJ",
            description: "sdsdcds",
            category: {
              active: true,
              type: "ACCOUNT",
              account: "615ae60a3b0d9011ce1aecc9",
              user: "615ae60a3b0d9011ce1aecc8",
              name: "HR & Admin",
              color: "#822765",
              id: "64a2880fd2e3ff52ee53994e",
              //_id: "64a2880fd2e3ff52ee53994e",
              //createdAt: "2023-07-03T08:34:23.992Z",
              //updatedAt: "2023-07-03T08:34:23.992Z",
              //__v: 0,
            },
            //createdAt: "2023-07-24T08:42:27.633Z",
            //updatedAt: "2023-08-02T12:27:38.195Z",
            //__v: 0,
            slug: "cross-xj",
            id: "64be3973b1c14f4983a775e7",
          },
        ],
      })
    );
  }
);

export const getCategories = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/categories`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 2,
            per_page: 10,
            current: 1,
            current_page: `${process.env.REACT_APP_ENDPOINT}/categories?per_page=10&page=1`,
          },
        },
        data: [
          {
            active: true,
            type: "ACCOUNT",
            account: "615ae60a3b0d9011ce1aecc9",
            name: "General",
            // _id: "64b65db8771c6bb33ee86fe1",
            id: "64b65db8771c6bb33ee86fe1",
          },
          {
            active: true,
            type: "ACCOUNT",
            account: "615ae60a3b0d9011ce1aecc9",
            user: "615ae60a3b0d9011ce1aecc8",
            name: "HR & Admin",
            color: "#822765",
            // _id: "64a2880fd2e3ff52ee53994e",
            id: "64a2880fd2e3ff52ee53994e",
          },
        ],
      })
    );
  }
);

export const editAppProperties = rest.put(
  `${process.env.REACT_APP_ENDPOINT}/apps/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "App successfully updated",
        },
        data: {
          isPublic: false,
          hasPlugTrigger: true,
          hasWebhookTrigger: false,
          active: true,
          _id: "64be3973b1c14f4983a775e7",
          user: "62b1e8e6c3d82b1ddd3dec0f",
          account: "615ae60a3b0d9011ce1aecc9",
          name: "CROSS XJ",
          description: "sdsdcdse",
          category: "64a2880fd2e3ff52ee53994e",
          slug: "cross-xj",
          id: "64be3973b1c14f4983a775e7",
        },
      })
    );
  }
);

export const duplicateApp = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/apps/duplicate`,
  (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        _meta: {
          status_code: 201,
          success: true,
          message: "App successfully created",
        },
        data: { ...duplicateAppData },
      })
    );
  }
);

export const deleteApp = rest.delete(
  `${process.env.REACT_APP_ENDPOINT}/apps/:appId`,
  (req, res, ctx) => {
    const { appId } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "App successfully deleted",
        },
        data: {
          _id: appId,
        },
      })
    );
  }
);

export const createNewApp = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/apps`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 201,
          success: true,
          message: "App successfully created",
        },
        data: {
          isPublic: true,
          hasPlugTrigger: true,
          hasWebhookTrigger: false,
          hidden: false,
          active: false,
          deleted: false,
          _id: "6546dd52fff86f13935cb087",
          user: "615ae60a3b0d9011ce1aecc8",
          account: "615ae60a3b0d9011ce1aecc9",
          name: "A new App",
          description: "Description for new App",
          category: "64a2880fd2e3ff52ee53994e",
          slug: "a-new-app",
          id: "6546dd52fff86f13935cb087",
          screen: {
            type: "app",
            style: {
              page: {
                horizontalMargin: 0.5,
                verticalMargin: 0.5,
                backgroundColor: "#FFFFFF",
                lineSpacing: 15,
              },
              header: {
                height: 50,
                textAlign: "left",
                fontSize: 18,
              },
            },
            active: true,
            deleted: false,
            _id: "6546dd53fff86f13935cb08c",
            user: "615ae60a3b0d9011ce1aecc8",
            account: "615ae60a3b0d9011ce1aecc9",
            app: "6546dd52fff86f13935cb087",
            name: "Screen 1",
            slug: "screen-1-223",
            placeholders: [],
            __v: 0,
            id: "6546dd53fff86f13935cb08c",
          },
          workflow: {
            tasks: [
              {
                id: "d2810ec0-337c-4d9d-88ca-132a8768b7bb",
                type: "StartTask",
                data: {
                  label: "input node",
                },
                position: {
                  x: 400,
                  y: 200,
                },
              },
              {
                id: "32a09065-67f2-4ba2-b4de-db29cc6a0f43",
                type: "EndTask",
                data: {
                  label: "output node",
                },
                position: {
                  x: 400,
                  y: 500,
                },
              },
            ],
            active: false,
            deleted: false,
            _id: "6546dd53fff86f13935cb089",
            user: "615ae60a3b0d9011ce1aecc8",
            account: "615ae60a3b0d9011ce1aecc9",
            app: "6546dd52fff86f13935cb087",
            name: "Index",
            id: "6546dd53fff86f13935cb089",
          },
        },
      })
    );
  }
);
