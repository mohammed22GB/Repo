import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useQueryClient } from "react-query";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Slide from "@material-ui/core/Slide";
import { DialogTitle, DialogActions, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@material-ui/icons/Add";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { useStyles } from "../../../utils/DataMutationViewStyle";
import { SetAppStatus } from "../../../../common/helpers/helperFunctions";
import {
  errorToastify,
  successToastify,
} from "../../../../common/utils/Toastify";
import useCustomMutation from "../../../../common/utils/CustomMutation";
import {
  updateColumnData,
  updateDatasheet,
} from "../../../../common/components/Mutation/Datasheets/datasheetMutation";

const ColumnDialog = (props) => {
  const {
    sheetData,
    showMe,
    setShowMe,
    columns,
    columnEditor,
    formState,
    setFormState,
    datasheetId,
  } = props;
  // assigning classess to use
  const classes = useStyles(makeStyles);
  const queryClient = useQueryClient();

  const [column, setColumn] = useState("");
  const [columnType, setColumnType] = useState("choose");

  const dispatch = useDispatch();

  // destructur global state variable from store
  const { id } = sheetData;

  const onSuccess = () => {
    // handleClose();
    dispatch(SetAppStatus({ type: "success", msg: "Column added" }));
    successToastify("Column added.");
    //setFormState({ order: columns.length });
    queryClient.invalidateQueries(["getOneDatasheet"]);
  };
  const onSuccessUpdate = () => {
    // handleClose();
    dispatch(SetAppStatus({ type: "success", msg: "Column updated" }));
    successToastify("Column updated.");
    queryClient.invalidateQueries(["getOneDatasheet"]);
  };

  // add new data column
  const { mutate: addNewColumn } = useCustomMutation({
    apiFunc: updateDatasheet,
    onSuccess,
    retries: 0,
  });
  const { mutate: updateColumn } = useCustomMutation({
    apiFunc: updateColumnData,
    onSuccess: onSuccessUpdate,
    retries: 0,
  });

  // defining dispatch action

  // close the dialog
  const handleClose = () => {
    // dispatch({ type: SHOW_COLUMNBOX, payload: false });
    setShowMe(false);
  };

  // setting column to the global column array
  const handleAddColumn = () => {
    // conditions to avoid empty form fields
    if (!(formState.name?.length > 1)) {
      dispatch(
        SetAppStatus({ type: "info", msg: "Kindly enter a valid column name" })
      );
      errorToastify(`Please fill up the necessary field(s)`);
      return console.log(`Fill up the remaining field(s)`);
    }
    if (!(formState.defaultValue?.length > 1) && formState.hasNull === false) {
      dispatch(SetAppStatus("info", "Kindly enter a default value"));
      return errorToastify(`Kindly enter a default value`);
    }
    const nameExists = columns.find((col) => col?.name == formState?.name);
    if (nameExists) {
      return errorToastify("Unable to create column with an existing name");
    }

    // append id to the created column
    const newColumn = {
      id: uuidv4(),
      name: formState.name,
      dataType: formState.dataType,
      isUnique: formState.isUnique,
      hasNull: formState.hasNull,
      defaultValue: formState.defaultValue,
      order: formState.order,
    };
    //console.log(newColumn);

    const newColumns = [...columns];
    if (newColumn.order !== newColumns.length) {
      newColumns.splice(newColumn.order, 0, newColumn);
      //console.log(newColumns);
    } else {
      newColumns.push(newColumn);
    }
    const updateColOrder = newColumns.map((col, index) => ({
      ...col,
      order: index,
    }));
    console.log(updateColOrder);
    // update the column collection with the new one
    addNewColumn({ columns: updateColOrder, id });
    //handleClose();
  };
  const handleUpdateColumn = () => {
    // append id to the created column
    const newColumn = {
      columnId: formState.id,
      ...formState,
    };
    delete newColumn.id;
    newColumn.order = newColumn.order > 0 ? newColumn.order : 0;
    //newColumn.order =newColumn.order > 0 ? `${Number(newColumn.order) - 1}` : "0";
    //console.log(newColumn);
    updateColumn({ newColumn, datasheetId });
    setShowMe(false);
  };

  const _setFormState = (val, field) => {
    const _formState = { ...formState };
    _formState[field] = val;
    setFormState(_formState);
  };

  useEffect(() => {
    _setFormState(columns.length, "order");
  }, [columns]);

  const clearForm = () => {
    const conf = window?.confirm(
      "This will reset all dialog entries. Proceed?"
    );
    conf && setFormState({});
  };

  return (
    // <ClickAwayListener onClickAway={handleClose}>
    <Slide direction="left" in={showMe} mountOnEnter unmountOnExit>
      <div className={classes.sideDialogContainer}>
        <div className={classes.sideDialogTitleWrapper}>
          <DialogTitle
            id="form-dialog-title"
            style={{
              fontSize: 14,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {columnEditor} Column
          </DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.sideDialogCloseButton}
            onClick={handleClose}
            size="small"
            title="closeBtn"
          >
            <CancelIcon style={{ fontSize: 18 }} />
          </IconButton>
        </div>

        <div className={classes.sideDialogMain}>
          <Typography
            className={classes.formLabels}
            style={{ paddingTop: 0 }}
            gutterBottom
          >
            Column name*
          </Typography>
          <TextField
            className={classes.FormTextField}
            size="small"
            name="name"
            onChange={(e) => _setFormState(e.target.value, "name")}
            fullWidth
            value={formState.name || ""}
            placeholder={`Enter name here`}
            type="text"
            inputMode="text"
            variant="outlined"
            InputProps={{
              className: classes.inputColor,
            }}
          />

          <Typography className={classes.formLabels} gutterBottom>
            Column data type*
          </Typography>
          <Select
            size="small"
            name="dataType"
            onChange={(e) => _setFormState(e.target.value, "dataType")}
            fullWidth
            value={formState.dataType || "text"}
            placeholder={`Enter name here`}
            variant="outlined"
            classes={{
              root: classes.selectPadding,
            }}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
          </Select>

          <Typography className={classes.formLabels} gutterBottom>
            Values uniqueness*
          </Typography>
          <Select
            // className={classes.FormTextField}
            size="small"
            name="isUnique"
            onChange={(e) => _setFormState(e.target.value, "isUnique")}
            // error={hasError("name")}
            fullWidth
            // helperText={hasError("name") ? "Invalid Name" : null}
            // FormHelperTextProps={{
            //   className: classes.helperText,
            // }}
            value={formState.isUnique || false}
            placeholder={`Enter name here`}
            type="text"
            variant="outlined"
            classes={{
              root: classes.selectPadding,
            }}
            // value={action}
            // onChange={setAction}
            // label="Bulk Actions"
          >
            <MenuItem value={true}>Unique values</MenuItem>
            <MenuItem value={false}>Values can be repeated</MenuItem>
          </Select>

          <Typography className={classes.formLabels} gutterBottom>
            Can column be left empty?*
          </Typography>
          <Select
            // className={classes.FormTextField}
            size="small"
            name="hasNull"
            onChange={(e) => _setFormState(e.target.value, "hasNull")}
            // error={hasError("name")}
            fullWidth
            // helperText={hasError("name") ? "Invalid Name" : null}
            // FormHelperTextProps={{
            //   className: classes.helperText,
            // }}
            defaultValue={formState.hasNull ?? true}
            placeholder={`Enter name here`}
            type="text"
            variant="outlined"
            classes={{
              root: classes.selectPadding,
            }}
            // value={action}
            // onChange={setAction}
            // label="Bulk Actions"
          >
            <MenuItem value={true}>Yes, it can be null</MenuItem>
            <MenuItem value={false}>No, it must be filled</MenuItem>
          </Select>

          <Typography
            className={classes.formLabels}
            gutterBottom
            id={"is-default-value-optional"}
          >
            Default value{formState.hasNull === false ? "*" : " (optional)"}
          </Typography>
          <TextField
            className={classes.FormTextField}
            size="small"
            name="defaultValue"
            onChange={(e) => _setFormState(e.target.value, "defaultValue")}
            fullWidth
            value={formState.defaultValue || ""}
            placeholder={`Enter default value for this column`}
            // dataType={formState.dataType || "text"}
            variant="outlined"
            InputProps={{
              className: classes.inputColor,
            }}
          />

          <Typography className={classes.formLabels} gutterBottom>
            Placement*
          </Typography>
          <Select
            // className={classes.FormTextField}
            size="small"
            name="order"
            onChange={(e) => _setFormState(e.target.value, "order")}
            // error={hasError("name")}
            fullWidth
            // helperText={hasError("name") ? "Invalid Name" : null}
            // FormHelperTextProps={{
            //   className: classes.helperText,
            // }}
            value={formState?.order}
            placeholder={`Enter name here`}
            type="text"
            variant="outlined"
            classes={{
              root: classes.selectPadding,
            }}
            // value={action}
            // onChange={setAction}
            // label="Bulk Actions"
          >
            {columns
              .filter((col) => col.name !== formState?.name)
              .map((c, i) => (
                <MenuItem key={i} value={i}>
                  Before {c.name}
                </MenuItem>
              ))}
            <MenuItem value={columns.length}>At the end</MenuItem>
          </Select>
        </div>
        <DialogActions className={classes.sideDialogActions}>
          {columnEditor === "new" && (
            <Button
              onClick={clearForm}
              // color="primary"
              // variant="outlined"
              className={classes.sideDialogActionButton}
              size="small"
              // startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          )}
          {columnEditor === "new" ? (
            <Button
              onClick={handleAddColumn}
              color="primary"
              variant={"outlined"}
              className={classes.sideDialogActionButton}
              size="small"
              title="addColumnBtn"
              startIcon={<AddIcon />}
            >
              Add Column
            </Button>
          ) : (
            <Button
              onClick={handleUpdateColumn}
              color="primary"
              variant={"contained"}
              className={classes.sideDialogActionButton}
              size="small"
              //startIcon={""}
            >
              Save Column
            </Button>
          )}
        </DialogActions>
      </div>
    </Slide>
    //
  );
};

export default withRouter(ColumnDialog);
