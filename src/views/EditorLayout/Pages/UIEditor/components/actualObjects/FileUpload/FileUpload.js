import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { MdClose, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";

import Required from "../Required";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import { infoToastify } from "../../../../../../common/utils/Toastify";
import { deleteUpdatedFile } from "../../../../../../common/helpers/LiveData";
import PreviewDownloadModal from "../../../../../../Download/PreviewDownloadModal";
import { FILE_UPLOAD_SUCCESS } from "../../../../../../../store/actions/actionTypes";

const FILENAME_MAX_LENGTH = 60;

export default function FileUpload({
  style,
  values,
  onChange,
  readOnly,
  isAssetRoute = false,
  showSvgIcon = true,
  ...props
}) {
  const useStyles = makeStyles((theme) => style);
  const dispatch = useDispatch();
  const { filesUploaded, uploadingFile } = useSelector(
    ({ liveData: { filesUploaded, uploadingFile } }) => ({
      filesUploaded,
      uploadingFile,
    })
  );

  const [error, setError] = useState("");
  const [hereFilesUploaded, setHereFilesUploaded] = useState([]);
  const [hereUploadingFile, setHereUploadingFile] = useState(false);
  const [fieldKey, setFieldKey] = useState(v4());
  const [isDisabled, setIsDisabled] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const isPreviewMode =
    props?.appDesignMode === APP_DESIGN_MODES.PREVIEW ||
    props?.appDesignMode === APP_DESIGN_MODES.EDIT;

  useEffect(() => {
    if (isPreviewMode) {
      setHereFilesUploaded([]);
    }
  }, [values, props?.appDesignMode]);

  useEffect(() => {
    const isDisabled_ =
      props.disabled ||
      hereUploadingFile ||
      hereFilesUploaded.length >= +values.numOfFiles;

    setIsDisabled(isDisabled_);
  }, [
    props.appDesignMode,
    props.disabled,
    hereUploadingFile,
    hereFilesUploaded,
    values,
  ]);

  useEffect(() => {
    setFieldKey(v4());
  }, [isDisabled]);

  useEffect(() => {
    setHereFilesUploaded(() => filesUploaded?.[props.id] || []);
    setHereUploadingFile(() => uploadingFile?.[props.id]);
    const urls = filesUploaded?.[props.id]?.map((file) => file.url);

    if (urls) {
      onChange &&
        onChange(
          [...urls, ...(props.fromInputTable ? [] : props?.val || [])],
          props.id
        );
    }
  }, [filesUploaded, uploadingFile]);

  useEffect(() => {
    const urls = props.val;
    onChange && onChange(urls, props.id);
  }, [props.val]);

  const sanitizeFileName = (file) => {
    const fullName = file.name;
    const extention = fullName.substring(fullName.lastIndexOf("."));
    const fileName = fullName.substring(0, fullName.lastIndexOf("."));

    const adjustments = [];
    const cleansedFileName = fileName
      .toString()
      .trim()
      .replace(/[-.\s+]/g, "_") // Replace spaces and dots with -
      // .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/[^a-zA-Z0-9()_]+/g, "") // Remove all non-word chars
      .replace(/__+/g, "_") // Replace multiple - with single -
      .replace(/^_+/, "") // Trim - from start of text
      .replace(/_+$/, "");

    if (fileName !== cleansedFileName) {
      adjustments.push("special characters replaced");
    }

    const truncatedFileName = cleansedFileName.substring(
      0,
      FILENAME_MAX_LENGTH
    );

    if (cleansedFileName > truncatedFileName) {
      adjustments.push("truncated");
    }

    if (adjustments.length) {
      infoToastify(`File name ${adjustments.join(" and ")}`);
    }

    const sanitizedFile = new File([file], `${truncatedFileName}${extention}`, {
      type: file.type,
    });
    return sanitizedFile;
  };

  const onFileChange = (e) => {
    if (props.appDesignMode !== APP_DESIGN_MODES.LIVE) {
      return;
    }

    const bodyFormData = new FormData();
    const files = e.target.files;
    if (files.length > +values.numOfFiles) {
      setError(`You can only select  ${values.numOfFiles} file(s)`);
      return;
    }
    if (files.length + hereFilesUploaded.length > +values.numOfFiles) {
      setError(`You can only select  ${values.numOfFiles} file(s)`);
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if (files[i].size < parseInt(values.maxFileSize) * 1024 * 1024) {
        const sanitizedFile = sanitizeFileName(files[i]);
        bodyFormData.append("file", sanitizedFile);
      } else {
        setError(`${files[i].name} is greater than ${values.maxFileSize}MB `);
      }
    }

    dispatch(
      props.uploadFile(
        props.id,
        bodyFormData,
        (v) => {
          onChange(v, props.id);
        },
        isAssetRoute
      )
    );
  };

  const classes = useStyles();
  const fileTypes = {
    Image: "image/*",
    Videp: "video/*",
    Audio: "audio/*",
    any: "",
    PDF: "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf",
    Zip: "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed",
  };

  return (
    <div style={{ width: style?.button?.width }}>
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
          <Required required={values?.required && !isDisabled} />
        </Typography>
      )}
      <Button
        disabled={isDisabled || readOnly}
        readOnly={readOnly}
        variant={style?.button?.variant}
        inputProps={{ style: { ...style?.button } }}
        className={`${classes?.button} ${readOnly ? "read-only" : ""}`}
        classes={{
          root: classes?.button,
          label: classes?.button,
          disabled: classes?.button,
        }}
        style={{ borderStyle: "solid", padding: 0 }}
        // required={values?.required && !isDisabled}
        component="label"
        startIcon={
          !props.isDocument ? (
            hereUploadingFile ? (
              <ImSpinner9 className="icon-spin" />
            ) : (
              showSvgIcon && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={style?.button?.color || "#00000042"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                    stroke={style?.button?.color || "#00000042"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 8L12 3L7 8"
                    stroke={style?.button?.color || "#00000042"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 3V15"
                    stroke={style?.button?.color || "#00000042"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )
            )
          ) : null
        }
      >
        <input
          key={fieldKey}
          onChange={onFileChange}
          type="file"
          style={{ position: "absolute", zIndex: -1 }}
          className={`${classes?.button}`}
          inputProps={{ style: { ...style?.button } }}
          accept={values?.fileType || ""}
          multiple={values?.selectionCount}
          // required={values?.required && !isDisabled}
          disabled={isDisabled || readOnly}
          readOnly={readOnly}
        />
        {values?.buttonText}
      </Button>
      {error && (
        <div style={{ width: style?.dimensions?.width, color: "red" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "red",
              paddingTop: 5,
            }}
          >
            <Typography style={{ color: "red" }} className={classes?.label}>
              {error}
            </Typography>
            <MdClose
              style={{ cursor: "pointer" }}
              onClick={() => setError("")}
            />
          </div>
        </div>
      )}
      <div style={{ width: style?.dimensions?.width }}>
        {previewFile && (
          <PreviewDownloadModal
            openModal={previewFile}
            closeModal={setPreviewFile}
            pageUrl={props?.val}
          />
        )}
        {[
          ...hereFilesUploaded,
          ...(props.fromInputTable && hereFilesUploaded.length
            ? []
            : props?.val || []),
        ].map((file, index) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "red",
              paddingTop: 5,
            }}
            key={index}
          >
            {file.name ? (
              <Typography
                style={{
                  color: "green",
                  fontSize: 10,
                  paddingRight: 5,
                  wordBreak: "break-all",
                }}
                className={classes?.label}
              >
                {file.name}
              </Typography>
            ) : (
              <a href={file} target="_blank" rel="noreferrer">
                <Typography
                  style={{
                    color: "green",
                    fontSize: 10,
                    paddingRight: 5,
                    wordBreak: "break-all",
                  }}
                  className={classes?.label}
                >
                  Download file
                </Typography>
              </a>
            )}
            {file.name ? (
              <MdDelete
                style={{ cursor: "pointer", minWidth: 12 }}
                onClick={() => dispatch(deleteUpdatedFile(file._id, props.id))}
              />
            ) : (
              <>
                <Typography
                  onClick={() => {
                    setPreviewFile(file);
                  }}
                  style={{
                    color: "green",
                    fontSize: 10,
                    paddingRight: 5,
                    wordBreak: "break-all",
                    cursor: "pointer",
                  }}
                  className={classes?.label}
                >
                  View file
                </Typography>

                {previewFile === file && (
                  <PreviewDownloadModal
                    openModal={!!previewFile}
                    closeModal={setPreviewFile}
                    pageUrl={file}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
