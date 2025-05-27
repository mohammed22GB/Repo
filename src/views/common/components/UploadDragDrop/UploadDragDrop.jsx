import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  withStyles,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CancelIcon from "@material-ui/icons/Cancel";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VerifyUploadView from "./CompleteUploadView";
import DatasheetUploadPair from "./DatasheetUploadPair";
import { useStyles } from "./dragDropStyle";
import FileUpload from "./FileUpload";
import UploadedSuccessLayout from "./UploadedSuccessLayout";
import useCustomMutation from "../../utils/CustomMutation";
import { uploadUserCsvFile } from "../Mutation/fileUpload/fileUpload";
import { updateRowDataByUpload } from "../Mutation/Datasheets/datasheetMutation";
import {
  errorToastify,
  infoToastify,
  successToastify,
} from "../../utils/Toastify";
import { SET_FILE_DATA } from "../../../../store/actions/uploadFileAction";
import CircularIndeterminate from "../ProgressLoader/ProgressLoader";
import { BsCircleFill } from "react-icons/bs";
import { CDN_URL } from "../../utils/constants";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: 16,
  },
  iconStyle: {
    fontSize: 50,
    color: "#0C7B93",
    borderRadius: "50px",
  },
  closeButton: {
    position: "absolute",
    right: 4,
    top: 4,
    color: "#E7E9EE",
  },
  helperText: {
    margin: "5px 0 0 0",
    fontFamily: "GT Eesti Pro Test",
  },
});

const UploadDragDrop = (props) => {
  const {
    handleCloseDialog = () => {},
    setOpenUploadDragDrop,
    openUploadDragDrop = false,
    headerNameObj = false,
    dataSheetId,
    dataSheet,
    addColValues,
    columnHeaders,
    closeModal,
    updateKey,
    fileConstraints,
  } = props;
  const steps = 2;
  const classes = useStyles(makeStyles);
  const [isFileUploadSuccess, setIsFileUploadSuccess] = useState(false);
  const [isVerified, setIsVerifed] = useState(true);
  const [successText, setSuccessText] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const queryClient = useQueryClient();

  /* A react hook that is used to dispatch an action to the redux store. */
  const dispatch = useDispatch();

  /* A react hook that is used to store data that is not going to change. */
  const matchedData = useRef({});
  const fieldValue = useRef([]);
  const updatedFileData = useRef([]);

  const {
    upLoadFileReducer: { fileData },
  } = useSelector((state) => state);

  /**
   * SubmitUploadSuccess is a function that takes an object with a data property as an argument.
   *
   * The function then sets the state of isFileUploadSuccess to true and the state of tabs to an empty
   * string.
   *
   * The function then sets the state of successText to the value of the message property of the _meta
   * object.
   */
  const submitUploadSuccess = ({ data }) => {
    setLoading(false);
    setIsFileUploadSuccess(() => true);
    const { _meta } = data;
    setSuccessText(() => _meta?.message);
    successToastify(_meta?.message);
    queryClient.invalidateQueries([updateKey]);
    uploadDone();
  };
  const submitUploadError = ({ error }) => {
    setLoading(false);
    errorToastify(
      error.response?.data?._meta?.error?.message ||
        "An error occurred while uploading"
    );
    uploadDone();
  };

  /* A custom hook that is used to make a mutation request to the server. */
  const { mutate: fileUploadMutate } = useCustomMutation({
    apiFunc: uploadUserCsvFile,
    onSuccess: submitUploadSuccess,
    onError: submitUploadError,
    retries: 0,
    overrideNotification: true,
  });

  const datasheetUploadSuccess = ({ data }) => {
    setLoading(false);
    setIsFileUploadSuccess(() => true);
    setSuccessText(() => "Successful Upload");
    queryClient.invalidateQueries([updateKey]);
  };
  /* Make a mutation request to the dataSheet endpoint. */
  const { mutate: uploadDataSheetCSV } = useCustomMutation({
    apiFunc: updateRowDataByUpload,
    onSuccess: datasheetUploadSuccess,
    retries: 0,
  });

  /**
   * If the fileData.length is less than 1, then return a toastify message.
   * @returns The return statement specifies the value that is returned to the function caller.
   */
  /* const handleChange = (event, newValue) => {
    if (updatedFileData.current.length < 1)
      return infoToastify("You are yet to upload a csv file");
    setTabs(() => newValue);
  }; */
  const sendUpload = (e) => {
    /* Setting the state of `isFileUploadSuccess` to false. */
    setIsFileUploadSuccess(() => false);

    setLoading(true);
    /* Checking if the `updatedFileData` array is greater than 0 and if it is, then it is checking if the
`updatedFileData` array has an empty field. */

    // let checkDuplicate =
    //   updatedFileData.current.length > 0 &&
    //   updatedFileData.current.filter(
    //     (val, idx, arr) =>
    //       arr.findIndex(
    //         (val2) =>
    //           Object.values(val2)[0] === Object.values(val)[0] &&
    //           Object.values(val2)[Object.values(val).length - 1] ===
    //             Object.values(val)[[Object.values(val2).length - 1]]
    //       ) === idx && Object.keys(val).length > 2
    //     //  exclude rows that are not probably matched
    //   );

    /* Assigning the value of the `REACT_APP_BASE_URL` environment variable to the `redirectUrl` variable. */
    const redirectUrl = `${process.env.REACT_APP_BASE_URL}/create-password`;

    /* Checking if the `fieldValue` array is greater than 0 and if it is, then it is checking if the
      `fieldValue` array has an empty field. */

    let findEmptyField =
      fieldValue.current.length > 0 &&
      fieldValue.current.map((inputs) => {
        return Object.values(inputs)[0];
      });

    /* The `if` statement is checking if the `findEmptyField` variable is not equal to `true` and if it is
not, then it is returning a toastify message. */
    if (!findEmptyField)
      return infoToastify("Required field! Fill all required fields- empty");

    let newUserCsvData = updatedFileData?.current?.map((val) => {
      /* Creating an empty object. */
      let cloneUserCsvData = {};

      /* Checking if the `matchedData.current` object has the keys `firstName`, `lastName`,
          `email`, `phone` and if it does not have any of the keys, then it is returning a toastify
          message. */
      for (let plugHeadersKey in matchedData.current) {
        if (val[matchedData.current[plugHeadersKey]]) {
          /* Deleting the key from the object. and replacing it with  the plugHeadersKey and assigning the value of the user csv key values */
          delete Object.assign(cloneUserCsvData, {
            [plugHeadersKey]: val[matchedData.current[plugHeadersKey]],
          })[val[matchedData.current[plugHeadersKey]]];
        }
      }

      if (!headerNameObj && Object.keys(cloneUserCsvData).length) {
        /* Assigning the value of `Employee` to the `roles` key. */
        cloneUserCsvData.roles = ["Employee"];
      }

      /* Returning the value of `cloneUserCsvData` to the function caller. */
      return cloneUserCsvData;
    });

    newUserCsvData = newUserCsvData.filter((obj) => Object.keys(obj)?.length);

    /* Making a mutation request to the server. */
    if (headerNameObj) {
      if (dataSheet) {
        uploadDataSheetCSV({ newUserCsvData, dataSheetId });
      } else {
        addColValues(newUserCsvData);
        uploadDone();
      }
    } else {
      fileUploadMutate({ users: newUserCsvData, redirectUrl });
    }
  };

  /**
   * When the user clicks the 'Upload' button, the file upload dialog is closed, the tab is set to
   * 'Upload', the file data is cleared, and the file upload success state is set to false.
   */
  const uploadDone = () => {
    clearUploadData();
    setOpenUploadDragDrop(false);
    // dispatch({ type: SET_FILE_DATA, payload: [] });
  };

  const clearUploadData = () => {
    // setTabs(() => "Upload");
    setIsFileUploadSuccess(() => false);
    dispatch({ type: SET_FILE_DATA, payload: [] });
    //setIsFileUploadSuccess(() => false);
  };

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;

    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography style={{ fontWeight: "bold" }}>{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CancelIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const handleClick = (e) => {
    if (step === 2) {
      if (!matchedData?.current?.email && !headerNameObj) {
        errorToastify("Incomplete matching of mandatory fields");
        return;
      }
      if (
        !Object.keys(matchedData?.current)?.includes("employeeId") &&
        Object.keys(matchedData?.current)?.includes("lineManager")
      ) {
        errorToastify("Users with line manager must have an employee ID");
        return;
      }
      sendUpload(e);
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
    if (step > steps) {
      uploadDone();
      //setStep(step + 1);
    }
  };

  const getText = () => {
    return step === 1 ? "Next" : !isFileUploadSuccess ? "Submit" : "Close";
  };

  const emptyUpload = step === 1 && fileData.length < 1;

  const getDisabled = () => {
    return emptyUpload || (step === 2 && isVerified === true);
  };

  const getUserTemplate = () => {};

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      onClose={() => {
        handleCloseDialog();
        setOpenUploadDragDrop(true);
      }}
      aria-labelledby="customized-dialog-title"
      open={openUploadDragDrop}
    >
      <DialogTitle id="customized-dialog-title" onClose={uploadDone}>
        <Typography
          variant="h5"
          component="span"
          className={classes.subtitle}
          style={{ fontSize: 14, lineHeight: "17px" }}
          gutterBottom
        >
          File Upload
        </Typography>
      </DialogTitle>
      <DialogContent className="bulk-user-upload-dialog-main" dividers>
        <div>
          {!isFileUploadSuccess && (
            <Grid className={classes.tabs}>
              <Box sx={{ width: "100%" }} className={classes.tabsWrapper}>
                <Tabs
                  value={step}
                  // onChange={handleChange}
                  aria-label="Apps tab wrapper"
                  className={classes.tabsBorder}
                >
                  <Tab
                    xs={{ width: "20px" }}
                    value={1}
                    label="Upload"
                    className={classes.tabBtn}
                  />
                  <Tab
                    value={2}
                    label="Verify"
                    style={{ textTransform: "capitalize" }}
                    className={classes.tabBtn}
                  />
                </Tabs>
              </Box>
            </Grid>
          )}
          {step === 1 && (
            <FileUpload
              clearUploadData={clearUploadData}
              emptyUpload={emptyUpload}
              fileConstraints={fileConstraints}
            />
          )}
          {step === 2 && !headerNameObj && (
            <VerifyUploadView
              matchedData={matchedData}
              fieldValue={fieldValue}
              updatedFileData={updatedFileData}
              setIsVerifed={setIsVerifed}
            />
          )}
          {step === 2 && headerNameObj && (
            <DatasheetUploadPair
              matchedData={matchedData}
              fieldValue={fieldValue}
              updatedFileData={updatedFileData}
              setIsVerifed={setIsVerifed}
              columnHeaders={columnHeaders}
            />
          )}
          {isFileUploadSuccess && (
            <UploadedSuccessLayout
              uploadDone={uploadDone}
              successText={successText}
            />
          )}
        </div>
        {loading ? <CircularIndeterminate /> : null}
        <div className={classes.downloadLinkBox}>
          <BsCircleFill style={{ fontSize: 6 }} />
          <a
            className={classes.downloadLink}
            href={`${CDN_URL}files/bulk_user_upload_template.csv`}
            download
          >
            Click here to download Users template (CSV)
          </a>
        </div>
      </DialogContent>
      <DialogActions>
        {!isFileUploadSuccess && (
          <Button
            variant="outlined"
            style={{
              border: "1px solid #010A43",
              textTransform: "capitalize",
              borderRadius: 3,
              padding: "3px 30px",
              fontSize: 12,
            }}
            // onClick={() => setTabs(() => "upload")}
            onClick={uploadDone}
          >
            Cancel
          </Button>
        )}
        <Button
          disabled={getDisabled()}
          classes={{
            root: classes.nextButton,
            disabled: classes.disabled,
          }}
          onClick={handleClick}
          size="large"
          type="submit"
          variant="contained"
          style={{ fontSize: 12 }}
        >
          {getText()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDragDrop;
