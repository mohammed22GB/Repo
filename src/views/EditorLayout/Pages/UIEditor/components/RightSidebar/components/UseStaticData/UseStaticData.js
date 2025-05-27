import { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { v4 } from "uuid";
import CustomColumnFields from "./util/CustomColumnFields";
import { useSelector } from "react-redux";
import {
  errorTexts,
  validateEmail,
  validateNumber,
  validatePassword,
  validateURL,
} from "../../../../../../../common/helpers/validation";

const useStyles = makeStyles((theme) => ({
  sectionLabel: {
    fontSize: 10,
    marginRight: 5,
    marginTop: 5,
  },
  sectionLabel2: {
    fontSize: 10,
    marginRight: 5,
    marginTop: 2,
    fontStyle: "italic",
    color: "#999",
  },
  fullWidthText: {
    flex: 1,
  },
  input: {
    color: "#091540",
    fontSize: 10,
  },
  center: {
    textAlign: "center",
  },
  valueSwitch: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    //justifyContent: "space-between",
    gap: "15px",
    width: "55%",
  },
  switchText: {
    //width: "555px",
    fontSize: "11px",
    lineHeight: 1,
    marginBottom: 0,
    fontWeight: 300,
  },

  switchLabel: {
    width: "100%",
    justifyContent: "space-between",
    margin: 0,
  },
  sectionTitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 5,
  },
}));

export default function UseStaticData(props) {
  const [newInput, setNewInput] = useState({});
  const [allInput, setAllInput] = useState({ initial: false });

  const { displayTableColumn } = useSelector((state) => state.uieditor);

  const { options, updateData, itemType, useValuesAttribute, dataType } = props;

  const classes = useStyles();
  const handleChange = (e) => {
    setNewInput({
      ...newInput,
      [e.target.name]: e.target.value,
    });
  };

  const getProperty = () => {
    switch (itemType) {
      case "dropdown":
        return "options";
      case "checkbox":
        return "options";
      case "radio":
        return "options";
      case "displayTable":
        return "columns";

      default:
        break;
    }
  };
  const doUpdateData = (oper, val) => {
    let options_ = [...(options || [])];
    switch (oper) {
      case "add":
        if (!newInput?.dataText) {
          return;
        }
        if (useValuesAttribute && !newInput?.dataValue) {
          return;
        }

        options_.push({
          id: v4(),
          ...newInput,
        });

        //  clear newInput
        const cleared = { ...(newInput || {}) };
        for (const key in cleared) {
          cleared[key] = "";
        }
        setNewInput(cleared);
        break;

      case "remove":
        const indx = options_.findIndex((f) => f.id === val.id);
        options_.splice(indx, 1);
        break;

      case "change":
        options_ = options_.map((f) =>
          f.id === val.id ? { ...f, [val.ppty]: val.value } : f
        );
        break;

      default:
        break;
    }

    updateData(options_, getProperty());
  };

  const inputValidation = (id, textInput) => {
    if (dataType === "email") {
      setAllInput({ ...allInput, [id]: !validateEmail(textInput) });
    }
    if (dataType === "url") {
      setAllInput({ ...allInput, [id]: !validateURL(textInput) });
    }
    if (dataType === "text") {
      setAllInput({ ...allInput, [id]: false });
    }
    if (dataType === "password") {
      setAllInput({ ...allInput, [id]: !validatePassword(textInput) });
    }
    if (dataType === "number") {
      setAllInput({ ...allInput, [id]: !validateNumber(textInput) });
    }
  };
  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      doUpdateData("add");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          border: "solid 1px #eee",
          backgroundColor: "#fcfcfc",
          padding: 10,
          borderRadius: 5,
          margin: "10px 0",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          gap: 10,
        }}
      >
        {options?.map(({ id, ...value }, index) => (
          <CustomColumnFields
            key={`${id}-index`}
            dataType={dataType}
            value={value}
            id={id}
            updateData={updateData}
            classes={classes}
            itemType={itemType}
            options={options}
            allInput={allInput}
            inputValidation={inputValidation}
            setAllInput={setAllInput}
            useValuesAttribute={useValuesAttribute}
            doUpdateData={doUpdateData}
            displayTableColumn={displayTableColumn}
          />
        ))}
        <Grid container>
          <TextField
            variant="outlined"
            error={allInput["initial"] && newInput?.dataValue !== ""}
            type={dataType}
            helperText={
              allInput["initial"] &&
              newInput?.dataValue !== "" &&
              errorTexts[dataType]
            }
            size="small"
            value={newInput?.dataValue}
            name="dataValue"
            onChange={(e) => {
              handleChange(e);
              inputValidation("initial", e.target.value);
            }}
            style={{ display: !useValuesAttribute ? "none" : "flex" }}
            onKeyDown={_handleKeyDown}
            rows={1}
            className={classes.fullWidthText}
            placeholder={`New ${getProperty()} value`}
          />
          <TextField
            variant="outlined"
            size="small"
            value={newInput?.dataText}
            name="dataText"
            onChange={(e) => handleChange(e)}
            onKeyDown={_handleKeyDown}
            rows={1}
            className={classes.fullWidthText}
            placeholder={`New ${getProperty()} text`}
          />
          <AddCircleOutlineIcon
            onClick={() => doUpdateData("add")}
            style={{
              color: "#ABB3BF",
              cursor: "pointer",
              fontSize: 18,
              marginRight: 10,
              transform: "translate(50%, 50%)",
            }}
          />
        </Grid>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: "center",
          marginTop: 10,
        }}
      ></div>
    </div>
  );
}

UseStaticData.propTypes = {
  onAdd: PropTypes.func,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  /* options: PropTypes.shape({
    map: PropTypes.func,
  }), */
};
UseStaticData.defaultProps = {
  options: [],
};
