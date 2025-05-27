import { TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useDispatch } from "react-redux";
import SidebarNameSection from "../components/SidebarNameSection";
import CustomStyleSection from "../components/CustomStyleSection";
import { updateScreenItemPropertyValues } from "../../../../utils/uieditorHelpers";

const useStyles = makeStyles((theme) => ({
  root: {},
  sideHeading: {
    color: "#091540",
    fontWeight: 600,
    fontSize: 13,
    padding: "10px 5px 0px 5px",
    paddingLeft: 10,
    display: "flex",
    justifyContent: "space-between",
    "& span": {
      textAlign: "right",
      "& input": {
        paddingLeft: 10,
      },
    },
  },
  section: {
    padding: 10,
  },
  sectionTitle: {
    color: "#999",
    fontSize: 12,
  },
  sectionLabel: {
    color: "#999",
    fontSize: 10,
    marginRight: 12,
    marginTop: 6,
  },
  fullWidthText: {
    margin: "10px 0",
  },
  // input: {
  //   color: "#091540",
  //   fontSize: 10,
  // },
  center: {
    textAlign: "center",
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  input: {
    "&::placeholder": {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 12,
      color: "#091540!important",
      LineHeight: 15.6,
    },
  },
}));

export default function FileUploadSidebar(props) {
  const {
    id,
    itemRef,

    type: itemType,
    title,
    style,
    values,
    showStyling,
    name,
  } = props;
  const classes = useStyles();

  const dispatch = useDispatch();

  const onValuesChange = ({ value, property }) =>
    dispatch(
      updateScreenItemPropertyValues({
        value,
        property,
        type: itemType,
        itemRef,
      })
    );

  const onTextChange = (e) => {
    // if (e.target.value.includes(/,./)) return;
    onValuesChange({ value: e.target.value, property: "value" });
  };

  return (
    <div className="sidebar-container">
      <SidebarNameSection
        itemRef={itemRef}
        itemId={id}
        itemType={itemType}
        name={name}
        title={title}
      />

      <div className="sidebar-container-scroll">
        {!showStyling ? (
          <div className="sidebar-section">
            <div
              className="sidebar-section-item _full"
              style={{ display: "block" }}
            >
              <Typography
                gutterBottom
                className="row-label _long"
                style={{ margin: "10px 0" }}
              >
                Text
              </Typography>
              <TextField
                variant="outlined"
                size="medium"
                fullWidth
                multiline
                minRows={9}
                value={values?.value}
                onChange={onTextChange}
                InputProps={{
                  style: {
                    fontFamily: "Inter",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: 12,
                    color: "#091540!important",
                    LineHeight: 15.6,
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <CustomStyleSection
            itemRef={itemRef}
            itemType={itemType}
            items={["text"]}
            styles={style}
          />
        )}
      </div>
    </div>
  );
}
