import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NextArrow from "@material-ui/icons/ArrowForwardIosRounded";
import BackArrow from "@material-ui/icons/ArrowBackIosRounded";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import { APP_RUN_MAX_WIDTH } from "../../../../Workflow/components/utils/constants";

const HIDE_BACK_BUTTON = true;

export default function ScreenButtons({
  style,
  values,
  action,
  appDesignMode,
  hideScreenButton1,
  previewDownload,
  processPDF,
  ...props
}) {
  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      justifyContent: "end",
      alignItems: "center",
      gap: 15,
      maxHeight: 60,
      [theme?.breakpoints?.down("sm")]: {
        /* "& button:last-child": {
          marginRight: "45px !important",
        }, */
      },
      position: "absolute",
      bottom: 0,
    },
    dimensions: {
      width: "100%",
      // height: 60,
      [theme?.breakpoints?.down("sm")]: {
        width: "100% !important",
      },
      // paddingRight: 20,
    },
    button: {
      "&:disabled": {
        color: "white",
      },
    },
    customButton: {
      // backgroundColor: "#dd4400",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 30,
      paddingRight: 30,
      minWidth: 95,
    },
    customButtonLabel: {
      textTransform: "capitalize",
      textDecoration: "none",
      fontSize: 12,
      fontWeight: 300,
      // lineHeight: 1,
    },
  }));
  const classes = useStyles();

  // This is a hack to hide submit buttons on form during approvals
  const inactiveBtns =
    appDesignMode === APP_DESIGN_MODES.EDIT ||
    appDesignMode === APP_DESIGN_MODES.PREVIEW;

  return (
    <div
      className={`${classes?.container} ${classes?.dimensions}`}
      style={{
        ...(appDesignMode === APP_DESIGN_MODES.LIVE
          ? {
              gap: 15,
              bottom: 0,
              // display: "flex",
              // alignItems: "center",
              // justifyContent: "end",
              position: "fixed",
              maxHeight: 60,
              left: 0,
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 -5px 5px #e8e8e8",
              padding: "10px 0",
              zIndex: 10,
            }
          : {}),
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: APP_RUN_MAX_WIDTH,
          margin: "auto",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {previewDownload ? (
          <Button
            // className={classes.documentBtn}
            color="primary"
            variant="contained"
            onClick={processPDF}
            classes={{
              root: classes?.customButton,
              label: classes?.customButtonLabel,
            }}
            style={{
              background: "#272121",
              marginRight: "auto",
            }}
          >
            Download PDF
          </Button>
        ) : (
          !HIDE_BACK_BUTTON &&
          !hideScreenButton1 && (
            <Button
              variant="contained"
              // color="secondary"
              color="primary"
              disabled={props.disabled}
              onClick={!inactiveBtns ? props.screenButton1 : () => {}}
              type={values?.button1Type}
              style={{
                background: "#4c4646",
                marginRight: "auto",
              }}
              // className={classes?.button}
              classes={{
                root: classes?.customButton,
                label: classes?.customButtonLabel,
              }}
            >
              {values?.button1Text}
              <BackArrow
                style={{ position: "absolute", left: 6, fontSize: 14 }}
              />
            </Button>
          )
        )}
        {props.pageValidationError && (
          <div
            style={{
              alignSelf: "center",
              fontWeight: 700,
              padding: "0 15px",
              color: "rgb(245, 0, 0)",
              letterSpacing: "0.5px",
            }}
          >
            * complete required fields
          </div>
        )}
        <Button
          variant="contained"
          // color="secondary"
          color="primary"
          onClick={props.isDocument ? () => props?.screenButton2() : null}
          disabled={props.disabled}
          type={props.isDocument ? "button" : "submit"}
          style={{
            ...(appDesignMode === APP_DESIGN_MODES.LIVE
              ? {
                  // marginRight: 15,
                }
              : {}),
          }}
          className={classes?.button}
          classes={{
            root: classes?.customButton,
            label: classes?.customButtonLabel,
          }}
        >
          {props?.screenButton2Name || values?.button2Text}
          <NextArrow style={{ position: "absolute", right: 6, fontSize: 16 }} />
        </Button>
        {/* <IconButton onClick={props.screenButton2} size="small">
      </IconButton> */}
        {/* <Button
        disabled={appDesignMode === APP_DESIGN_MODES.EDIT || appDesignMode === APP_DESIGN_MODES.PREVIEW || props.disabled}
        className={`${classes?.button2}`}
        onClick={props.screenButton2}
        type={values?.button2Type}
      >
        {values?.button2Text}
      </Button> */}
      </div>
    </div>
  );
}
