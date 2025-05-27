import React, { useState } from "react";
import { Collapse, Typography } from "@material-ui/core";
import UseStaticData from "../UseStaticData";

const OptionsSelectionSection = React.memo(
  ({ title, itemType, values, dataType, updateData }) => {
    const [showPreferences, setShowPreferences] = useState(false);

    return (
      <div className="sidebar-section">
        <div
          className="sidebar-section-header"
          onClick={() => setShowPreferences((prev) => !prev)}
        >
          <Typography>{title} options</Typography>
          <span>{`[${showPreferences ? "-" : "+"}]`}</span>
        </div>

        <Collapse in={showPreferences}>
          <UseStaticData
            dataType={dataType}
            itemType={itemType}
            updateData={updateData}
            values={values}
            options={values?.options}
            useValuesAttribute={values?.useValuesAttribute}
          />
        </Collapse>
      </div>
    );
  }
);
export default OptionsSelectionSection;
