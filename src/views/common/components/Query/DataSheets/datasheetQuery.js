import { CustomAxios } from "../../../utils/CustomAxios";

export const fetchDatasheets = async (data) => {
  const pageNo = data?.queryKey[1];
  const perPage = data?.queryKey[2];
  //console.log(pageNo, perPage);
  return await CustomAxios()
    .get(
      `${process.env.REACT_APP_ENDPOINT}/datasheets?selection=active+createdAt+id+name+updatedAt+user&page=${pageNo}&per_page=${perPage}`
    )
    .then((res) => res.data);
};

export const getDatasheetById = ({ queryKey: [key, { id }] }) =>
  CustomAxios()
    .get(`${process.env.REACT_APP_ENDPOINT}/datasheets/${id}`)
    .then((res) => res.data);

export const updateDatasheetsApi = async (data) => {
  //console.log(data);
  const { name, id } = data;

  return await CustomAxios()
    .put(`${process.env.REACT_APP_ENDPOINT}/datasheets/${id}`, {
      name,
    })
    .then((res) => res.data);
};

// PERMISSIONS

export const updateResourcePermissions = async (data) => {
  //console.log(data);

  let { permsType, grantedList, resourceId, resourceType } = data;
  resourceType = resourceType ?? "datasheet";

  return await CustomAxios()
    .put(
      `${process.env.REACT_APP_ENDPOINT}/permissions?resource=${resourceType}&resourceId=${resourceId}&access=${permsType}&level=resource`,
      { grantedList }
    )
    .then((res) => res.data);
};

//GetPermissionsByResource
export const getResourcePermissions = async ({
  queryKey: [key, { resourceId, resourceType, access }],
}) => {
  resourceType = resourceType ?? "datasheet";
  access = access ? `&access=${access}` : "";
  //console.log(datasheetId);
  return await CustomAxios()
    .get(
      `${process.env.REACT_APP_ENDPOINT}/permissions?resource=${resourceType}&resourceId=${resourceId}${access}`
    )
    .then((res) => res.data);
};

//RemovePermissionsByResource
export const removeResourcePermissions = async (data) => {
  //console.log(data);
  let { permsType, value, resourceId, resourceType } = data;
  resourceType = resourceType ?? "datasheet";
  return await CustomAxios()
    .delete(
      `${process.env.REACT_APP_ENDPOINT}/permissions?resource=${resourceType}&resourceId=${resourceId}&access=${permsType}&value=${value}`
    )
    .then((res) => res.data);
};

//RemovePermissionsByResource
export const groupResourcePermissions = async (data) => {
  let {
    permsType,
    action,
    resourceId,
    grantedList,
    resourceType,
    isAllEmployees,
  } = data;
  resourceType = resourceType ?? "datasheet";
  //console.log(permsType);
  return await CustomAxios()
    .put(
      `${process.env.REACT_APP_ENDPOINT}/permissions/toggle-employees?resource=${resourceType}&resourceId=${resourceId}&access=${permsType}&level=resource`,
      { isAllEmployees, grantedList, permissionAccess: permsType }
    )
    .then((res) => res.data);
};
