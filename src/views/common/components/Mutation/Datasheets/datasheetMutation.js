import { CustomAxios } from "../../../utils/CustomAxios";

export const createNewDataSheet = async (data) =>
  await CustomAxios()
    .post(`${process.env.REACT_APP_ENDPOINT}/datasheets`, data)
    .then((res) => res.data);

export const deleteDataSheet = async ({ id }) =>
  await CustomAxios()
    .delete(`${process.env.REACT_APP_ENDPOINT}/datasheets/${id}`)
    .then((res) => res.data);

export const updateDatasheet = async ({ columns, id }) =>
  await CustomAxios()
    .put(`${process.env.REACT_APP_ENDPOINT}/datasheets/${id}`, { columns })
    .then((res) => res.data);

export const duplicateDataSheet = async ({ datasheet }) =>
  await CustomAxios()
    .post(`${process.env.REACT_APP_ENDPOINT}/datasheets/duplicate`, {
      datasheet,
    })
    .then((res) => res.data);

export const UpdateSheetData = async ({ data, id }) =>
  await CustomAxios()
    .put(`${process.env.REACT_APP_ENDPOINT}/datasheets/${id}`, { data })
    .then((res) => res.data);

export const delDataSheetColumn = async ({ datasheetId, columnId }) =>
  await CustomAxios()
    .delete(
      `${process.env.REACT_APP_ENDPOINT}/datasheets/${datasheetId}/columns`,
      { data: { columnId } }
    )
    .then((res) => res.data);

export const updateColumnData = async ({ newColumn, datasheetId }) =>
  //datasheets.id = null;
  await CustomAxios()
    .put(
      `${process.env.REACT_APP_ENDPOINT}/datasheets/${datasheetId}/columns`,
      newColumn
    )
    .then((res) => res.data);

export const UpdateRowData = async (data) => {
  const { rowValues, datasheetId } = data;
  return await CustomAxios()
    .put(
      `${process.env.REACT_APP_ENDPOINT}/datasheets/${datasheetId}/rows`,
      rowValues
    )
    .then((res) => res.data);
};

export const delDataSheetRow = async ({ rowIds, datasheetId }) =>
  await CustomAxios()
    .delete(
      `${process.env.REACT_APP_ENDPOINT}/datasheets/${datasheetId}/rows`,
      { data: { rowIds } }
    )
    .then((res) => res.data);

export const updateRowDataByUpload = async (data) => {
  const { newUserCsvData, dataSheetId } = data;
  return await CustomAxios()
    .post(
      `${process.env.REACT_APP_ENDPOINT}/datasheets/${dataSheetId}/import`,
      { datasheet: newUserCsvData }
    )
    .then((res) => res.data);
};
