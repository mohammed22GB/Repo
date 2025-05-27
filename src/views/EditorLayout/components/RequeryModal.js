import React, { useState } from "react";
import {
  Typography,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Collapse,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";
import useStyles from "./style";
import { useSelector, useDispatch } from "react-redux";
import { updateBackendErrorBank } from "../../../store/actions/properties";

const RequeryModal = ({ closeModal }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    reducers: { plugBackendUpdateErrorBank },
  } = useSelector((state) => state);

  const [openedLog, setOpenedLog] = useState("");

  const resubmitRequests = async () => {
    // await Promise.all(
    Object.keys(plugBackendUpdateErrorBank || {}).map((section) => {
      Object.keys(plugBackendUpdateErrorBank[section]).map((resource) => {
        Object.keys(plugBackendUpdateErrorBank[section][resource]).map(
          (resourceId) => {
            const { payload, hostFn, fn, dispatcher, msg, callback } =
              plugBackendUpdateErrorBank[section][resource][resourceId];

            if (dispatcher === "function") {
              dispatch(
                hostFn(fn, msg, {
                  ...payload,
                  callback,
                  category: resource,
                  id: resourceId,
                })
              );
            } else if (dispatcher === "argument") {
              hostFn(dispatch, fn, { ...payload, id: resourceId });
            }
          }
        );
      });
    });
    // );
  };

  const ignoreRequests = () => {
    dispatch(updateBackendErrorBank({}));
  };

  const extractLogs = () => {
    const allLogs = [];

    // await Promise.all(
    Object.keys(plugBackendUpdateErrorBank || {}).forEach((section) => {
      Object.keys(plugBackendUpdateErrorBank[section]).forEach((resource) => {
        Object.keys(plugBackendUpdateErrorBank[section][resource]).forEach(
          (resourceId) => {
            const { payload, ts } =
              plugBackendUpdateErrorBank[section][resource][resourceId];
            allLogs.push({
              section,
              resource,
              resourceId,
              payload,
              ts,
            });
          }
        );
      });
    });

    return allLogs;
  };

  const extractedLogs = extractLogs();

  const getPayloadText = (payload) => {
    try {
      const payloadText = JSON.stringify(payload, undefined, 4);
      return payloadText;
    } catch (err) {
      return "{ payload }";
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={true}
      onClose={closeModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={true}>
        <div className={classes.paper2} id="user-modal-box">
          <div>
            <div
              className={classes.modalHead}
              style={{ justifyContent: "right", gap: 20 }}
            >
              <Typography
                variant="h5"
                component="h2"
                style={{ textTransform: "capitalize", marginRight: "auto" }}
              >
                Unsaved changes
              </Typography>
              <span
                style={{
                  ...(!!extractedLogs.length
                    ? { cursor: "pointer" }
                    : { opacity: 0.5 }),
                }}
                onClick={ignoreRequests}
              >
                Ignore all
              </span>
              <span
                style={{
                  ...(!!extractedLogs.length
                    ? { cursor: "pointer" }
                    : { opacity: 0.5 }),
                }}
                onClick={resubmitRequests}
              >
                Submit all
              </span>
              <IconButton
                aria-label="cancel"
                color="inherit"
                onClick={closeModal}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </div>
            <div className={classes.modalMain}>
              {extractedLogs.map((log, logIndex) => (
                <div
                  style={{
                    padding: "10px 0",
                    borderBottom: "solid 1px #999999",
                    ...(openedLog === log.resourceId
                      ? { paddingBottom: 0 }
                      : {}),
                  }}
                >
                  <div
                    style={{ cursor: "pointer", paddingBottom: 10 }}
                    onClick={() =>
                      setOpenedLog(
                        openedLog === log.resourceId ? "" : log.resourceId
                      )
                    }
                  >
                    <span>{`${log.section} > ${log.resource} > `}</span>
                    <span>{`${log.ts} `}</span>
                  </div>
                  <Collapse in={openedLog === log.resourceId}>
                    <div
                      style={{
                        padding: 5,
                        paddingBottom: 10,
                        borderTop: "dashed 1px #aaaaaa",
                        backgroundColor: "#eeeeee",
                        wordWrap: "break-word",
                      }}
                    >
                      {getPayloadText(log.payload)}
                    </div>
                  </Collapse>
                </div>
              ))}
              {!extractedLogs.length && "No unsaved changes"}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default RequeryModal;
