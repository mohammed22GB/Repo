import React, { useEffect, useState } from "react";
import { Collapse, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import UseStaticData from "../UseStaticData";
import { updateScreenItemPropertyValues } from "../../../../utils/uieditorHelpers";
import { errorToastify } from "../../../../../../../common/utils/Toastify";

const TableColumnsPreferences = React.memo(
  ({ itemType, itemRef, values, title, dataType, updateData }) => {
    const [showPreferences, setShowPreferences] = useState(false);
    const dispatch = useDispatch();

    const onValuesChange = ({ value, property }) => {
      const columnNames = value.map((col) => col.dataText);
      if (columnNames.length !== new Set(columnNames).size) {
        errorToastify("Column names must be unique");
        return;
      }

      dispatch(
        updateScreenItemPropertyValues({
          value,
          property,
          itemRef,
        })
      );
    };

    return (
      <div className="sidebar-section">
        <div
          className="sidebar-section-header"
          onClick={() => setShowPreferences((prev) => !prev)}
        >
          <Typography>{title} columns</Typography>
          <span>{`[${showPreferences ? "-" : "+"}]`}</span>
        </div>

        <Collapse in={showPreferences}>
          <UseStaticData
            dataType={dataType}
            itemType={itemType}
            updateData={updateData}
            values={values}
            options={values?.columns}
            useValuesAttribute={values?.useValuesAttribute}
          />
        </Collapse>
      </div>
    );
  }
);
export default TableColumnsPreferences;
