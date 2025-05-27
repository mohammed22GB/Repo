import { CustomAxios } from "../../../../common/utils/CustomAxios";

export const getAuditLogsAPI = async (data, searchParam = null) => {
  if (searchParam) {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/auditLogs?search=${searchParam}`
    );

    return result.data;
  }

  const per_page = data?.queryKey?.[1] || 10;
  const pageNo = data?.queryKey?.[2] || 0;

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/auditLogs?page=${pageNo}&per_page=${per_page}`
  );

  return result.data;
};
