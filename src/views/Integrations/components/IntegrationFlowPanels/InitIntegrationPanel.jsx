import { makeStyles } from "@material-ui/core";

import { useStyles } from "../../utils/IntegrationsPanelStyle";

const InitIntegrationPanel = ({ iList, changeIntegrationPage, ToggleBtn }) => {
  const classes = useStyles(makeStyles);

  return (
    <div className={classes.sideFlowDialogContainer}>
      <ToggleBtn />
      <div className={classes.sideDialogTitleWrapper}>Create new</div>
      <div
        style={{
          padding: "0 6.5%",
          paddingTop: 20,
          display: "flex",
          flexWrap: "wrap",
          rowGap: 10,
        }}
      >
        {iList.map((intg, ind) => (
          <div
            className={classes.addUnit}
            key={ind}
            onClick={() => changeIntegrationPage(intg)}
          >
            <img
              src={intg.logo}
              alt={intg.name}
              style={{
                padding: ["GMail", "Paystack"].includes(intg.name)
                  ? 12.5
                  : ["MongoDB"].includes(intg.name)
                  ? 7.5
                  : 10,
              }}
            />
            <div>{intg.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InitIntegrationPanel;
