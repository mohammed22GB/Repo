/**
 * @param {Plug.WorkflowInstance} data
 */
export const returnRecordLinkUrl = (data) => {
  if (data?.task?.name?.toLowerCase() === "approval") {
    return `/approval/${data?.app?.account?.slug}/${data?.app?.slug}?workflowInstanceId=${data?.taskStatus?.workflowInstance}&taskId=${data?.task?.id}&appId=${data?.app?.id}&isApproval=true`;
  } else {
    return `/run/${data?.app?.account?.slug}/${data?.app?.slug}/${data?.task?.properties?.screen?.slug}?workflowInstanceId=${data?.workflow}&taskId=${data?.task?.id}&appId=${data?.app?.id}`;
  }
};
