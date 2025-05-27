import { Typography, InputBase } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const FormulaBuilderInputTextBox = ({
  itemRef,
  index = null,
  itemType,
  value,
  handleOnBlur,
}) => {
  const InputText = withStyles((theme) => ({
    input: {
      color: "#091540",
      borderRadius: 3,
      position: "relative",
      border: "1px solid #ABB3BF",
      fontSize: 12,
      padding: "5px 12px",
      transition: theme?.transitions.create(["border-color"]),
      width: "100%",
    },
  }))(InputBase);

  const InputFormulaBuilder = () => (
    <div>
      <InputText
        key={itemRef}
        size="small"
        fullWidth
        placeholder={`Please input a formula here; enclose computed values in curly braces {{ }}`}
        defaultValue={
          itemType === "text" || itemType === "heading"
            ? value?.formula
            : value?.formulaBuilderExpression
        }
        onBlur={(e) => handleSubmit(e, index, itemType)}
        multiline
        rows={9}
      />
    </div>
  );

  const handleSubmit = (e, index, itemType) => {
    handleOnBlur(
      {
        value: e.target.value,
        property:
          itemType === "text" || itemType === "heading"
            ? "formula"
            : "formulaBuilderExpression",
      },
      index
    );
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "5px",
        fontSize: "11px",
        fontWeight: "300",
      }}
      key={itemRef}
    >
      <div>
        <Typography
          style={{ width: "unset", fontSize: "11px", fontWeight: "300" }}
        >
          Formula builder input:
        </Typography>
      </div>
      <InputFormulaBuilder />
    </div>
  );
};

export default FormulaBuilderInputTextBox;
