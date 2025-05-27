import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Typography,
  Select,
  MenuItem,
  Collapse,
} from "@material-ui/core";
import {
  ErrorOutlineOutlined,
  CheckCircleOutlineOutlined,
  SwapHoriz,
} from "@material-ui/icons";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import MyWindowsDimensions from "../../../../../utils/windowsDimension";
import MailActions from "./sidebarActions/MailActions";
import VariablesMenuItems from "../../../utils/VariablesMenuItems";
import DataMatchingPair from "./sidebarActions/common/DataMatchingPair";
import SelectOnSteroids from "./sidebarActions/common/SelectOnSteroids";
import { NameDescription } from "./sidebarActions/common/NameDescription";
import {
  getTaskVariables,
  globalSetTaskInfo,
  isConnectedTo,
} from "../../utils/workflowFuncs";
import FolderStructureDialog from "./sidebarActions/FolderStructureDialog";
import useCustomMutation from "../../../../../../common/utils/CustomMutation";
import {
  getDocusignUserIntegrationsAPI,
  getUserDocumentsAPI,
  getUserRecipientsAPI,
  getUserTabsAPI,
  getUserTemplatesAPI,
  requestUrlForDocuSignAPI,
} from "../../../../../../common/utils/docuSignAPIConnect";
import useCustomQuery from "../../../../../../common/utils/CustomQuery";
import { fetchGoogleDriveFolderContents } from "../../../../../../common/utils/googleAPIConnect";
import ExecutionVariables from "./Helpers/ExecutionVariables";

const useStyles = makeStyles((theme) => ({
  sideHeading: {
    color: "#091540",
    // fontWeight: 600,
    fontSize: 11,
    paddingLeft: 10,
    paddingTop: 10,
    textTransform: "capitalize",
    display: "inline-flex",
    alignItems: "center",
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  section: {
    padding: 10,
    paddingBottom: 20,
    // marginBottom: 100,
  },
  container: {
    overflow: "hidden",
    height: "100%",
    "&:hover": {
      overflow: "overlay",
    },
  },
  actionsListItem: {
    width: "30%",
    height: 80,
    margin: 5,
    display: "inline-block",
    textAlign: "center",
    backgroundColor: "white",
    border: "solid 1px white",
    boxShadow: "1px 1px 3px #ccc",
    borderRadius: 10,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#fafafa",
      border: "solid 1px #eaeaea",
      boxShadow: "none",
      color: "#1846c8",
    },
  },
  closeIcon: {
    fontSize: 16,
    color: "#AAAAAA",
    marginRight: 10,
    cursor: "pointer",
    "&:hover": {
      color: "#091540",
    },
  },
  sectionTitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    color: "#091540",
    fontSize: 12,
    marginBottom: 12,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
  },
  switchLabel: {
    width: "100%",
    justifyContent: "space-between",
    margin: 0,
  },
  matchingFields: {
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
  pair: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    "& > div, & > p": {
      flex: 1,
      "&:first-child": {
        marginRight: 5,
      },
    },
  },
  multiSelect: {
    display: "flex",
    flexWrap: "wrap",
  },
  selectedFields: {
    backgroundColor: "#f8f8f8",
    marginRight: 5,
    marginBottom: 5,
    padding: 5,
    border: "dashed 1px #999",
    borderRadius: 8,
    color: "#888",
  },
  sideHeadingBar: {
    backgroundColor: "#f8f8f8",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    height: 29,
    "&:hover": {
      opacity: 0.7,
    },
  },
  sectionEntry: {
    marginBottom: 13,
  },
  addMatch: {
    fontSize: 20,
    boxShadow: "0px 2px 3px #aaa",
    borderRadius: "14%",
    marginTop: 10,
  },
  googleConnect: {
    fontSize: 13,
    margin: "0 8px 16px 0",
    backgroundColor: "#d1241c",
    color: "#ffffff",
    textTransform: "none",
    borderRadius: 3,
  },
  dateTimeFields: {
    display: "flex",
    justifyContent: "space-between",
    "& > div": {
      width: "48%",
    },
  },
}));

const DocumentTaskSidebar = ({
  activeTaskId,
  workflowTasks,
  workflowCanvas,
  allVariables,
  dispatch,
  integrations,
  resources,
  activeTaskType,
}) => {
  const activeTask = workflowTasks[activeTaskId];
  const variables = getTaskVariables(activeTaskId, allVariables);

  const classes = useStyles();
  const [windowDimensions, setWindowDimensions] = useState({});
  const [properties, setProperties] = useState(activeTask?.properties || {});
  const [showSection, setShowSection] = useState({
    settings: true,
    action: false,
  });
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [settingsComplete, setSettingsComplete] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);
  const [fetchConnectionsLoading, setFetchConnectionsLoading] = useState(false);
  const [fetchTemplatesLoading, setFetchTemplatesLoading] = useState(false);
  const [fetchDocumentsLoading, setFetchDocumentsLoading] = useState(false);
  const [docuSignConnections, setDocuSignConnections] = useState([]);
  const [templatesList, setTemplatesList] = useState([]);
  const [loadDTOptions, setLoadDTOptions] = useState({});
  const [documentsList, setDocumentsList] = useState([]);
  const [recipientsList, setRecipientsList] = useState([]);
  const [loadTDOptions, setLoadTDOptions] = useState({});
  const [tabsList, setTabsList] = useState([]);
  const [loadTDTOptions, setLoadTDTOptions] = useState({});
  const [matchingPairs, setMatchingPairs] = useState([{}]);
  const [nodeIsConnectedToAny, setNodeIsConnectedToAny] = useState(false);
  const [nodeIsConnectedToStart, setNodeIsConnectedToStart] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [folderSelection, setFolderSelection] = useState(
    properties?.documentPath
  );
  const [resourcesList, setResourcesList] = useState([]);
  const [foldersList, setFoldersList] = useState([]);
  const [initialFoldersIdList, setInitialFoldersIdList] = useState([]);
  const [currentPath, setCurrentPath] = useState(
    properties?.documentPath || "/"
  );
  const [showNewFolder, setShowNewFolder] = useState(
    properties?.documentIsNewFolder
  );
  const [showUploadDocumentsSection, setShowUploadDocumentsSection] =
    useState(false);
  const [showChooseFolderSection, setShowChooseFolderSection] = useState(false);
  const [showNewFolderSection, setShowNewFolderSection] = useState(false);
  const [isFolderContentLoading, setIsFolderContentLoading] = useState(false);
  const reverseMatchingRows = false;

  useEffect(() => {
    setFetchConnectionsLoading(true);
    // fetchDocuSignConnections();
  }, []);

  useEffect(() => {
    if (
      !!activeTask?.properties?.docusignAccountId &&
      !!docuSignConnections?.length
    ) {
      const { email, account_id } =
        docuSignConnections.find(
          (d) => d.account_id === activeTask?.properties?.docusignAccountId
        ) || {};

      !!account_id &&
        setLoadDTOptions({
          param: {
            email,
            account_id,
          },
        });
    }
  }, [activeTask?.properties?.docusignAccountId, docuSignConnections]);

  useEffect(() => {
    if (!!activeTask?.properties?.templateId && !!templatesList?.length) {
      const { email, account_id } =
        docuSignConnections.find(
          (d) => d.account_id === activeTask?.properties?.docusignAccountId
        ) || {};

      !!account_id &&
        setLoadTDOptions({
          param: {
            email,
            account_id,
            templateId: activeTask?.properties?.templateId,
          },
        });
    }
  }, [activeTask?.properties?.templateId, templatesList]);

  useEffect(() => {
    if (!!activeTask?.properties?.documentId && !!documentsList?.length) {
      const { email, account_id } =
        docuSignConnections.find(
          (d) => d.account_id === activeTask?.properties?.docusignAccountId
        ) || {};

      !!account_id &&
        setLoadTDTOptions({
          param: {
            email,
            account_id,
            templateId: activeTask?.properties?.templateId,
            documentId: activeTask?.properties?.documentId,
          },
        });
    }
  }, [activeTask?.properties?.documentId, documentsList]);

  useEffect(() => {
    setProperties({ ...activeTask?.properties });
    checkSetupStatus(activeTask);
  }, [activeTask]);

  useEffect(() => {
    const resources_ =
      integrations?.document?.[properties?.integration]?.resources;

    const resources = Object.values(resources_ || {});
    setResourcesList(resources);
    setFoldersList(resources);
  }, [properties?.integration, integrations]);

  useEffect(() => {
    const isConnectedToAnySource = isConnectedTo(
      activeTaskId,
      workflowCanvas,
      "anyNode"
    );
    const isConnectedToStartNode = isConnectedTo(
      activeTaskId,
      workflowCanvas,
      "startNode"
    );
    setNodeIsConnectedToAny(isConnectedToAnySource);
    setNodeIsConnectedToStart(isConnectedToStartNode);
  }, [workflowCanvas, activeTask]);

  useEffect(() => {
    const ttype = integrations?.document?.[properties?.integration]?.type;
    setShowUploadDocumentsSection(
      ttype === "Google Drive" && properties?.documentAction === "upload"
    );
    setShowNewFolderSection(
      ttype === "Google Drive" &&
        properties?.documentAction === "upload" &&
        showNewFolder
    );
  }, [properties, showNewFolder]);
  useEffect(() => {
    const ttype = integrations?.document?.[properties?.integration]?.type;
    setShowChooseFolderSection(
      ttype === "Google Drive" && !!properties?.documentAction
    );
  }, [properties]);

  const _toggleSection = (e, sect) => {
    e && e.stopPropagation();

    const makeTrue = !showSection[sect];
    const showSection_ = { ...showSection };
    Object.keys(showSection_).forEach((p) => (showSection_[p] = false));
    if (makeTrue) showSection_[sect] = true;
    setShowSection(showSection_);
  };

  const _setTaskInfo = (e, ppty, isGrouped) => {
    !!e.persist && e.persist();

    globalSetTaskInfo(
      dispatch,
      e,
      ppty,
      isGrouped,
      activeTask,
      setTaskUpdated,
      [],
      checkSetupStatus
    );
  };

  const checkSetupStatus = (info, auto) => {
    // auto && _toggleSection(null, 'action');
    let sC, aC;

    if (!!info?.name) {
      sC = true;
      setSettingsComplete(true);
    } else {
      sC = false;
      setSettingsComplete(false);
    }

    const documentType = info?.properties?.integrationType;
    const docusignComplete =
      !!info?.properties?.docusignapi &&
      !!info?.properties?.docusignAccountId &&
      !!info?.properties?.templateId &&
      !!info?.properties?.documentId &&
      recipientsList?.length === info?.properties?.recipients?.length;
    const gdriveComplete =
      documentType === "Google Drive" &&
      !!info?.properties?.documentAction &&
      !!info?.properties?.documentsToUpload &&
      !!info?.properties?.documentPath;

    if (docusignComplete || gdriveComplete) {
      aC = true;
      setActionComplete(true);
    } else {
      aC = false;
      setActionComplete(false);
    }

    return sC && aC;
  };

  const { mutate: fetchDocuSignConnections } = useCustomMutation({
    apiFunc: getDocusignUserIntegrationsAPI,
    onSuccess: ({ data }) => {
      const conns = data.data;
      const connections = [];

      conns.forEach((cc) => {
        const { userInfo } = cc;
        userInfo.accounts.forEach((ac) => {
          connections.push({
            email: userInfo.email,
            name: userInfo.name,
            account_id: ac.account_id,
            account_name: ac.account_name,
            docusignapi: cc._id,
          });
        });
      });

      // _preSetTaskInfo(conns._id, "docusignapi");
      setDocuSignConnections(connections);
      setFetchConnectionsLoading(false);
    },
    retries: 0,
  });

  const { mutate: handleDocuSignConnect } = useCustomMutation({
    apiFunc: requestUrlForDocuSignAPI,
    onSuccess: ({ data }) => {
      const url = data?.data?.url;
      window.location.href = decodeURIComponent(decodeURIComponent(url));
    },
    retries: 0,
  });

  //  fetch account templates
  const { isDTLoading, isDTFetching } = useCustomQuery({
    queryKey: ["userDocuSignTemplates", loadDTOptions],
    apiFunc: getUserTemplatesAPI,
    onSuccess: ({ data }) => {
      // window.location.href = url;
      const tList =
        data?.data?.map((r) => {
          return { templateId: r.templateId, name: r.name || "[ Template ]" };
        }) || [];

      setTemplatesList(tList);
      setFetchTemplatesLoading(false);
    },
    onError: ({ data }) => {
      //  if authentication expired
      if (data?._meta?.error?.message === "invalid_grant") {
        _handleDocuSignConnect();
      }
    },
  });

  //  fetch template documents
  const { isTDLoading, isTDFetching } = useCustomQuery({
    queryKey: ["userDocuSignTemplates", loadTDOptions],
    apiFunc: getUserDocumentsAPI,
    onSuccess: ({ data }) => {
      const dList =
        data?.data?.map((r) => {
          return { documentId: r.documentId, name: r.name || "[ Document ]" };
        }) || [];
      // alert(JSON.stringify(cList))
      setDocumentsList(dList);
      setFetchDocumentsLoading(false);
    },
  });
  //  fetch template recipients
  const { isTRLoading, isTRFetching } = useCustomQuery({
    queryKey: ["userDocuSignRecipients", loadTDOptions],
    apiFunc: getUserRecipientsAPI,
    onSuccess: ({ data }) => {
      const rList = data?.data;
      const recipients = [];
      Object.keys(rList).forEach((r) => {
        Array.isArray(rList[r]) && recipients.push(...rList[r]);
      });

      setRecipientsList(
        recipients?.map((r, i) => {
          return {
            orderOrder: i,
            recipientId: r.recipientId,
            recipientType: r.recipientType,
            roleName: r.roleName,
            routingOrder: r.routingOrder,
          };
        })
      );
      // setFetchDocumentsLoading(false);
    },
  });

  //  fetch documents tabs
  const { isTDTLoading, isTDTFetching } = useCustomQuery({
    queryKey: ["userDocuSignTabs", loadTDTOptions],
    apiFunc: getUserTabsAPI,
    onSuccess: ({ data }) => {
      const tList = data?.data;
      const tabs = [];

      Object.keys(tList).forEach((tab) => {
        tList[tab].forEach((t) => {
          tabs.push({
            tabType: tab,
            tabLabel: t.tabLabel,
            //  ...and for display purposes
            id: t.tabLabel,
            name: t.tabLabel,
          });
        });
      });

      setTabsList(tabs);
      // setFetchDocumentsLoading(false);
    },
  });

  const _handleDocuSignConnect = () => {
    const redirectUrl = {
      // "redirectUrl": "https://plug-dev.netlify.app/editor/workflow"
      redirectUrl: `${process.env.REACT_APP_BASE_URL}/editor/workflows`,
    };
    handleDocuSignConnect(redirectUrl);
  };

  const _preSetTaskInfo = (e, ppty, aux) => {
    if (ppty === "docusignAccountId") {
      if (e.target.value === "add") {
        _handleDocuSignConnect();
        return;
      } else {
        const api = docuSignConnections.find(
          (c) => c.account_id === e.target.value
        ).docusignapi;
        _setTaskInfo(api, "docusignapi");
      }
    } else if (ppty === "recipients") {
      const val = [
        ...(activeTask?.properties?.recipients ||
          new Array(recipientsList?.length).fill(null)),
      ];
      const ordr = recipientsList.find((r) => r.roleName === aux).orderOrder;
      const rordr = recipientsList.find((r) => r.roleName === aux).routingOrder;

      val[ordr] = {
        routingOrder: rordr,
        recipientName: e[0].name,
        recipientRoleName: aux,
        recipientEmail: e,
      };

      e = [...val];
    } else if (ppty === "integration") {
      _setTaskInfo(
        {
          integration: e.target.value,
          integrationType: integrations?.document?.[e.target.value]?.type,
          documentAction: null,
          documentPath: "",
          documentPathArray: [],
          documentIsNewFolder: false,
          documentNewFolder: [],
          documentsToUpload: [],
        },
        null,
        true
      );
      setFolderSelection("");
      setCurrentPath("/");
      clearFolderArgs();
      return;
    } else if (ppty === "documentAction") {
      _setTaskInfo(
        {
          documentAction: e.target.value,
          documentPath: "",
          documentPathArray: [],
          documentIsNewFolder: false,
          documentNewFolder: [],
          documentsToUpload: [],
        },
        null,
        true
      );
      setFolderSelection("");
      setCurrentPath("/");
      clearFolderArgs();
      return;
    }

    _setTaskInfo(e, ppty);
  };

  const _setMatchingPairs = (index, obj) => {
    const tabLabel = Object.keys(obj)[0];
    const value = obj[tabLabel];
    const tab = tabsList.find((t) => t.tabLabel === tabLabel);

    const valObj = {
      tabType: tab.tabType,
      tabLabel: tab.tabLabel,
      value,
    };

    const fromState = [...(activeTask?.properties?.customTabs || [])];
    fromState[index] = valObj;
    _setTaskInfo(fromState, "customTabs");
  };

  const MenuItems = () =>
    VariablesMenuItems({ variables, classes, workflowTasks });

  const _reformPairs = (plist) => {
    return plist?.map((pl) => {
      return {
        [pl.tabLabel]: pl.value,
      };
    });
  };

  const moreDocusignFields = () => (
    <div>
      <div className={classes.sectionEntry}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Select template*
        </Typography>
        <Select
          key={
            !!templatesList?.length
              ? activeTask?.properties?.templateId || "choose"
              : "choose"
          }
          disabled={!templatesList?.length}
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Select template"
          classes={{
            root: classes.select,
          }}
          defaultValue={
            !!templatesList?.length
              ? activeTask?.properties?.templateId || "choose"
              : "choose"
          }
          onChange={(e) => _preSetTaskInfo(e, "templateId")}
        >
          <MenuItem value="choose" disabled>
            {isDTLoading || isDTFetching
              ? "please wait..."
              : !!templatesList?.length
              ? "Select one"
              : "[ First select DocuSign account ]"}
          </MenuItem>
          {templatesList?.map((tp, indx) => (
            <MenuItem value={tp.templateId} key={indx}>
              {tp.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.sectionEntry}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Template document*
        </Typography>
        <Select
          key={
            !!documentsList?.length
              ? activeTask?.properties?.documentId || "choose"
              : "choose"
          }
          disabled={!documentsList?.length}
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Select template document"
          classes={{
            root: classes.select,
          }}
          defaultValue={
            !!documentsList?.length
              ? activeTask?.properties?.documentId || "choose"
              : "choose"
          }
          onChange={(e) => _preSetTaskInfo(e, "documentId")}
        >
          <MenuItem value="choose" disabled>
            {isTDLoading || isTDFetching
              ? "please wait..."
              : !!documentsList?.length
              ? "Select one"
              : "[ First select DocuSign account ]"}
          </MenuItem>
          {documentsList?.map((dc, indx) => (
            <MenuItem value={dc.documentId} key={indx}>
              {dc.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className={classes.sectionEntry}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Map document tabs
        </Typography>
        <div className={classes.matchingFields}>
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
                Map variables to document tabs:
              </Typography>
              <div
                style={{
                  fontSize: "0.9em",
                  color: "#aaa",
                  fontWeight: "normal",
                }}
              >
                Only form inputs with set Name attribute in UI Editor appear
                here
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: reverseMatchingRows ? "row-reverse" : "row",
              marginTop: 10,
            }}
          >
            <div className={classes.mappingTitle}>
              <Typography
                gutterBottom
                style={{ fontSize: 12, color: "#f7a712" }}
              >
                Variable
              </Typography>
              {!reverseMatchingRows && <SwapHoriz />}
            </div>
            <div className={classes.mappingTitle}>
              <Typography
                gutterBottom
                style={{ fontSize: 12, color: "#f7a712" }}
              >
                Document tab
              </Typography>
              {reverseMatchingRows && <SwapHoriz />}
            </div>
          </div>

          {tabsList?.map((value, index) => (
            <DataMatchingPair
              key={index}
              mapv={{ value, index }}
              valuesData={tabsList}
              pairsList={_reformPairs(activeTask?.properties?.customTabs || [])}
              setMatchingPairs={_setMatchingPairs}
              variables={variables}
              removePair={() => false}
              reverseRow={reverseMatchingRows}
              setCanAdd={() => {}}
              // MenuItems={MenuItems}
              counter={activeTask?.properties?.customTabs?.length || 1}
              selText="Tabs"
              fixed
            />
          ))}
        </div>
      </div>

      <div className={classes.sectionEntry}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Document recipients (in order)*
        </Typography>
        <div className={classes.matchingFields}>
          {recipientsList?.map((r, i) => (
            <div key={i} className={classes.sectionEntry}>
              <div style={{ marginBottom: 5 }}>
                {i + 1}. {r.roleName}{" "}
                <span
                  style={{
                    color: "#999",
                    textTransform: "capitalize",
                    fontStyle: "italic",
                  }}
                >
                  - {r.recipientType} {r.routingOrder}
                </span>
              </div>
              <SelectOnSteroids
                // disabled={!activeTask?.properties?.calendarId}
                source="email"
                variables={variables}
                onChange={(v) => _preSetTaskInfo(v, "recipients", r.roleName)}
                value={activeTask?.properties?.recipients?.[i]?.recipientEmail}
                type="email"
                multiple={false}
              />
            </div>
          ))}
        </div>
      </div>

      <MailActions
        show={true}
        setTaskInfo={_setTaskInfo}
        properties={activeTask?.properties}
        activeTask={activeTask}
        variables={variables}
        workflowTasks={workflowTasks}
        hideTarget
        hideCC
        hideFrom
        optionalSubject
        optionalBody
      />
    </div>
  );

  const saveFolderSelection = (pathName, passedFoldersIdList, isNew) => {
    setShowNewFolder(!!isNew);
    setFolderSelection(pathName);
    setIsFolderDialogOpen(false);
    _setTaskInfo(
      {
        documentPath: pathName,
        documentPathArray: passedFoldersIdList,
        documentIsNewFolder: !!isNew,
      },
      null,
      true
    );
  };

  const closeFolderDialog = () => {
    setIsFolderDialogOpen(false);

    clearFolderArgs();
  };

  const clearFolderArgs = () => {
    setFoldersList(resourcesList);
    setInitialFoldersIdList(properties?.documentPathArray || []); //          documentPathArray: passedFoldersIdList,
    setCurrentPath(properties?.documentPath || "/");
    setShowNewFolder(properties?.documentIsNewFolder);
    setIsFolderContentLoading(false);

    fetchFolderContents(
      properties?.documentPathArray?.[
        properties?.documentPathArray?.length - 1
      ],
      properties?.documentPath
    );
  };

  const fetchFolderContents = async (id, path) => {
    if (!id) {
      setFoldersList(resourcesList);
      setCurrentPath("/");
      return;
    }

    setIsFolderContentLoading(true);
    const contents = await fetchGoogleDriveFolderContents(
      properties?.integration,
      id,
      properties?.documentAction === "upload" ? "folders" : "all"
    );
    setIsFolderContentLoading(false);
    setFoldersList(contents.data);
    setCurrentPath(path);
  };

  return (
    <div className={classes.container}>
      <MyWindowsDimensions setWinDim={setWindowDimensions} />
      <div
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "settings")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          {activeTask?.type || ""} information
          {settingsComplete && (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          )}
          {!settingsComplete && (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
        {/* <Tooltip title="Close"><CancelIcon className={classes.closeIcon} onClick={cancelNewTask} /></Tooltip> */}
      </div>
      <Collapse in={!!showSection.settings}>
        <Divider style={{ marginBottom: 10 }} />
        <div className={classes.section}>
          <NameDescription
            activeTask={activeTask}
            _setTaskInfo={_setTaskInfo}
            nodeIsConnectedToAny={nodeIsConnectedToAny}
            nodeIsConnectedToStart={nodeIsConnectedToStart}
          />
        </div>

        <ExecutionVariables
          activeTask={activeTask}
          setTaskInfo={_setTaskInfo}
          activeTaskId={activeTaskId}
          variables={allVariables}
          classes={classes}
        />
      </Collapse>
      <Divider />
      <div
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "action")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          Action details
          {actionComplete && (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          )}
          {!actionComplete && (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
        {/* <Tooltip title="Close"><CancelIcon className={classes.closeIcon} onClick={cancelNewTask} /></Tooltip> */}
      </div>
      <Divider style={{ marginBottom: 10 }} />

      <Collapse in={!!showSection.action}>
        <div className={classes.section}>
          <div className={classes.sectionEntry}>
            <Typography gutterBottom className={classes.sectionTitle}>
              Select document integration*
            </Typography>
            <Select
              key={activeTask?.properties?.integration || "choose"}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Select form screen"
              classes={{
                root: classes.select,
              }}
              defaultValue={activeTask?.properties?.integration || "choose"}
              onChange={(e) => _preSetTaskInfo(e, "integration")}
            >
              <MenuItem value="choose" selected disabled>
                <em>
                  {Object.keys(integrations?.document || {})?.length
                    ? "Select one"
                    : "No Document integrations available"}
                </em>
              </MenuItem>
              {(Object.keys(integrations?.document || {}) || [])?.map(
                (intg) => (
                  <MenuItem value={intg} key={intg}>
                    {integrations?.document?.[intg]?.type}{" "}
                    <b>: {integrations?.document?.[intg]?.name}</b>
                  </MenuItem>
                )
              )}
            </Select>
          </div>

          <div className={classes.sectionEntry}>
            <Typography gutterBottom className={classes.sectionTitle}>
              Select action*
            </Typography>
            <Select
              key={activeTask?.properties?.documentAction || "choose"}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Select template"
              classes={{
                root: classes.select,
              }}
              defaultValue={activeTask?.properties?.documentAction || "choose"}
              onChange={(e) => _preSetTaskInfo(e, "documentAction")}
              disabled={!activeTask?.properties?.integration}
            >
              <MenuItem value="choose" disabled>
                Choose one
              </MenuItem>
              <MenuItem value="upload">Upload to folder</MenuItem>
              <MenuItem value="download">Pick file from folder</MenuItem>
            </Select>
          </div>

          <Collapse in={showUploadDocumentsSection}>
            <div className={classes.sectionEntry}>
              <Typography gutterBottom className={classes.sectionTitle}>
                Document(s) to upload*
              </Typography>
              <SelectOnSteroids
                source="variable"
                variables={variables}
                onChange={(e) => _setTaskInfo(e, "documentsToUpload")}
                value={activeTask?.properties?.documentsToUpload || "choose"}
                type="file"
                placeholderText="Select variables"
                variablesOnly
                multiple
              />
            </div>
          </Collapse>

          <Collapse in={showChooseFolderSection}>
            <div className={classes.sectionEntry}>
              <Typography gutterBottom className={classes.sectionTitle}>
                {`Choose ${
                  properties?.documentAction === "upload"
                    ? "destination folder*"
                    : "file*"
                }`}
              </Typography>
              <div
                style={{
                  padding: "8.5px 14px",
                  border: "solid 1px rgba(0, 0, 0, 0.23)",
                  borderRadius: 5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => setIsFolderDialogOpen(true)}
              >
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {folderSelection}
                </div>
                <FolderOpenIcon style={{ marginLeft: 10 }} />
              </div>
            </div>
          </Collapse>

          <Collapse in={showNewFolderSection}>
            <div
              className={classes.sectionEntry}
              style={{
                backgroundColor: "antiquewhite",
                borderRadius: 5,
                padding: 3,
              }}
            >
              <Typography
                gutterBottom
                className={classes.sectionTitle}
                style={{ fontWeight: 500, color: "#666" }}
              >
                New folder name*
              </Typography>
              <SelectOnSteroids
                source="variable"
                variables={variables}
                onChange={(e) => _setTaskInfo(e, "documentNewFolder")}
                value={activeTask?.properties?.documentNewFolder || "choose"}
                type="text"
                placeholderText="Select variable"
                variablesOnly
                multiple={false}
              />
            </div>
          </Collapse>
        </div>
      </Collapse>
      <Divider style={{ marginBottom: 100 }} />

      <FolderStructureDialog
        fileFolderType={
          properties?.documentAction === "upload" ? "folder" : "file"
        }
        isFolderDialogOpen={isFolderDialogOpen}
        closeFolderDialog={closeFolderDialog}
        saveFolderSelection={saveFolderSelection}
        initialPath={currentPath}
        initialFolders={foldersList}
        documentPathArray={properties?.documentPathArray}
        fetchFolderContents={fetchFolderContents}
        initialFoldersIdList={initialFoldersIdList}
        setInitialFoldersIdList={setInitialFoldersIdList}
        isLoading={isFolderContentLoading}
      />
    </div>
  );
};

export default connect((state) => {
  return {
    activeTaskId: state.workflows.activeTask?.id,
    activeTaskType: state.workflows.activeTask?.type,
    workflowTasks: state.workflows.workflowTasks,
    workflowCanvas: state.workflows.workflowCanvas,
    allVariables: state.workflows.variables,
    taskPos: state.workflows.pos,
    integrations: state.workflows.workflowIntegrations,
  };
})(DocumentTaskSidebar);
