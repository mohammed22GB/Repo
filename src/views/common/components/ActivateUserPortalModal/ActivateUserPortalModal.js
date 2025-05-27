import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import UserPortalPreview from "../../../../assets/images/userportalview.svg";
import Star from "../../../../assets/images/previewstar.svg";
import Sheet from "../../../../assets/images/previewsheet.svg";
import Share from "../../../../assets/images/previewshare.svg";
import Cloud from "../../../../assets/images/previewcloud.svg";
import Securityuser from "../../../../assets/images/previewsecurityuser.svg";
import Folderone from "../../../../assets/images/folderone.svg";
import Foldertwo from "../../../../assets/images/foldertwo.svg";
import ActivationSuccess from "../../../../assets/images/generationSuccessful.gif";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiPaper-root": {
        padding: theme?.spacing(6, 3, 6, 4),
        maxWidth: "800px",
        borderRadius: 25,
        fontFamily: "'Avenir', 'Inter'",
      },
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme?.palette.background.paper,
      boxShadow: theme?.shadows[5],
      padding: theme?.spacing(6, 3, 6, 4), //top,right, bottom,left
      borderRadius: 25,
      outline: "none",
      position: "relative",
      fontFamily: "'Avenir', 'Inter'",
    },
    closeButton: {
      position: "absolute",
      right: theme?.spacing(3),
      top: theme?.spacing(2),
      backgroundColor: "#ABB3BF",
      color: "#FFFFFF",
      "&:hover ": {
        backgroundColor: "#ABB3BF",
      },
    },
    modalContentBox: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      maxWidth: "800px",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
    },
    userPortalContentBox: {
      display: "flex",
      alignItems: "start",
      flexDirection: "column",
      justifyContent: "center",
      gap: "20px",
    },
    imageFramebox: {
      display: "flex",
      alignItems: "center",
    },
    description: {
      fontWeight: 500,
      fontSize: 14,
      textAlign: "left",
      color: "#959595",
      fontFamily: "'Avenir', 'Inter'",
    },
    buttonGroup: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
    },
    button: {
      color: "#FFFFFF",
      borderRadius: 10,
      textTransform: "none",
      padding: "10px 30px",
      fontFamily: "'Avenir', 'Inter'",
    },
    rightImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
  })
);

export default function ActivateUserPortalModal({
  openModal,
  setOpenModal,
  onHandleActivateUserPortal,
  userPortalLoading,
  activatePortalLookSuccess,
}) {
  const classes = useStyles();

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Dialog
        aria-labelledby="activate-user-portal"
        aria-describedby="this-is-to-active-new-user-portal"
        className={classes.root}
        open={openModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div
          // className={classes.paper}
          >
            <IconButton
              aria-label="close"
              size="small"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            <div className={classes.modalContentBox}>
              <div className={classes.userPortalContentBox}>
                <div className={classes.imageFramebox}>
                  <img
                    src={Star}
                    alt="star icon"
                    style={{ transform: "translate(20px,0px)" }}
                    loading="lazy"
                  />
                  <img
                    src={Sheet}
                    alt="sheet icon"
                    style={{
                      transform: "translate(130px,-50px)", // x-axis, y-axis
                    }}
                    loading="lazy"
                  />
                  <img
                    src={Share}
                    alt="share icon"
                    style={{ transform: "translate(220px,10px)" }}
                    loading="lazy"
                  />
                </div>
                <div>
                  <Typography
                    style={{
                      fontFamily: "'Avenir', 'Inter'",
                      textAlign: `${
                        activatePortalLookSuccess ? "center" : "left"
                      }`,
                    }}
                    variant="h3"
                    gutterBottom
                  >
                    {activatePortalLookSuccess
                      ? "User Portal Activated"
                      : "User portal activation"}
                  </Typography>

                  <Typography
                    className={classes.description}
                    style={{ fontFamily: "'Avenir', 'Inter'" }}
                    gutterBottom
                  >
                    {activatePortalLookSuccess
                      ? "You have successfully activated the user portal!"
                      : "By clicking on the Proceed button, users will be granted the permission to log in directly to their separate portals.   Are you sure you want to activate the portal for all users? "}
                  </Typography>
                </div>

                {activatePortalLookSuccess ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "30px",
                      marginTop: "12px",
                    }}
                  >
                    <img
                      src={ActivationSuccess}
                      alt="user portal activation sucessful"
                      width="150px"
                      height="150px"
                    />
                  </div>
                ) : (
                  <div className={classes.buttonGroup}>
                    <Button
                      variant="contained"
                      className={classes.button}
                      style={{
                        backgroundColor: "#2457C1",
                        color: `${userPortalLoading && "#FFFFFF"}`,
                        fontFamily: "'Avenir', 'Inter'",
                        fontSize: 14,
                      }}
                      onClick={() => onHandleActivateUserPortal()}
                      disabled={userPortalLoading}
                      role="button"
                    >
                      {userPortalLoading ? "Activating..." : "Proceed"}
                    </Button>

                    {!userPortalLoading && (
                      <Button
                        variant="contained"
                        className={classes.button}
                        style={{
                          backgroundColor: "#000000",
                          fontFamily: "'Avenir', 'Inter'",
                          fontSize: 14,
                        }}
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}

                <div className={classes.imageFramebox}>
                  <img
                    src={Cloud}
                    alt="cloud icon"
                    style={{
                      transform: "translate(30px,50px)", // x-axis-vertical, y-axis-horizontal
                    }}
                    loading="lazy"
                  />
                  <img
                    src={Securityuser}
                    alt="securityuser icon"
                    style={{ transform: "translate(85px,90px)" }}
                    loading="lazy"
                  />
                  <img
                    src={Folderone}
                    alt="folderone icon"
                    style={{ transform: "translate(150px,50px)" }}
                    loading="lazy"
                  />
                  <img
                    src={Foldertwo}
                    alt="foldertwo icon"
                    style={{ transform: "translate(190px,-20px)" }}
                    loading="lazy"
                  />
                </div>
              </div>

              <div>
                <img
                  src={UserPortalPreview}
                  alt="user portal preview"
                  className={classes.rightImage}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Fade>
      </Dialog>
    </div>
  );
}
