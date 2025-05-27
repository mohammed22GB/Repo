import { Fragment, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import Slide from "@material-ui/core/Slide";
import { useQueryClient } from "react-query";
import { DialogTitle, DialogActions } from "@material-ui/core";

import { useStyles } from "../../../utils/DataMutationViewStyle";
import { SetAppStatus } from "../../../../common/helpers/helperFunctions";
import { successToastify } from "../../../../common/utils/Toastify";
import useCustomMutation from "../../../../common/utils/CustomMutation";
import { UpdateSheetData } from "../../../../common/components/Mutation/Datasheets/datasheetMutation";

const NewRowDialog = ({ sheetData, showMe, setShowMe, columns }) => {
  const classes = useStyles(makeStyles);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [fieldValue, setFieldValue] = useState({});

  // destructuring global state
  const { data, id, user } = sheetData;

  // declare mutation function
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // handle change function for all inserted input
  const handleChange = (id, event) => {
    // setting the input values to the state
    setFieldValue({
      ...fieldValue,
      [id]: event.target.value,
      created: `${user?.firstName} ${user?.lastName}`,
    });
  };

  const onSuccess = async (data) => {
    dispatch(SetAppStatus({ type: "success", msg: "Row added" }));
    // set the state to an empty object
    setFieldValue({});

    // disable the visibility of the input fields
    // dispatch({ type: SHOW_FIELD, payload: false });
    setShowMe(false);
    successToastify("Data row added successfully");

    await queryClient.invalidateQueries(["getOneDatasheet"]);
  };

  // add new datarow
  const { mutate: addNewdata } = useCustomMutation({
    apiFunc: UpdateSheetData,
    onSuccess,
    retries: 0,
  });

  // create new data
  const handleDataSubmision = async () => {
    let defaults = {};
    columns &&
      columns.forEach(({ id, name }) => {
        if (name === "created") {
          defaults[name] = `${userInfo?.firstName} ${userInfo?.lastName}`;
        } else if (name === "createdOn") {
          defaults[name] = new Date().toLocaleDateString();
        }
      });

    // appending random id to the added id property
    const addIdToTheFieldData = {
      ...fieldValue,
      id: uuidv4(),
      ...defaults,
    };
    // // make sure that fields are not empty
    // if (Object.keys(addIdToTheFieldData).length < columns.length)
    //   return console.log("Fill up the remaining field(s)");

    // update the data array with new item
    addNewdata({ data: [addIdToTheFieldData, ...(data ?? [])], id });
    // dataSheets.doc(id).update({ data: [...data, addIdToTheFieldData] });
  };

  // close  row dialog
  const handleClose = () => {
    // dispatch({ type: SHOW_FIELD, payload: false });
    setShowMe(false);
  };

  return (
    <Slide direction="left" in={showMe} mountOnEnter unmountOnExit>
      <div className={classes.sideDialogContainer}>
        <div className={classes.sideDialogTitleWrapper}>
          <DialogTitle
            id="form-dialog-title"
            style={{ fontSize: 14, fontWeight: "bold" }}
          >
            New Row
          </DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.sideDialogCloseButton}
            onClick={handleClose}
            size="small"
          >
            <CancelIcon style={{ fontSize: 18 }} />
          </IconButton>
        </div>
        <div className={classes.sideDialogMain}>
          {columns &&
            columns.length > 0 &&
            columns
              .filter(
                (col) => col.name !== "createdOn" && col.name !== "created"
              )
              .map((ppty, idx) => {
                return (
                  <Fragment key={idx}>
                    <Typography
                      className={classes.formLabels}
                      style={idx === 0 ? { paddingTop: 0 } : {}}
                      gutterBottom
                    >
                      {`${ppty.name}${!ppty.hasNull ? "*" : ""}`}
                    </Typography>
                    <TextField
                      className={classes.FormTextField}
                      size="small"
                      name="name"
                      inputMode="text"
                      onChange={(e) => handleChange(ppty.id, e)}
                      // error={hasError("name")}
                      fullWidth
                      // helperText={hasError("name") ? "Invalid Name" : null}
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                      defaultValue={ppty?.defaultValue}
                      required={!ppty.hasNull}
                      // value={formState.values.name || ""}
                      placeholder={`Enter ${ppty.name} here`}
                      type={ppty.dataType || "text"}
                      //disabled={!!ppty.default}
                      variant="outlined"
                      InputProps={{
                        className: classes.inputColor,
                      }}
                    />
                  </Fragment>
                );
              })}
        </div>
        <DialogActions className={classes.sideDialogActions}>
          <Button
            variant="outlined"
            color="primary"
            title="addRowBtn"
            className={classes.sideDialogActionButton}
            startIcon={<AddIcon />}
            onClick={() => handleDataSubmision()}
          >
            Insert Row
          </Button>
        </DialogActions>
      </div>
    </Slide>
  );
};

export default NewRowDialog;
