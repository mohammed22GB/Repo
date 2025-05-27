import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Select, MenuItem, IconButton } from "@material-ui/core";
import { CancelRounded } from "@material-ui/icons";

const DataMappingPair = ({
  pair = {},
  valuesData,
  pairsList = {},
  setPairsList,
  reverseRow = false,
  counter,
  fixed = false,
  tableColumns,
  MenuItems,
}) => {
  const useStyles = makeStyles((theme) => ({
    sectionTitle: {
      color: "#999",
      fontSize: 12,
      marginBottom: 5,
    },
    select: {
      color: "#091540",
      fontSize: 12,
      padding: 10,
    },
    sectionEntry: {
      marginBottom: 13,
    },
    matchingFields: {
      borderRadius: 5,
      border: "dashed 1.5px #999",
      padding: "10px 5px 10px 10px",
      // paddingRight: 0,
      backgroundColor: "#f8f8f8",
    },
    pair: {
      display: "flex",
      flexDirection: reverseRow ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 10,
      height: 35.25,
      "& > div": {
        marginRight: 5,
        flex: 1,
        "&:first-child": {},
      },
      "&:last-of-type": {
        marginBottom: 0,
      },
    },
    disabled: {
      color: "#999",
    },
    menuSubs: {
      fontSize: "0.8em",
      color: "#0c7b93",
      fontWeight: "normal",
    },
    selected: {
      "& span": {
        display: "none",
      },
    },
  }));

  const classes = useStyles();

  const setKey = (e) => {
    delete pairsList[Object.keys(pair)?.[0]];
    const updatedPair = {
      ...pairsList,
      [e.target.value]: Object.values(pair)?.[0] || null,
    };
    setPairsList(updatedPair);
  };
  const setValue = (e) => {
    const updatedPair = {
      ...pairsList,
      [Object.keys(pair)?.[0]]: e.target.value,
    };
    setPairsList(updatedPair);
  };
  const removePair = () => {
    const currentPair = { ...pairsList };
    delete currentPair[Object.keys(pair)?.[0]];
    setPairsList(currentPair);
  };

  return (
    <div className={classes.pair}>
      <Select
        variant="outlined"
        size="small"
        fullWidth
        classes={{
          root: classes.select,
          outlined: classes.selected,
          disabled: classes.disabled,
        }}
        value={Object.keys(pair)?.[0]}
        onChange={setKey}
      >
        <MenuItem value="choose" key="key-col-0" selected disabled>
          <em>
            {counter
              ? `${reverseRow ? "Assign" : "Select"} table column*`
              : `No table columns*`}
          </em>
        </MenuItem>
        {tableColumns?.map((col, index) => {
          const value = col.id || col.name || col.dataText;
          const name = col.name || col.dataText;
          return (
            <MenuItem
              key={`col-${value}-${index}`}
              value={value}
              disabled={
                pairsList.hasOwnProperty(name) && !pair.hasOwnProperty(name)
              }
            >
              {name}
            </MenuItem>
          );
        })}
      </Select>

      <Select
        variant="outlined"
        size="small"
        fullWidth
        classes={{
          root: classes.select,
          outlined: classes.selected,
          disabled: classes.disabled,
        }}
        disabled={!Object.keys(pair)?.[0]}
        value={Object.values(pair)?.[0]}
        onChange={(e) => {
          setValue(e);
        }}
      >
        <MenuItem value="choose" key="key-col-0" selected disabled>
          <em>
            {counter
              ? `${reverseRow ? "Select" : "Assign"} source column`
              : `No source columns*`}
          </em>
        </MenuItem>
        {!!MenuItems
          ? MenuItems()
          : valuesData?.map((fieldColumn) => (
              <MenuItem
                key={`fieldColumn-${fieldColumn.id || fieldColumn.name}`}
                value={fieldColumn.id || fieldColumn.name}
              >
                {fieldColumn.name}
              </MenuItem>
            ))}
      </Select>

      {!fixed && (
        <div className={classes.addComponent} style={{ flex: 0 }}>
          <IconButton
            size="small"
            disabled={Object.keys(pairsList).length === 1}
            onClick={removePair}
          >
            <CancelRounded style={{ fontSize: 16 }} />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default DataMappingPair;
