import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Parser from "html-react-parser";
import {
  APP_DESIGN_MODES,
  LOREM_IPSUM,
} from "../../../../../../common/utils/constants";
import { SetAppStatus } from "../../../../../../common/helpers/helperFunctions";
import { getValueBasedOnAppDesignMode } from "../../../../../../common/utils/dynamicContentReplace";
import { separateNumbersWithComma } from "../../../../../../common/helpers/helperFunctions";

const Text = ({
  screenId,
  style,
  values,
  appDesignMode,
  dynamicData,
  dynamicDataID,
  ...props
}) => {
  const useStyles = makeStyles((theme) => style);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [placeholdersArray, setPlaceholdersArray] = useState([]);
  const dynamicContentObj = dynamicData?.[screenId];
  const { capturedData, screenItems } = props || {};

  const displayValue = (value) => {
    // return value;
    let noChange = false;
    let duplicationError = false;

    const checkDuplicate = (val) => {
      const check = !!placeholdersArray.find((p) => p.name === val);
      return check;
    };

    const replaceWithSpans = (match, offset, string) => {
      return `<span className="uieditor-placeholder-text">${match}</span>`;
    };

    const matches = value?.match(/(@[a-zA-Z0-9-_]+)/g) || [];
    const placeholdersArray_ = [...placeholdersArray];

    if (matches.length > placeholdersArray.length) {
      // added placeholder

      const newPH = matches.filter(
        (m) => !placeholdersArray.filter((p) => p.name === m.substr(1)).length
      );

      if (!newPH.length) duplicationError = true;
      else
        newPH.forEach((n) => {
          if (checkDuplicate(n)) duplicationError = true;
          placeholdersArray_.push({
            name: n.substr(1),
            type: "text",
          });
        });
    } else if (matches.length < placeholdersArray.length) {
      // removed placeholder

      const removedPH = placeholdersArray.findIndex(
        (p) => !matches.includes(`@${p.name}`)
      );
      placeholdersArray_.splice(removedPH, 1);
    } else {
      // renamed placeholder
      const renamedPHIndex = placeholdersArray.findIndex(
        (p) => !matches.includes(`@${p.name}`)
      );
      if (renamedPHIndex === -1) {
        noChange = true;
      } else {
        const renamedPH = matches.find(
          (m) => !placeholdersArray.filter((p) => p.name === m.substr(1)).length
        );
        if (!renamedPH || checkDuplicate(renamedPH)) duplicationError = true;
        else placeholdersArray_[renamedPHIndex].name = renamedPH.substr(1);
      }
    }

    if (duplicationError) {
      dispatch(
        SetAppStatus({ type: "error", msg: "Error: duplicate placeholders" })
      );
      // return value;
    }

    if (!noChange) {
      setPlaceholdersArray(placeholdersArray_);
    }
    const newText =
      value?.replace(/(@[a-zA-Z0-9-_]+)/g, replaceWithSpans) || "";

    //  display newlines accordingly
    const finalText = newText.replace(/\n/g, "<br />");
    return finalText;
  };

  return (
    <>
      <Typography
        gutterBottom
        className={`${classes?.text}`}
        style={{
          paddingLeft: 1,
          marginBottom: 0,
          width:
            !style?.text?.width || style?.text?.width === 0
              ? "100%"
              : style?.text?.width,
        }}
      >
        {separateNumbersWithComma(
          getValueBasedOnAppDesignMode(
            values,
            appDesignMode,
            displayValue,
            dynamicContentObj,
            screenItems,
            capturedData
          ),
          null,
          props?.isDocument
        )}
      </Typography>
    </>
  );
};

export default Text;
