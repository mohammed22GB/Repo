import { rest } from "msw";

export const getNotifications = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/notifications`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 8,
            per_page: 2,
            current: 1,
            current_page: `${process.env.REACT_APP_ENDPOINT}/notifications?per_page=2&page=1`,
            total_unread: 8,
            next: 2,
            next_page: `${process.env.REACT_APP_ENDPOINT}/notifications?per_page=2&page=2`,
          },
        },
        data: [
          {
            read: false,
            // user: "615ae60a3b0d9011ce1aecc8",
            // account: "615ae60a3b0d9011ce1aecc9",
            title: "You have been assigned a <b>Test Task Scheduling</b> task.",
            description:
              "You have been assigned a second screen task on the Test Task Scheduling app.<br/>Please act on it as soon as possible",
            app: "655b549ee8b785c965cb7bf1",
            link: "https://devv.plugonline.io/run/descasio-inc/test-task-scheduling/screen-2-114?workflowInstanceId=6564f471cca3a2af64c1030c&taskId=655b57fee8b785c965cb7c9c&appId=655b549ee8b785c965cb7bf1",
            type: "WorkflowEmail",
            id: "6564f482cca3a2af64c10344",
          },
          {
            read: false,
            // user: "615ae60a3b0d9011ce1aecc8",
            // account: "615ae60a3b0d9011ce1aecc9",
            title: "You have been assigned a <b>Test Task Scheduling</b> task.",
            description:
              "You have been assigned a second screen task on the Test Task Scheduling app.<br/>Please act on it as soon as possible",
            app: "655b549ee8b785c965cb7bf1",
            link: "https://devv.plugonline.io/run/descasio-inc/test-task-scheduling/screen-2-114?workflowInstanceId=655cd76673f2783ac41ad2e8&taskId=655b57fee8b785c965cb7c9c&appId=655b549ee8b785c965cb7bf1",
            type: "WorkflowEmail",
            id: "655cd8b073f2783ac41ad329",
          },
        ],
      })
    );
  }
);
