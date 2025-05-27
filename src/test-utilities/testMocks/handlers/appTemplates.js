import { rest } from "msw";

export const getTemplates = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/templates`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 50,
            per_page: 10,
            current: 1,
            next: 2,
            current_page: `${process.env.REACT_APP_ENDPOINT}/templates?population=['account','category']&sort={'updatedAt':'desc'}&page=1&per_page=10`,
            next_page: `${process.env.REACT_APP_ENDPOINT}/templates?population=['account','category']&sort={'updatedAt':'desc'}&page=2&per_page=10`,
          },
        },
        data: [
          {
            active: false,
            _id: "651f55a7550a2192fae83d4d",
            user: "615ae60a3b0d9011ce1aecc8",
            name: "testing new template",
            description: "sdvsdv vsdfv sdfvds",
            category: {
              active: true,
              type: "ACCOUNT",
              _id: "64b65db8771c6bb33ee86fe1",
              account: "615ae60a3b0d9011ce1aecc9",
              name: "General",
              __v: 0,
              id: "64b65db8771c6bb33ee86fe1",
            },
            app: "651f55a6550a2192fae83d3c",
            slug: "testing-new-template",
            __v: 0,
            id: "651f55a7550a2192fae83d4d",
          },
          {
            active: true,
            _id: "64e5fb3e02ef258965301c04",
            user: "615ae60a3b0d9011ce1aecc8",
            name: "Timplenta 1",
            description: "sdcasd csdc asdac sd",
            category: {
              active: true,
              type: "ACCOUNT",
              _id: "64a2880fd2e3ff52ee53994e",
              account: "615ae60a3b0d9011ce1aecc9",
              user: "615ae60a3b0d9011ce1aecc8",
              name: "HR & Admin",
              color: "#822765",
              __v: 0,
              id: "64a2880fd2e3ff52ee53994e",
            },
            app: "64e5fb3c02ef258965301bf3",
            slug: "timplenta-1",
            __v: 0,
            id: "64e5fb3e02ef258965301c04",
          },
        ],
      })
    );
  }
);

export const duplicateTemplates = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/templates/duplicate`,
  (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        _meta: {
          status_code: 201,
          success: true,
          message: "Template successfully created",
        },
        data: {
          active: false,
          deleted: false,
          _id: "653b1d293ffcd5e1dd144c6c",
          user: "615ae60a3b0d9011ce1aecc8",
          name: "Timplenta 1 copy",
          description: "sdcasd csdc asdac sd",
          category: "64a2880fd2e3ff52ee53994e",
          app: "653b1d253ffcd5e1dd144c38",
          slug: "timplenta-1-copy",
          __v: 0,
          id: "653b1d293ffcd5e1dd144c6c",
        },
      })
    );
  }
);

export const editTemplateProperties = rest.put(
  `${process.env.REACT_APP_ENDPOINT}/templates/:id`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "Template successfully updated",
        },
        data: {
          active: true,
          _id: "64e5fb3e02ef258965301c04",
          user: "615ae60a3b0d9011ce1aecc8",
          name: "Timplenta 1",
          description: "Template's Description",
          category: "64a2880fd2e3ff52ee53994e",
          app: "64e5fb3c02ef258965301bf3",
          slug: "timplenta-1",
          __v: 0,
          id: "64e5fb3e02ef258965301c04",
        },
      })
    );
  }
);

export const deleteTemplate = rest.delete(
  `${process.env.REACT_APP_ENDPOINT}/templates/:id`,
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

export const appFromTemplate = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/apps/from-template`,
  (req, res, ctx) => {
    const { id } = req.params;

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
          hasWebhookTrigger: true,
          hidden: false,
          active: true,
          deleted: false,
          _id: "654661b584d264bd18656abd",
          user: "615ae60a3b0d9011ce1aecc8",
          account: "615ae60a3b0d9011ce1aecc9",
          name: "Timplenta 1",
          description: "dsdv dfv",
          category: "64a2880fd2e3ff52ee53994e",
          slug: "apex-copy-app",
          createdAt: "2023-11-04T15:22:29.340Z",
          updatedAt: "2023-11-04T15:22:29.340Z",
          __v: 0,
          id: "654661b584d264bd18656abd",
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
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.5,
                borderStyle: "solid",
                borderWidth: 0,
                borderRadius: 0,
                borderColor: "#091540",
                backgroundColor: "#091540",
              },
            },
            active: true,
            _id: "654661b684d264bd18656ac7",
            user: "615ae60a3b0d9011ce1aecc8",
            account: "615ae60a3b0d9011ce1aecc9",
            app: "654661b584d264bd18656abd",
            name: "Screen 1",
            placeholders: [],
            slug: "screen-1-222",
            __v: 0,
            id: "654661b684d264bd18656ac7",
          },
          workflow: {
            tasks: [
              {
                id: "18a1bac1-4167-44f3-a1b4-d1fc49f1e132",
                type: "StartTask",
                data: {
                  label: "input node",
                },
                position: {
                  x: 400,
                  y: 200,
                },
                variables: [
                  {
                    name: "Initiator (designation)",
                    nodeType: "StartTask",
                    dataType: ["designation"],
                    group: "Initiator",
                    matching: {
                      valueSourceType: "user",
                      valueSourceInput: "designation",
                      valueSourceId: "cf2da202-99b1-42a7-af00-e469c9c81f28",
                    },
                    id: "cf2da202-99b1-42a7-af00-e469c9c81f28",
                  },
                ],
              },
              {
                id: "f62d3b14-f770-4fa0-8ada-debe59c05f4c",
                type: "EndTask",
                data: {
                  label: "output node",
                },
                position: {
                  x: 400,
                  y: 520,
                },
                variables: [],
              },
              {
                id: "296073f4-c092-42b1-913b-7cb98d4c6178",
                type: "ScreenTask",
                position: {
                  x: 305,
                  y: 281,
                },
                data: {
                  label: "[Not configured]",
                },
                variables: [],
                name: "dasd",
                screenType: "app",
                configured: true,
              },
              {
                source: "18a1bac1-4167-44f3-a1b4-d1fc49f1e132",
                sourceHandle: null,
                target: "296073f4-c092-42b1-913b-7cb98d4c6178",
                targetHandle: null,
                id: "reactflow__edge-18a1bac1-4167-44f3-a1b4-d1fc49f1e1320",
                animated: true,
                style: {
                  strokeWidth: 2,
                  stroke: "#7d868b",
                },
              },
            ],
            active: false,
            _id: "654661b784d264bd18656adb",
            user: "615ae60a3b0d9011ce1aecc8",
            account: "615ae60a3b0d9011ce1aecc9",
            app: "654661b584d264bd18656abd",
            name: "Index",
            __v: 0,
            id: "654661b784d264bd18656adb",
          },
        },
      })
    );
  }
);

export const createNewTemplate = rest.post(
  `${process.env.REACT_APP_ENDPOINT}/templates`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          message: "Template successfully updated",
        },
        data: {
          active: true,
          _id: "64e5fb3e02ef258965301c04",
          user: "615ae60a3b0d9011ce1aecc8",
          name: "Timplenta 1",
          description: "Template's Description",
          category: "64a2880fd2e3ff52ee53994e",
          app: "64e5fb3c02ef258965301bf3",
          slug: "timplenta-1",
          __v: 0,
          id: "64e5fb3e02ef258965301c04",
        },
      })
    );
  }
);
