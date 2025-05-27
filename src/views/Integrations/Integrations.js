import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector, connect, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  makeStyles,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import DynamicFeed from "@material-ui/icons/DynamicFeed";
import Block from "@material-ui/icons/Block";
import WarningRounded from "@material-ui/icons/WarningRounded";

import { useStyles } from "./utils/IntegrationsStyle";
import IntegrationsRightPanel from "./components/IntegrationsRightPanel";
import mysql_logo from "../../assets/images/mysql.png";
import mongodb_logo from "../../assets/images/mongodb.png";
import docusign_logo from "../../assets/images/docusign.png";
import azureSql_logo from "../../assets/images/azureSql.png";
import oracle_logo from "../../assets/images/oracle.png";
import api_logo from "../../assets/images/restapi.png";
import google_sheet_logo from "../../assets/images/google_sheet.png";
import paystack_logo from "../../assets/images/paystack.png";
import gmail_logo from "../../assets/images/gmail.png";
import gdrive_logo from "../../assets/images/googledrive.png";
import sendgrid_logo from "../../assets/images/sendgrid.png";
import { Tooltip } from "@mui/material";
import {
  deleteIntegrationAPI,
  getIntegrationDataAPI,
  updateIntegrationAPI,
} from "./utils/integrationsAPIs";
import { SET_EDIT_INTEGRATION_FLAG } from "../../store/actions/integrationActions";
import { INTEGRATIONS_WITHOUT_RESOURCES } from "./utils/integrationsWithoutResources";
import { errorToastify, successToastify } from "../common/utils/Toastify";
import MainPageLayout from "../common/components/AppLayout/MainPageLayout";
import { mainNavigationListNames } from "../common/utils/lists";

const Integrations = () => {
  const classes = useStyles(makeStyles);

  const [isLoading, setIsLoading] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  /**
   * @type {[ Plug.Integration, React.Dispatch<React.SetStateAction<Plug.Integration> ]}
   */
  const [anchorData, setAnchorData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rawIntegrations, setRawIntegrations] = useState([]);
  const [integrationsList, setIntegrationsList] = useState([]);
  const [groupDialogIndex, setGroupDialogIndex] = useState(null);
  const [groupDialogData, setGroupDialogData] = useState(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [panelUpdateData, setPanelUpdateData] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const queries = location.search;

  const progress = new URLSearchParams(queries).get("progress");
  const type = new URLSearchParams(queries).get("type");
  const iid = new URLSearchParams(queries).get("iid");

  const { pageSearchText } = useSelector(({ reducers }) => reducers);
  const [unfilteredData, setUnfilteredData] = useState({ meta: {}, data: [] });
  const [filters, setFilters] = useState({
    status: "All",
    //app: "All",
    category: "All",
    search: "",
    sortBy: "Modified",
  });
  const statuses = [
    ["All", "All Status"],
    ["completed", "Completed"],
    ["in-progress", "In Progress"],
    ["pending", "Pending"],
    ["stopped", "Stopped"],
  ];

  const categories = [["All", "All Categories"]];
  const sortBy = [["Modified", "Last modified"]];

  let filter1 = [
    {
      key: "status",
      status: filters.status,
      options: statuses,
    },
    // {
    //   key: "app",
    //   app: filters.app,
    //   options: apps,
    // },
    {
      key: "category",
      category: filters.category,
      options: categories,
    },
  ];
  const filter2 = [
    {
      key: "sortBy",
      sortBy: filters.sortBy,
      options: sortBy,
    },
  ];
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    handleSearchChange(pageSearchText);
  }, [pageSearchText]);

  const handleSearchChange = (input) => {
    const rows = !!input
      ? unfilteredData?.data?.filter(
          (row) =>
            row?.app?.name.toLowerCase().includes(input.toLowerCase()) ||
            row?.app?.category?.name
              .toLowerCase()
              .includes(input.toLowerCase()) ||
            row?.user?.firstName.toLowerCase().includes(input.toLowerCase()) ||
            row?.user?.lastName.toLowerCase().includes(input.toLowerCase()) ||
            row?.status?.toLowerCase().includes(input.toLowerCase())
        )
      : unfilteredData?.data;
    setFilteredData(rows);
  };

  useEffect(() => {
    document.title = "Integrations";

    //  get all integrations for account
    const getIntegrations = async () => {
      setIsLoading(true);
      const options = {
        query: {
          // active: true,
          per_page: 1000,
        },
      };
      const integrations = await getIntegrationDataAPI(options);
      if (integrations?._meta?.success) {
        const _list = integrations.data;
        setRawIntegrations(_list);
      } else {
        errorToastify("Sorry an error occured while loading your Integrations");
      }
      setIsLoading(false);
    };

    getIntegrations();
  }, []);

  useEffect(() => {
    if (rawIntegrations.length) {
      batchIntegrations(rawIntegrations);

      if (iid) {
        const intg = rawIntegrations.find((intg) => intg.id === iid);
        dispatch({ type: SET_EDIT_INTEGRATION_FLAG, payload: true });

        setPanelUpdateData(intg);
        handleMenuClose();
        setShowRightPanel(true);
        handleGroupDialogClose();
      }
    }
  }, [progress, type, iid, rawIntegrations]);

  const batchIntegrations = (list) => {
    /**
     * @type {Record<string, { group: string, groupName: string, units: Plug.Integration[], }>}
     */
    const batchedMap = {};

    list.forEach((item) => {
      const group = item?.properties?.type;

      if (!batchedMap[group]) {
        const integration = iList.find((intg) => intg.type === group);

        batchedMap[group] = {
          group,
          units: [],
          groupName: integration ? integration.name : group,
        };
      }

      batchedMap[group].units.push(item);
    });

    const batched = Object.values(batchedMap).sort((a, b) => {
      return a.groupName.localeCompare(b.groupName);
    });

    setIntegrationsList(batched);

    if (groupDialogIndex !== null) {
      setGroupDialogData(batched[groupDialogIndex]);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "MySQL":
        return mysql_logo;
      case "MongoDB":
        return mongodb_logo;
      case "Google Sheet":
        return google_sheet_logo;
      case "Paystack":
        return paystack_logo;
      case "Google Mail":
        return gmail_logo;
      case "Google Drive":
        return gdrive_logo;
      case "SendGrid":
        return sendgrid_logo;
      case "DocuSign":
        return docusign_logo;
      case "AzureDB":
        return azureSql_logo;
      case "OracleDB":
        return oracle_logo;
      case "RestApiIntegration":
        return api_logo;

      default:
        break;
    }
  };

  const iList = [
    {
      name: "DocuSign",
      type: "DocuSign",
      logo: getIcon("DocuSign"),
    },
    {
      name: "Gmail",
      type: "Google Mail",
      logo: getIcon("Google Mail"),
    },
    {
      name: "Google Drive",
      type: "Google Drive",
      logo: getIcon("Google Drive"),
    },
    {
      name: "SendGrid",
      type: "SendGrid",
      logo: getIcon("SendGrid"),
    },
    {
      name: "Google Sheet",
      type: "Google Sheet",
      logo: getIcon("Google Sheet"),
    },
    {
      name: "AzureDB",
      type: "AzureDB",
      logo: getIcon("AzureDB"),
    },
    {
      name: "OracleDB",
      type: "OracleDB",
      logo: getIcon("OracleDB"),
    },
    {
      name: "MongoDB",
      type: "MongoDB",
      logo: getIcon("MongoDB"),
    },
    {
      name: "MySQL",
      type: "MySQL",
      logo: getIcon("MySQL"),
    },
    {
      name: "Paystack",
      type: "Paystack",
      logo: getIcon("Paystack"),
    },
    {
      name: "REST API",
      type: "RestApiIntegration",
      logo: getIcon("RestApiIntegration"),
    },
  ];

  const updateList = (data, del) => {
    const list = [...rawIntegrations];
    const found = list.findIndex((l) => l.id === data.id);
    if (found === -1) {
      list.unshift(data);
    } else {
      if (del) {
        list.splice(found, 1);
      } else {
        list[found] = data;
      }
    }

    setRawIntegrations(list);
  };

  const handleMenuOpen = (event, dat) => {
    setAnchorData(dat);
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setAnchorEl(null);
    setAnchorData(null);
  };

  const handleGroupDialogOpen = (indx) => {
    setGroupDialogIndex(indx);
    setGroupDialogData(integrationsList[indx]);
    setShowGroupDialog(true);
  };

  const handleGroupDialogClose = () => {
    setGroupDialogIndex(null);
    setGroupDialogData(null);
    setShowGroupDialog(false);
  };

  const handleEnableDisable = async () => {
    const data = { ...anchorData };
    try {
      const sendUpdate = await updateIntegrationAPI({
        id: data.id,
        data: { disabled: !anchorData.disabled },
      });
      if (sendUpdate?._meta?.success) {
        successToastify(sendUpdate?._meta?.message);
        data.disabled = !anchorData.disabled;
        updateList(data);
      } else {
        errorToastify(sendUpdate?._meta?.message);
      }
    } catch (e) {
      errorToastify(e.response?.data?._meta?.error?.message);
    }
  };

  const handleRemove = async () => {
    const conf = window?.confirm(
      `Remove the ${anchorData?.properties?.type} integration (${anchorData.name})?`
    );
    if (!conf) {
      return;
    }

    const data = { ...anchorData };
    try {
      const sendUpdate = await deleteIntegrationAPI({ id: data.id });
      if (sendUpdate?._meta?.success) {
        successToastify(sendUpdate?._meta?.message);
        data.disabled = !anchorData.disabled;
        updateList(data, "del");
      } else {
        errorToastify(sendUpdate?._meta?.message);
      }
    } catch (e) {
      errorToastify(e.response?.data?._meta?.error?.message);
    }
  };

  const handleEditIntegration = () => {
    dispatch({ type: SET_EDIT_INTEGRATION_FLAG, payload: true });

    setPanelUpdateData(anchorData);
    handleMenuClose();
    setShowRightPanel(true);
    handleGroupDialogClose();
  };

  const handleReconnectIntegration = async () => {
    const { name, type, group, properties, id } = anchorData;

    const data = {
      name,
      type,
      group,
      reconnect: true,
      email: properties?.userInfo?.email,
      redirectUrl: `${process.env.REACT_APP_BASE_URL}/integrations`,
      properties: {
        type: properties.type,
      },
    };

    const sendData = await updateIntegrationAPI({
      id,
      data,
    }).catch((e) => {
      errorToastify(e.response?.data?._meta?.error?.message || e.message);
    });

    if (sendData?.data?.redirect) {
      //  redirect to google consent page
      window.location.href = sendData?.data?.redirect;
    }
  };

  const MenuList = () => (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={"entity-menu"}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        button
        onClick={() => handleEditIntegration()}
        title={"editBtn"}
        style={{ fontWeight: 300, lineHeight: "19px" }}
      >
        Edit
      </MenuItem>
      <MenuItem
        button
        onClick={() => {
          handleEnableDisable();
          handleMenuClose();
          // handleGroupDialogClose();
        }}
        style={{ fontWeight: 300, lineHeight: "19px" }}
        disabled={!isCompleteIntegration(anchorData?.properties)}
      >
        {anchorData?.disabled ? "Enable" : "Disable"}
      </MenuItem>
      <MenuItem
        button
        onClick={handleReconnectIntegration}
        title="reconnectBtn"
        style={{ fontWeight: 300, lineHeight: "19px" }}
      >
        Reconnect
      </MenuItem>
      <MenuItem
        button
        onClick={() => {
          handleMenuClose();
          handleRemove();
        }}
        style={{ fontWeight: 300, lineHeight: "19px" }}
      >
        Remove
      </MenuItem>
    </Menu>
  );

  const groupedDialog = () => (
    <Dialog
      open={showGroupDialog}
      onClose={handleGroupDialogClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          title={"groupedIntegrations"}
        >
          {`${groupDialogData?.groupName} Integrations`}
          <IconButton size="small" onClick={handleGroupDialogClose}>
            <Cancel style={{ fontSize: 20 }} />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div style={{ textAlign: "center" }}>
          {groupDialogData?.units.map((i, ind) => {
            return (
              <Tooltip
                key={ind}
                title={
                  !isCompleteIntegration(i.properties)
                    ? "Incomplete Integration"
                    : i.disabled
                    ? "Disabled"
                    : ""
                }
              >
                <div
                  data-testid={"IntegrationGroupItem"}
                  className={classes.unit}
                  onClick={(e) => handleMenuOpen(e, i)}
                >
                  <div style={{ position: "absolute", top: 2, right: 3 }}>
                    {!isCompleteIntegration(i.properties) ? (
                      <WarningRounded
                        style={{ color: "#ff942c", fontSize: 18 }}
                      />
                    ) : i.disabled ? (
                      <Block style={{ color: "#ff2a2a", fontSize: 18 }} />
                    ) : null}
                  </div>
                  <div style={{ paddingTop: 10 }}>
                    <img
                      src={getIcon(i.properties?.type)}
                      alt="Logo"
                      style={{
                        height: ["Google Mail", "Paystack"].includes(
                          i.properties?.type
                        )
                          ? 30
                          : ["MongoDB"].includes(i.properties?.type)
                          ? 40
                          : 35,
                      }}
                    />
                  </div>
                  <div className={classes.unitLabel}>{i.name}</div>
                </div>
              </Tooltip>
            );
          })}

          <div style={{ clear: "both" }} />
        </div>
      </DialogContent>
    </Dialog>
  );

  const isCompleteIntegration = (properties) => {
    if (
      !INTEGRATIONS_WITHOUT_RESOURCES.includes(properties?.type) &&
      !properties?.resources?.length
    ) {
      return false;
    }
    return true;
  };

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MainPageLayout
        headerTitle={mainNavigationListNames.INTEGRATIONS}
        pageTitle=""
        pageSubtitle="Connect systems and databases"
        appsControlMode={null}
        categories={null}
        isLoading={isLoading}
        handleChange={handleChange}
        /* topBar={
          <Button
            variant="outlined"
            style={{ textTransform: "capitalize", fontSize: 12 }}
            onClick={() => setShowRightPanel(true)}
          >
            Create New Integration
          </Button>
        } */
        onAddNew={{
          fn: () => setShowRightPanel(true),
          tooltip: "Add new integration",
        }}
      >
        <div
          style={{
            textAlign: "center",
            width: showRightPanel ? "58%" : "100%",
          }}
        >
          {integrationsList.map((i, ind) => (
            <Tooltip
              key={ind}
              title={
                i.units?.length > 1
                  ? "Grouped"
                  : !isCompleteIntegration(i.units[0].properties)
                  ? "Incomplete integration"
                  : i.units[0].disabled
                  ? "Disabled"
                  : ""
              }
            >
              <div
                data-testid={"integrationsItem"}
                className={classes.unit}
                onClick={
                  i.units?.length > 1
                    ? () => handleGroupDialogOpen(ind)
                    : (e) => handleMenuOpen(e, i.units[0])
                }
              >
                <div style={{ position: "absolute", top: 2, right: 3 }}>
                  {i.units?.length > 1 ? (
                    <DynamicFeed style={{ color: "#666666", fontSize: 18 }} />
                  ) : !isCompleteIntegration(i.units[0].properties) ? (
                    <WarningRounded
                      style={{ color: "#ff942c", fontSize: 18 }}
                    />
                  ) : i.units[0].disabled ? (
                    // <span>hello</span>
                    <Block style={{ color: "#ff2a2a", fontSize: 18 }} />
                  ) : null}
                </div>
                <div style={{ paddingTop: 10 }}>
                  <img
                    src={getIcon(i.units[0]?.properties?.type)}
                    alt="Logo"
                    style={{
                      height: ["Google Mail", "Paystack"].includes(
                        i.units[0]?.properties?.type
                      )
                        ? 30
                        : ["MongoDB"].includes(i.units[0]?.properties?.type)
                        ? 40
                        : 35,
                    }}
                  />
                </div>
                <div className={classes.unitLabel}>
                  {i.units?.length > 1
                    ? `[ ${
                        iList.find(
                          (intg) => intg.type === i.units[0]?.properties?.type
                        )?.name
                      }... ]`
                    : i.units[0].name}
                </div>
              </div>
            </Tooltip>
          ))}

          <div style={{ clear: "both" }} />
        </div>
      </MainPageLayout>

      <IntegrationsRightPanel
        showRightPanel={showRightPanel}
        setShowRightPanel={setShowRightPanel}
        iList={iList}
        updatedData={panelUpdateData}
        setUpdatedData={setPanelUpdateData}
        updateList={updateList}
        rawIntegrations={rawIntegrations}
        progress={progress}
      />
      <MenuList />
      {groupedDialog()}
    </>
  );
};

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError,
  };
}

Integrations.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
export default connect(mapStateToProps)(Integrations);
