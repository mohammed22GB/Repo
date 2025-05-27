import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";
import { useStyles } from "../utils/IntegrationsPanelStyle";
import InitIntegrationPanel from "./IntegrationFlowPanels/InitIntegrationPanel";
import MySqlIntegrationPanel from "./IntegrationFlowPanels/MySqlIntegrationPanel";
import MongoDBIntegrationPanel from "./IntegrationFlowPanels/MongoDBIntegrationPanel";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import SheetIntegrationPanel from "./IntegrationFlowPanels/SheetIntegrationPanel";
import PaystackIntegrationPanel from "./IntegrationFlowPanels/PaystackIntegrationPanel";
import DocuSignIntegrationPanel from "./IntegrationFlowPanels/DocuSignIntegrationPanel";
import SendGridIntegrationPanel from "./IntegrationFlowPanels/SendGridIntegration";
import GMailIntegrationPanel from "./IntegrationFlowPanels/GMailIntegrationPanel";
import OracleDBIntegrationPanel from "./IntegrationFlowPanels/OracleDBIntegration";
import APIIntegrationPanel from "./IntegrationFlowPanels/ApiIntegrationPanel";
import AzureDBIntegrationPanel from "./IntegrationFlowPanels/AzureDBIntegration";
import GoogleDriveIntegrationPanel from "./IntegrationFlowPanels/GoogleDriveIntegrationPanel";

const IntegrationsRightPanel = ({
  showRightPanel,
  setShowRightPanel,
  iList,
  updatedData,
  setUpdatedData,
  updateList,
  rawIntegrations,
  progress,
}) => {
  // assigning classess to use
  const classes = useStyles(makeStyles);

  const [integrationPage, setIntegrationPage] = useState("");
  // const [showPanel, setShowPanel] = useState(true);
  useEffect(() => {
    if (!updatedData) return;
    setIntegrationPage(updatedData.properties.type);
  }, [updatedData]);

  const changeIntegrationPage = (intg) => {
    setIntegrationPage(intg.type);
    setUpdatedData(null);
  };

  const ToggleBtn = () => (
    <div
      className={classes.toggleBtn}
      onClick={() => setShowRightPanel(!showRightPanel)}
    >
      {showRightPanel && <ChevronRight style={{ fontSize: 18 }} />}
      {!showRightPanel && <ChevronLeft style={{ fontSize: 18 }} />}
    </div>
  );

  const filterRawIntegrations = () => {
    const filtered =
      rawIntegrations
        .filter((intg) => intg.properties?.type === integrationPage)
        .map((intg) => intg.properties?.userInfo) || [];

    return [...new Set(filtered)];
  };

  const getIntegrationPage = () => {
    switch (integrationPage) {
      case "MySQL":
        return (
          <MySqlIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
          />
        );

      case "MongoDB":
        return (
          <MongoDBIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
          />
        );

      case "Google Sheet":
        return (
          <SheetIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
            integrations={rawIntegrations}
          />
        );
      case "AzureDB":
        return (
          <AzureDBIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
            integrations={rawIntegrations}
            type={"DatabaseIntegration"}
            propertyType={integrationPage}
          />
        );
      case "RestApiIntegration":
        return (
          <APIIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
            integrations={rawIntegrations}
            type={"RestApiIntegration"}
            propertyType={integrationPage}
            progress={progress}
          />
        );
      case "OracleDB":
        return (
          <OracleDBIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
            integrations={rawIntegrations}
            type={"DatabaseIntegration"}
            propertyType={integrationPage}
          />
        );

      case "Google Mail":
        return (
          <GMailIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
            integrations={rawIntegrations}
          />
        );

      case "Google Drive":
        return (
          <GoogleDriveIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
            integrations={rawIntegrations}
          />
        );

      case "Paystack":
        return (
          <PaystackIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
          />
        );

      case "DocuSign":
        return (
          <DocuSignIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
            docusignIntegrationAccounts={filterRawIntegrations()}
          />
        );

      case "SendGrid":
        return (
          <SendGridIntegrationPanel
            changeIntegrationPage={changeIntegrationPage}
            updatedData={updatedData}
            updateList={updateList}
          />
        );

      default:
        return (
          <InitIntegrationPanel
            iList={iList}
            changeIntegrationPage={changeIntegrationPage}
            ToggleBtn={ToggleBtn}
          />
        );
    }
  };

  return (
    <Slide direction="left" in={showRightPanel} mountOnEnter unmountOnExit>
      <div>{getIntegrationPage()}</div>
    </Slide>
  );
};

export default withRouter(IntegrationsRightPanel);
