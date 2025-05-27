import { useState, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { parse } from "papaparse";
import { ArrowUpwardTwoTone, Close, Description } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";

import { convertToBytes } from "./utils/helperFunctions";
import { FILE_UPLOAD_LIMIT } from "../../utils/constants";
import { errorToastify } from "../../utils/Toastify";
import { SET_FILE_DATA } from "../../../../store/actions/uploadFileAction";
import { CustomAxios } from "../../utils/CustomAxios";

const useStyles = makeStyles((theme) => ({
  draggableWrapper: {
    width: "100%",
    // height: "35vh",
    justifyContent: "center",
  },
  draggableWrapperCard: {
    width: "397.46px",
    minHeight: "199.92px",
    borderRadius: 10,
    border: "3px dashed #010A43",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    margin: "50px 0",
  },
  iconWrapper: {
    width: "76.49px",
    height: "76.4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem",
    border: "4px solid black",
    borderRadius: "50%",
  },
  icon: {
    backgroundColor: " #00A8CC",
    width: "61.19px",
    height: "61.12px",
    fontSize: "3rem",
  },

  textWrapper: {
    // width: "127px",
    // width: "210px",
    height: "max-content",
    textAlign: "center",
  },
  text: {
    fontStyle: "normal",
    fontWeight: 300,
    width: "100%",
    // fontSize: "7.32392px",
    fontSize: 12,
    lineHeight: "130%",
    textAlign: "center",
  },

  browseFile: {
    color: "#0d99ff",
    cursor: "pointer",
  },
  input: {
    display: "none",
  },

  caption: {
    fontStyle: "normal",
    fontWeight: 300,
    // fontSize: "7.32392px",
    fontSize: 12,
    lineHeight: "200%",
    textAlign: "center",
    //color: "#999999",
    color: "red",
  },

  progressBar: {
    width: "100%",
    opacity: 0.5,
    borderRadius: "4.74866px",
    backgroundColor: "#010A43",
  },
}));

const FileUpload = (props) => {
  /* A hook that is used to create a state in a functional component. */
  const classes = useStyles();
  const fileUploadRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [hasDrag, sethasDrag] = useState(false);
  const [uploadKey, setUploadKey] = useState(v4());
  const { clearUploadData, emptyUpload, fileConstraints } = props;

  const uploadFileLimits = fileConstraints || FILE_UPLOAD_LIMIT;

  const { maxSize, maxSizeUnit, fileTypes } = uploadFileLimits;

  /* A hook that is used to dispatch an action to the redux store. */
  const dispatch = useDispatch();
  const mimeTypes = fileTypes.map((fileType) => fileType.mimeType).join(", ");
  const acceptedFiles = fileTypes.map((fileType) => fileType.name).join(", ");
  /**
   * I'm trying to upload a file to a server, and I want to show the progress of the upload.
   */

  const handleUploadFile = async (e) => {
    let files = e.target.files;

    if (files.length > 0) {
      const allowedFileSizeInBytes = convertToBytes(maxSize, maxSizeUnit);

      const selectedFile = files[0];

      if (selectedFile.size > allowedFileSizeInBytes) {
        errorToastify(
          `File size exceeds the maximum limit ${maxSize}${maxSizeUnit}.`
        );
        //e.target.value = "";
        return;
      }

      Array.from(files)
        .filter(({ type }) =>
          fileTypes.find((fType) => fType.mimeType === type)
        )
        .forEach(async (file) => {
          /* Creating a new FormData object. */
          const data = new FormData();
          /* Appending the file to the data object. */
          data.append("file", file);
          /* Reading the file as text. */
          const text = await file.text();
          /* Parsing the text of the file. */
          const parsedText = parse(text, { header: true });
          //console.log(`1____parsedText: ${JSON.stringify(parsedText.data)}`);
          /* Dispatching an action to the redux store. */
          dispatch({ type: SET_FILE_DATA, payload: parsedText?.data });
          /* A function that is called when the upload is in progress. */
          const options = {
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const progress_ = Math.floor((loaded * 100) / total);
              setProgress((prev) => prev + progress_);
              setBuffer(() => progress + progress_ + 10);
            },
          };

          let url =
            "https://run.mocky.io/v3/c91d3ef4-9f1b-44f1-b67d-2eaeb5231c48";

          try {
            const results = await CustomAxios().post(url, data, options);
          } catch (err) {
            //console.log(err);
          }
        });
    }
  };

  /**
   * I'm trying to upload a file to a server, and I want to show the progress of the upload.
   */
  const handleOnDrop = async (e) => {
    e.preventDefault();
    let files = e.dataTransfer.files;

    if (files.length > 0) {
      const allowedFileSizeInBytes = convertToBytes(maxSize, maxSizeUnit);

      const selectedFile = files[0];

      if (selectedFile.size > allowedFileSizeInBytes) {
        errorToastify(
          `File size exceeds the maximum limit ${maxSize}${maxSizeUnit}.`
        );
        //e.target.value = "";
        return;
      }

      Array.from(files)
        .filter(({ type }) =>
          fileTypes.find((fType) => fType.mimeType === type)
        )
        .forEach(async (file) => {
          /* Creating a new FormData object. */
          const data = new FormData();
          /* Appending the file to the data object. */
          data.append("file", file);
          const text = await file.text();
          const parsedText = parse(text, { header: true });
          dispatch({ type: SET_FILE_DATA, payload: parsedText?.data });
          const options = {
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const progress_ = Math.floor((loaded * 100) / total);
              setProgress((prev) => prev + progress_);
              setBuffer(() => progress + progress_ + 10);
            },
          };

          let url =
            "https://run.mocky.io/v3/c91d3ef4-9f1b-44f1-b67d-2eaeb5231c48";

          await CustomAxios().post(url, data, options);
        });
    }
  };

  return (
    <Grid container className={classes.draggableWrapper}>
      <div
        style={{ backgroundColor: hasDrag && "#ecf5f7" }}
        className={classes.draggableWrapperCard}
        onDrop={(e) => handleOnDrop(e)}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => sethasDrag(() => true)}
        onDragLeave={(e) => sethasDrag(() => false)}
      >
        <Grid item className={classes.iconWrapper}>
          <IconButton
            className={classes.icon}
            onClick={() => fileUploadRef.current.click()}
          >
            <ArrowUpwardTwoTone color="primary" style={{ fontSize: 50 }} />
          </IconButton>
        </Grid>
        <Grid container className={classes.textWrapper}>
          <span className={classes.text}>
            Drag and Drop or{" "}
            <label htmlFor="file" className={classes.browseFile}>
              browse
            </label>{" "}
            file to upload
          </span>
          <TextField
            key={uploadKey}
            variant="outlined"
            name="input"
            type={"file"}
            inputRef={fileUploadRef}
            id="file"
            className={classes.input}
            inputProps={{
              hidden: true,
              accept: mimeTypes,
              onChange: (e) => {
                handleUploadFile(e);
              },
            }}
          />
        </Grid>

        <Grid item>
          <Typography className={classes.caption}>
            {`Note: Only ${acceptedFiles} file size of ${maxSize}${maxSizeUnit} maximum can be uploaded`}
          </Typography>
          <Typography className={classes.caption}>
            {`Kindly ensure there are no duplicate details in the rows of your csv file`}
          </Typography>
        </Grid>
        {progress > 0 && !emptyUpload && (
          <Grid
            container
            className={classes.progressContainer}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <IconButton size="small">
              <Description />
            </IconButton>

            <Box
              sx={{
                width: "178.7px",
              }}
            >
              <LinearProgress
                variant="buffer"
                value={progress}
                valueBuffer={buffer}
                className={classes.progressBar}
              />
            </Box>

            <IconButton
              onClick={() => {
                clearUploadData();
                setUploadKey(v4());
              }}
              style={{ width: "5.7px", height: "5.7px" }}
            >
              <Close />
            </IconButton>
          </Grid>
        )}
      </div>
    </Grid>
  );
};

export default FileUpload;
