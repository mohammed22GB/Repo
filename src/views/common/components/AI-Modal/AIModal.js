import React from "react";
import { useState, useEffect } from "react";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Modal,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import Divider from "@material-ui/core/Divider";
import { errorToastify } from "../../utils/Toastify";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import GeneratingPromptGif from "../../../../assets/images/generatingPrompt.gif";
import GenerationSuccessGif from "../../../../assets/images/generationSuccessful.gif";
import {
  generateFormFieldsWithPrompt,
  generateWorkflowWithPrompt,
} from "../Mutation/Apps/AppsMutation";
import {
  ISGENERATING_DELAY,
  ISREADY_DELAY,
  promptGeneratingText,
} from "./utils/promptLoadingUtil";
import { useDispatch } from "react-redux";
import {
  rLoadWorkflowTasks,
  rSetWorkflowVariables,
  rTriggerAiWorkflowValue,
  rUpdateWorkflowCanvas,
} from "../../../../store/actions/properties";

const AITextField = withStyles({
  root: {
    backgroundColor: "#FCFCFC",
    lineHeight: "1.5",
    fontFamily: "'Avenir','Inter'",

    "& .MuiInputBase-input": {
      fontSize: "16px",
      fontWeight: 400,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#C4C4C4",
        borderRadius: "16px",
      },
      "&:hover fieldset": {
        borderColor: "#6D9DF9",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6D9DF9",
      },
    },
  },
})(TextField);

const AIModal = ({
  setShowAiModal,
  showAiModal,
  page,
  appId,
  activeScreenId,
  reloadCanvas,
}) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      fontFamily: "'Avenir','Inter'",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 700,
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      gap: "40px",
      justifyContent: "center",
      padding: "30px",
      borderRadius: "32px",
    },

    heading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    aiPromptText: {
      fontWeight: 600,
      fontFamily: "'Avenir','Inter'",
    },
    cancelIcon: {
      backgroundColor: "#ABB3BF",
      borderRadius: "50%",
      color: "#FFFFFF",
      "&:hover ": {
        backgroundColor: "#ABB3BF",
      },
    },
    generatingDivBox: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
    },
    generatingDivTextBox: {
      paddingBottom: "35px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      gap: "15px",
    },
    isReadyTextOne: {
      fontFamily: "'Avenir','Inter'",
      fontSize: "20px",
      fontWeight: 500,
    },
    isReadyTextTwo: {
      color: "#959595",
      fontFamily: "'Avenir','Inter'",
      fontSize: "18px",
      fontWeight: 500,
    },
    describePromptBox: {
      display: "flex",
      gap: "10px",
      flexDirection: "column",
    },
    describePromptTextOne: {
      color: "#303030",
      fontSize: "18px",
      fontWeight: 500,
      fontFamily: "'Avenir','Inter'",
    },
    describePromptTextTwo: {
      color: "#959595",
      fontSize: "15px",
      fontWeight: 500,
      fontFamily: "'Avenir','Inter'",
    },
    aiTextFieldBox: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    aiCreateText: {
      color: "#303030",
      fontSize: "16px",
      fontWeight: 500,
      fontFamily: "'Avenir','Inter'",
    },
    generateTextButtonBox: {
      display: "flex",
      justifyContent: "flex-end",
    },
    generateTextActualButton: {
      borderRadius: "10px",
      fontSize: 14,
      fontWeight: 500,
      padding: "8px 18px",
      cursor: "pointer",
      textTransform: "none",
      fontFamily: "'Avenir','Inter'",
    },
    exampleTextbox: {
      display: "flex",
      alignItems: "start",
      justifyContent: "space-between",
      gap: "95px",
    },
    exampleText: {
      color: "#303030",
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "'Avenir','Inter'",
    },
    exampleCreateText: {
      color: "#959595",
      fontSize: "13px",
      textAlign: "justify",
      // width: "500px",
      fontFamily: "'Avenir','Inter'",
      fontWeight: "500",
    },
  }));

  const classes = useStyles();
  const dispatch = useDispatch();
  const [textPrompt, setTextprompt] = useState("");

  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [currentIsGeneratingText, setCurrentIsGeneratingText] = useState(
    promptGeneratingText[0]
  );

  const handleAiPromptGeneration = async () => {
    let textInterval;
    try {
      setIsGeneratingPrompt(true);

      // Start the text display while generating
      textInterval = setInterval(() => {
        setCurrentIsGeneratingText(
          promptGeneratingText[
            Math.floor(Math.random() * promptGeneratingText.length)
          ]
        );
      }, ISGENERATING_DELAY);

      //payload to send for text-to-form-field
      const formFieldData = {
        textPrompt: textPrompt,
        appId: appId,
        screenId: activeScreenId,
      };

      //payload to send for text-to-workflow
      const workflowData = {
        textPrompt: textPrompt,
        appId: appId,
      };

      if (page === "workflows") {
        dispatch(rTriggerAiWorkflowValue(true)); //sets the trigger to reload the workflow page
        const workflowResponse = await generateWorkflowWithPrompt(workflowData);

        if (workflowResponse?.data?._meta?.success) {
          const workflowTasks = workflowResponse?.data?.data?.tasks;
          const workflowVariables = workflowResponse?.data?.data?.variables;

          clearInterval(textInterval);
          setIsReady(true);

          //reload canvas and close the modal
          setTimeout(() => {
            setIsGeneratingPrompt(false);
            dispatch(rUpdateWorkflowCanvas(workflowTasks)); // sets the workflow tasks
            dispatch(rSetWorkflowVariables(workflowVariables)); //sets the workflow variables
            dispatch(rLoadWorkflowTasks({})); //sets the workflow taks to an empty object
            setShowAiModal(false);
          }, ISREADY_DELAY);
        }
      } else if (page === "uieditor") {
        const formFieldResponse = await generateFormFieldsWithPrompt(
          formFieldData
        );

        if (formFieldResponse?.data?._meta?.success) {
          clearInterval(textInterval);
          setIsReady(true);

          //reload canvas and close the modal
          setTimeout(() => {
            setIsGeneratingPrompt(false);
            reloadCanvas();
            setShowAiModal(false);
          }, ISREADY_DELAY);
        }
      }
    } catch (error) {
      clearInterval(textInterval);
      setIsGeneratingPrompt(false);
      setIsReady(false);

      errorToastify(
        "Sorry, An error occured. Please retry again in a short while"
      );
    }
  };

  return (
    <Modal
      open={showAiModal}
      onClose={() => {
        setShowAiModal((prev) => !prev);
        setTextprompt("");
      }}
      aria-labelledby="ai-suggestion-modal"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={showAiModal}>
        <div className={classes.paper}>
          <div className={classes.heading}>
            <Typography variant="h3" className={classes.aiPromptText}>
              AI prompt box ✨
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowAiModal(false)}
              className={classes.cancelIcon}
            >
              <CloseIcon />
            </IconButton>
          </div>

          {isGeneratingPrompt ? (
            <div className={classes.generatingDivBox}>
              <img
                src={isReady ? GenerationSuccessGif : GeneratingPromptGif}
                alt="Generating-text"
                width={250}
              />
              <div className={classes.generatingDivTextBox}>
                <Typography className={classes.isReadyTextOne}>
                  {isReady
                    ? `${
                        page === "uieditor" ? "Form" : "Workflow"
                      } Completely Generated 🥳`
                    : `We are generating your ${
                        page === "uieditor" ? "form" : "workflow"
                      }  🪄`}
                </Typography>
                <Typography className={classes.isReadyTextTwo}>
                  {isReady
                    ? "Hurray! Thanks for using our AI generator."
                    : currentIsGeneratingText}
                </Typography>
              </div>
            </div>
          ) : (
            <>
              <div className={classes.describePromptBox}>
                <Typography
                  className={classes.describePromptTextOne}
                  gutterBottom
                >
                  Describe your{" "}
                  {page === "uieditor" ? "form" : "workflow processes"} using
                  simple terms
                </Typography>
                <Typography className={classes.describePromptTextTwo}>
                  Providing detailed descriptions yields better results. You can
                  customize the generated form using the UI Editor.
                </Typography>
              </div>

              <div className={classes.aiTextFieldBox}>
                <Typography className={classes.aiCreateText}>
                  I want to create a...
                </Typography>

                <AITextField
                  variant="outlined"
                  size="medium"
                  fullWidth
                  multiline
                  maxRows={8}
                  minRows={8}
                  defaultValue={textPrompt || ""}
                  onChange={(e) => setTextprompt(e.target.value)}
                />

                <div className={classes.generateTextButtonBox}>
                  <Button
                    variant="contained"
                    className={classes.generateTextActualButton}
                    style={{
                      boxShadow: "0px 4px 10px 1px rgba(43, 45, 66, 0.25)",
                      color: "#FFFFFF",
                      backgroundColor: `${textPrompt ? "#2457C1" : "#6A6A6A"}`,
                    }}
                    disabled={!textPrompt}
                    onClick={() => handleAiPromptGeneration()}
                  >
                    Generate ✨
                  </Button>
                </div>
              </div>

              <div>
                <Divider
                  style={{ backgroundColor: "#E6E6E6", marginBottom: "15px" }}
                />
                <div className={classes.exampleTextbox}>
                  <Typography className={classes.exampleText}>
                    Example:
                  </Typography>

                  <Typography className={classes.exampleCreateText}>
                    "Create a job application form with the following fields:
                    Full Name (First Name, Last Name), Email Address, Phone
                    Number, and Position Applied For. Ensure all required fields
                    are validated, provide placeholders, and design the form for
                    easy readability."
                  </Typography>
                </div>
              </div>
            </>
          )}
        </div>
      </Fade>
    </Modal>
  );
};

export default AIModal;
