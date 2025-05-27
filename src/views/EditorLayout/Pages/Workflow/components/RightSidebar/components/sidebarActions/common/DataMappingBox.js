import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import { Add, SwapHoriz } from "@material-ui/icons";
import DataMappingPair from "./DataMappingPair";

const DataMappingBox = ({
  componentData = {},
  updateComponentData,
  getDataColumns,
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
    mappingFields: {
      borderRadius: 5,
      border: "dashed 1.5px #999",
      padding: "10px 5px 10px 10px",
      backgroundColor: "#f8f8f8",
      marginTop: 7,
    },
    mappingTitle: {
      fontSize: 12,
      flex: 1,
      color: "#f7a712",
      display: "flex",
      justifyContent: "space-between",
    },
    addMatch: {
      fontSize: 20,
      boxShadow: "0px 2px 3px #aaa",
      borderRadius: "14%",
      marginTop: 10,
    },
    pair: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      "& > div": {
        "&:first-child": {
          marginRight: 5,
        },
      },
    },
    menuSubs: {
      fontSize: "0.8em",
      color: "#0c7b93",
      fontWeight: "normal",
      display: "flex",
      alignItems: "center",
      marginTop: 3,
    },
    selected: {
      "& span": {
        display: "none",
      },
    },
  }));

  const classes = useStyles();
  const [canAdd, setCanAdd] = useState(false);
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    const isEqualLength =
      Object.keys(componentData).length === Object.values(componentData).length;
    const hasNoEmptyValue = !Object.values(componentData).find((val) => !val);
    const hasUnallocatedTableColumns =
      tableColumns?.length > Object.keys(componentData).length;
    const check =
      isEqualLength && hasNoEmptyValue && hasUnallocatedTableColumns;
    setCanAdd(check);
  }, [componentData]);

  const _addPair = () => {
    updateComponentData({ ...componentData, choose: null });
    setCanAdd(false);
  };

  return (
    <div className={classes.sectionEntry}>
      <div className={classes.mappingFields}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography
              gutterBottom
              className={classes.sectionTitle}
              style={{ color: "#666666", marginBottom: 0, lineHeight: 1 }}
            >
              Map table columns to data source columns:
            </Typography>
            <div
              style={{
                fontSize: "0.9em",
                color: "#aaa",
                fontWeight: "normal",
              }}
            >
              {/* Only form inputs with set Name attribute in UI Editor appear here */}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
          <div className={classes.mappingTitle}>
            <Typography gutterBottom style={{ fontSize: 12, color: "#f7a712" }}>
              Table columns
            </Typography>
            <SwapHoriz />
          </div>
          <Typography gutterBottom className={classes.mappingTitle}>
            Data source columns/fields
          </Typography>
        </div>

        {(Object.keys(componentData).length
          ? Object.keys(componentData)
          : [null]
        )?.map((key, index) => (
          <DataMappingPair
            key={index}
            pair={{ [key]: componentData[key] }}
            pairsList={componentData}
            setPairsList={updateComponentData}
            valuesData={getDataColumns()}
            tableColumns={tableColumns}
            counter={counter}
            MenuItems={MenuItems}
          />
        ))}

        <IconButton
          onClick={_addPair}
          aria-label="Add pair"
          size="small"
          className={classes.addMatch}
          // disabled={ !canAdd || (counter <= mappingPairs.length) }
          disabled={!canAdd}
        >
          <Add style={{ fontSize: 20 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default DataMappingBox;
