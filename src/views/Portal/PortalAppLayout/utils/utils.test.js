import { returnRecordLinkUrl } from "./utils";

describe("returnRecordLinkUrl", () => {
  it('should return approval URL if task name is "approval"', () => {
    const data = {
      task: { name: "approval", id: "taskId" },
      app: { account: { slug: "accountSlug" }, slug: "appSlug", id: "appId" },
      taskStatus: { workflowInstance: "workflowInstanceId" },
    };
    const result = returnRecordLinkUrl(data);
    expect(result).toBe(
      "/approval/accountSlug/appSlug?workflowInstanceId=workflowInstanceId&taskId=taskId&appId=appId&isApproval=true"
    );
  });

  it("should return run URL for other task names", () => {
    const data = {
      task: {
        name: "otherTask",
        id: "taskId",
        properties: { screen: { slug: "screenSlug" } },
      },
      app: { account: { slug: "accountSlug" }, slug: "appSlug", id: "appId" },
      workflow: "workflowInstanceId",
    };
    const result = returnRecordLinkUrl(data);
    expect(result).toBe(
      "/run/accountSlug/appSlug/screenSlug?workflowInstanceId=workflowInstanceId&taskId=taskId&appId=appId"
    );
  });
});
