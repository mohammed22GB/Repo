import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, makeStyles, Typography } from "@material-ui/core";
import { MdClose, MdDelete } from "react-icons/md";
import Required from "../Required";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import { deleteUpdatedFile } from "../../../../../../common/helpers/LiveData";

const Signature = ({
  style,
  values,
  setShowSignatureModal,
  setSignatureComponentID,
  onChange,
  readOnly,
  ...props
}) => {
  const signatureStyles = makeStyles((theme) => style);
  const classes = signatureStyles();
  const [hereFilesUploaded, setHereFilesUploaded] = useState([]);
  const [hereUploadingFile, setHereUploadingFile] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { filesUploaded, uploadingFile } = useSelector(
    ({ liveData: { filesUploaded, uploadingFile } }) => ({
      filesUploaded,
      uploadingFile,
    })
  );

  useEffect(() => {
    setHereFilesUploaded(() => filesUploaded?.[props.id] || []);
    setHereUploadingFile(() => uploadingFile?.[props.id]);
    const urls = filesUploaded?.[props.id]?.map((file) => file.url);
    onChange && onChange(urls, props.id);
  }, [filesUploaded, uploadingFile]);

  useEffect(() => {
    const urls = props.val;
    onChange && onChange(urls, props.id);
  }, [props.val]);

  const getSignature = () => {
    if (props?.appDesignMode !== APP_DESIGN_MODES.LIVE) {
      setError(
        "This action can only be performed when the app is running in live mode."
      );
      return;
    }

    props?.appDesignMode === APP_DESIGN_MODES.LIVE &&
      setSignatureComponentID(props.id);
    props?.appDesignMode === APP_DESIGN_MODES.LIVE &&
      setShowSignatureModal(() => true);
  };

  return (
    <div style={{ width: style?.field?.width }}>
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
          <Required required={values?.required} />
        </Typography>
      )}
      <Button
        onClick={getSignature}
        style={{ borderStyle: "solid", padding: 0 }}
        disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT || readOnly}
        readOnly={readOnly}
        variant={style?.button?.variant}
        className={`${classes?.button} ${readOnly ? "read-only" : ""}`}
        classes={{
          root: classes?.button,
          label: classes?.button,
          disabled: classes?.button,
        }}
        startIcon={
          !props.isDocument ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={style?.button?.color || "#00000042"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 20H21"
                stroke={style?.button?.color || "#00000042"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 3.49998C16.8978 3.10216 17.4374 2.87866 18 2.87866C18.2786 2.87866 18.5544 2.93353 18.8118 3.04014C19.0692 3.14674 19.303 3.303 19.5 3.49998C19.697 3.69697 19.8532 3.93082 19.9598 4.18819C20.0665 4.44556 20.1213 4.72141 20.1213 4.99998C20.1213 5.27856 20.0665 5.55441 19.9598 5.81178C19.8532 6.06915 19.697 6.303 19.5 6.49998L7 19L3 20L4 16L16.5 3.49998Z"
                stroke={style?.button?.color || "#00000042"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null
        }
      >
        {values?.buttonText}
      </Button>
      {error && (
        <div style={{ width: style?.button?.width, color: "red" }}>
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
              onClick={() => setError(() => "")}
            />
          </div>
        </div>
      )}
      <div style={{ width: style?.dimensions?.width }}>
        {!hereFilesUploaded.length && !!props?.val && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "red",
              paddingTop: 5,
            }}
          >
            <a href={props?.val} target="_blank" rel="noreferrer">
              <Typography
                style={{
                  color: "green",
                  fontSize: 10,
                  paddingRight: 5,
                  wordBreak: "break-all",
                }}
                className={classes?.label}
              >
                Download signature
              </Typography>
            </a>
          </div>
        )}
        {hereFilesUploaded.map((file, i) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "red",
              paddingTop: 5,
            }}
            key={i}
          >
            <Typography
              style={{
                color: "green",
                fontSize: 10,
                paddingRight: 5,
                wordBreak: "break-all",
              }}
              className={classes?.label}
            >
              {`${file.name.substring(0, file.name.lastIndexOf("_"))}....png`}
            </Typography>
            <MdDelete
              style={{ cursor: "pointer" }}
              onClick={() => dispatch(deleteUpdatedFile(file._id, props.id))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Signature;
