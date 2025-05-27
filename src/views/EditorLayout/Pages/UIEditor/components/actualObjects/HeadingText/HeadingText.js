import { makeStyles, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Parser from "html-react-parser";
import { SetAppStatus } from "../../../../../../common/helpers/helperFunctions";
import { getValueBasedOnAppDesignMode } from "../../../../../../common/utils/dynamicContentReplace";
import { separateNumbersWithComma } from "../../../../../../common/helpers/helperFunctions";

const HeadingText = ({
  style,
  values,
  appDesignMode,
  dynamicData,
  screenId,
  ...props
}) => {
  const labelTextStyle = makeStyles((theme) => style);
  const classes = labelTextStyle();
  const dispatch = useDispatch();
  const [placeholdersArray, setPlaceholdersArray] = useState([]);
  const dynamicContentObj = dynamicData?.[screenId];
  const { capturedData, screenItems } = props || {};

  //console.log("dynamicContentObj", dynamicContentObj);

  const displayValue = (value) => {
    // return value;
    let noChange = false;
    let duplicationError = false;

    const replaceWithSpans = (match, offset, string) => {
      return `<span className="uieditor-placeholder-text">${match}</span>`;
    };

    const checkDuplicate = (val) => {
      const check = !!placeholdersArray.find((p) => p.name === val);
      return check;
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
    <Typography
      gutterBottom
      className={`${classes?.heading}`}
      style={{
        width:
          !style?.heading?.width || style?.heading?.width == 0
            ? "100%"
            : style?.heading?.width,
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
  );
};

export default HeadingText;
