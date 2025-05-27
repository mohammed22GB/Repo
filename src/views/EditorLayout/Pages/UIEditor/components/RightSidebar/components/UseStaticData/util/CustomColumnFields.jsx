import { Grid, TextField } from "@material-ui/core";
import { useEffect } from "react";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import { errorTexts } from "../../../../../../../../common/helpers/validation";

const CustomColumnFields = ({
  options,
  doUpdateData,
  itemType,
  dataType,
  value,
  id,
  classes,
  allInput,
  setAllInput,
  useValuesAttribute,
  displayTableColumn,
  inputValidation,
}) => {
  useEffect(() => {
    const addInputIDs = () => {
      options.map(({ id }) => setAllInput({ ...allInput, [id]: false }));
    };
    addInputIDs();
  }, []);

  return (
    <div>
      <Grid
        container
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          id={id.toString()}
          variant="outlined"
          error={allInput[id]}
          type={dataType}
          helperText={allInput[id] && errorTexts[dataType]}
          size="small"
          style={{ display: !useValuesAttribute ? "none" : "flex" }}
          value={value?.dataValue}
          onChange={(e) => {
            doUpdateData("change", {
              id,
              value: e.target.value,
              ppty: "dataValue",
            });
            inputValidation(id, e.target.value);
          }}
          //multiline
          //rows={1}
          className={classes.fullWidthText}
          placeholder="Enter option's value"
        />
        <TextField
          id={id.toString()}
          variant="outlined"
          size="small"
          value={value?.dataText}
          onChange={(e) => {
            let filterNonSymbolTexts = e.target.value.startsWith("@")
              ? e.target.value.slice(1)
              : e.target.value;
            doUpdateData("change", {
              id,
              value: filterNonSymbolTexts,
              ppty: "dataText",
            });
          }}
          //multiline
          //rows={1}
          className={classes.fullWidthText}
          placeholder="Enter option's text"
        />
        {itemType === "displayTable" && (
          <TextField
            id={id.toString()}
            variant="outlined"
            size="small"
            name="relWidth"
            value={value?.relWidth || 1}
            onChange={(e) =>
              doUpdateData("change", {
                id,
                value: e.target.value,
                ppty: "relWidth",
              })
            }
            className="_input_mini"
            rows={1}
            style={{ width: 30, padding: 0 }}
          />
        )}
        <CancelIcon
          onClick={() => doUpdateData("remove", { id })}
          style={{
            color: "#ABB3BF",
            cursor: "pointer",
            fontSize: 18,
            //marginLeft: 10,
          }}
        />
      </Grid>
    </div>
  );
};

export default CustomColumnFields;
