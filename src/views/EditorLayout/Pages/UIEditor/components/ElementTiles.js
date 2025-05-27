import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Typography from "@material-ui/core/Typography";

import { useStep } from "react-hooks-helper";
import SearchedElements from "./pickComponents/SearchedElements";
import BasicElements from "./pickComponents/BasicElements";
import InputElements from "./pickComponents/InputElements";
import NavigationElements from "./pickComponents/NavigationElements";
import AdvancedElements from "./pickComponents/AdvancedElements";
import { allElements } from "../utils/elementsList";
import { useDispatch } from "react-redux";
import { rUieSetSearchedElements } from "../../../../../store/actions/properties";

const useStyles = makeStyles((theme) => ({
  elementButton: {
    // border: "solid 1px #2457C1",
    background: "transparent",
    boxShadow: "0px 2px 6px 0px #71717140",
    borderRadius: 5,
    margin: "0 3px",
    border: "solid 0.5px",
  },
  heading: {
    color: "#535353",
    fontSize: 13,
    fontWeight: 500,
  },
  tileSpacing: {
    marginBottom: 10,
    background: "transparent",
    boxShadow: "none",
    "&::before": {
      position: "unset",
    },
  },
  tiles: {
    display: "flex",
    width: "20px",
    height: "20px",
  },
  summaryIcon: {
    color: "#ABB3BF",
  },
  expansionDetails: {
    background: "transparent",
    padding: "10px 0 0 0",
  },

  elementTile: {
    "&::before": {
      position: "unset",
    },
  },

  normalHeight: {
    minHeight: "48px !important",
    // marginTop: "0 !important",
    // marginBottom: "10px !important",
  },
  normalMargin: {
    marginTop: "0 !important",
    marginBottom: "10px !important",
  },
  keepMargin: {
    margin: "12px 0 !important",
  },
}));

const elementsData = {
  elements: [
    {
      title: "Basic Elements",
      component: <BasicElements />,
    },
    {
      title: "Form",
      component: <InputElements />,
    },
    // {
    //     title: "Form Inputs",
    //     component: <InputElements />
    // },
    // {
    //     title: "Selection Controls",
    //     component: <SelectionElements />
    // },
    // {
    //     title: "Button",
    //     component: <ButtonElements />
    // },
    // {
    //   title: "Navigation",
    //   component: <NavigationElements />,
    // },
    {
      title: "Advanced",
      component: <AdvancedElements />,
    },
    // {
    //     title: "Custom",
    //     component: <CustomElements />
    // },
  ],
  searchBarText: "Search components...",
  newText: "New Template",
  panelHeader: "UI Editor",
};

const steps = [{ id: "first" }, { id: "second" }];
const firstSectionTitle = "Basic Elements";

const ElementTiles = (props) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(firstSectionTitle);
  const { navigation } = useStep({ initialStep: 0, steps });
  // const { id } = step;

  const buttonCallback = props.buttonCallback;
  const _expanded = (status, catg) => {
    const expnd = expanded === catg ? null : catg;
    setExpanded(expnd);
  };

  props = { ...props, navigation, buttonCallback };

  if (!props.searching)
    return (
      <div
        style={{
          position: "relative",
          // overflow: "scroll",
          // width: "100%",
          height: "100%",
          flex: 1,
          // marginTop: 16,
        }}
      >
        {elementsData.elements.map((el, index) => (
          <Accordion
            key={index}
            expanded={expanded === el.title}
            className={classes.tileSpacing}
            square={false}
            classes={{ root: classes.normalMargin }}
            onChange={(e, ex) => _expanded(ex, el.title)}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon className={classes.summaryIcon} />}
              aria-controls="visual-elements"
              id="visual-elements"
              className={classes.elementButton}
              classes={{
                root: classes.normalHeight,
                content: classes.keepMargin,
              }}
            >
              <Typography component="span" className={classes.heading}>
                {el.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.expansionDetails}>
              {el.component}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  else return <SearchedElements {...props} />;
};

export default ElementTiles;
