import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import NativeSelect from "@material-ui/core/NativeSelect";
import { Fragment } from "react";

const BootstrapInput = withStyles((theme) => ({
  input: {
    color: "#091540",
    borderRadius: 3,
    position: "relative",
    border: "1px solid #ABB3BF",
    fontSize: 11,
    padding: "5px 12px",
    transition: theme?.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);
const InputText = withStyles((theme) => ({
  input: {
    color: "#091540",
    borderRadius: 3,
    position: "relative",
    border: "1px solid #ABB3BF",
    fontSize: 11,
    padding: "5px 12px",
    transition: theme?.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);
const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: 5,
    width: "100%",
  },
  selectMenu: {
    border: "none",
    boxShadow: "none",
  },
  select: {
    paddingRight: "5px !important",
  },
  width: {
    width: "100%",
  },
}));

export const Navigation = ({
  onChange,
  selectedValue,
  items,
  externalLink,
  externalLinkChange,
}) => {
  const classes = useStyles();
  const handleChange = (e) => onChange(e.target.value);
  const handleExternalLinkChange = (e) => externalLinkChange(e.target.value);
  const displayItems = [...items];
  return (
    <Fragment>
      <NativeSelect
        id={new Date().getTime()}
        style={{ width: "100%" }}
        // variant="outlined"
        onChange={handleChange}
        input={<BootstrapInput />}
        IconComponent="none"
        value={selectedValue || "External"}
        // defaultValue={"External"}
        classes={{
          root: classes.root,
          selectMenu: classes.selectMenu,
          select: classes.select,
        }}
      >
        {displayItems.map(({ name, value }) => (
          <option key={value} value={name}>
            {name}
          </option>
        ))}
      </NativeSelect>

      {(!selectedValue || selectedValue?.toLowerCase() === "external") && (
        <InputText
          variant="outlined"
          size="small"
          type="url"
          onChange={handleExternalLinkChange}
          value={externalLink}
          placeholder="https://google.com"
          style={{ width: "97%", marginTop: 5 }}
          inputProps={{
            min: 0,
          }}
        />
      )}
    </Fragment>
  );
};

Navigation.propTypes = {
  externalLink: PropTypes.any,
  externalLinkChange: PropTypes.func,
  items: PropTypes.any,
  onChange: PropTypes.func,
  selectedValue: PropTypes.shape({
    toLowerCase: PropTypes.func,
  }),
};

Navigation.defaultValue = {
  selectedValue: "external",
};
