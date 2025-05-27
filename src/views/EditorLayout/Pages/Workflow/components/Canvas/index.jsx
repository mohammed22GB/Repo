import { useState, useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  addEdge,
  updateEdge,
  removeElements,
  Controls,
} from "react-flow-renderer";
import { v4 } from "uuid";
import CancelIcon from "@material-ui/icons/Cancel";
import { IconButton, Switch, FormControlLabel, Fade } from "@material-ui/core";
import Sidebar from "../Sidebar";
import {
  CustomConnection,
  CustomNode,
  TerminalNode,
  DefaultNode,
  ButtonEdge,
} from "../dragComponents";
import "../dnd.css";
import {
  rLoadWorkflowTasks,
  rRemoteUpdateCanvasElements,
  rSetupBackDrop,
  rShouldRefetchWorkflow,
  rTriggerAiWorkflowValue,
  rUpdateWorkflowCanvas,
} from "../../../../../../store/actions/properties";
import {
  updateWorkflowCanvas,
  loadTask,
  clearActiveTask,
  getAllWorkflows,
} from "../../utils/workflowHelpers";
import MyBackDrop from "../MyBackDrop";
import * as taskTypes from "../../components/utils/taskTypes";
import { recoverWorkflowAPI } from "../../utils/workflowAPIs";
import { infoToastify } from "../../../../../common/utils/Toastify";
import {
  manageAppLocalStorage,
  SetAppStatus,
  showAppDialog,
} from "../../../../../common/helpers/helperFunctions";
import SimpleDialog from "../../../../../common/components/SimpleDialog/SimpleDialog";
import CustomConfirmBox from "../../../../../common/components/CustomConfirmBox/CustomConfirmBox";

const nodeTypes = {
  [taskTypes.WORKFLOWS_TASK_START]: TerminalNode,
  [taskTypes.WORKFLOWS_TASK_END]: TerminalNode,
  [taskTypes.WORKFLOWS_TASK_SCREEN]: DefaultNode,
  [taskTypes.WORKFLOWS_TASK_MAIL]: DefaultNode,
  [taskTypes.WORKFLOWS_TASK_DATA]: CustomNode,
  [taskTypes.WORKFLOWS_TASK_APPROVAL]: CustomNode,
  [taskTypes.WORKFLOWS_TASK_COMPUTATION]: CustomNode,
  [taskTypes.WORKFLOWS_TASK_PAYMENT]: DefaultNode,
  [taskTypes.WORKFLOWS_TASK_CUSTOM]: DefaultNode,
  [taskTypes.WORKFLOWS_TASK_CALENDAR]: DefaultNode,
  [taskTypes.WORKFLOWS_TASK_DOCUMENT]: DefaultNode,
  [taskTypes.WORKFLOWS_TASK_CUSTOM]: DefaultNode,
};

const WorkflowCanvas = ({
  workflowTasks,
  workflowCanvas,
  activeWorkflow,
  activeTask,
  externalSetElements,
  isWorkflowCrashed,
  ...props
}) => {
  if (!localStorage.getItem("workflow_show_hint"))
    localStorage.setItem("workflow_show_hint", "on");

  const dispatch = useDispatch();
  const initialElements = workflowCanvas && [...workflowCanvas];
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [useDialog, setUseDialog] = useState("");
  const [showDeleteHint1, setShowDeleteHint1] = useState(true);
  const [showDeleteHint2, setShowDeleteHint2] = useState(true);
  const [showDeleteHint3, setShowDeleteHint3] = useState(true);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [canvasElements, setCanvasElements] = useState([]);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [showLinkReplaceDialog, setShowLinkReplaceDialog] = useState(false);
  const [storedLinksToReplace, setStoredLinksToReplace] = useState({});
  const [deleteType, setDeleteType] = useState("");
  const [storedElementsToRemove, setStoredElementsToRemove] = useState(null);
  const [subscribe, setSubscribe] = useState(false);
  const [overrideCrashStatus, setOverrideCrashStatus] = useState(false);
  const [refreshKey, setRefreshKey] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const [showHint, setShowHint] = useState(
    localStorage.getItem("workflow_show_hint") === "on"
  );
  const [defaultPosition, setDefaultPosition] = useState([0, 0]);
  const [defaultZoom, setDefaultZoom] = useState(1);
  const [subscribedPosition, setSubscribedPosition] = useState(false);
  const [canvasActivity, setCanvasActivity] = useState({});

  useEffect(() => {
    // triggers the workflow to reload and display the canvas elements whe AI prompt is used
    if (props.triggerAiValueOnCanvas) {
      setSubscribed(false);
    }
  }, [props.triggerAiValueOnCanvas]);

  useEffect(() => {
    if (props.shouldRefetchWorkflow) {
      dispatch(getAllWorkflows(activeWorkflow?.app, true, null));
      dispatch(rLoadWorkflowTasks({}));
      dispatch(rShouldRefetchWorkflow(false));
    }
    setSubscribe(true);

    return () => {
      // setElements(initialElements);
    };
  }, []);

  useEffect(() => {
    /* this refresh allows instant connectivity to handles
    after toggling conditional nodes between side handles 
    and bottom handles */
    setRefreshKey(v4());

    if (
      (!subscribed && workflowCanvas?.length) ||
      workflowCanvas?.length === 2
    ) {
      setCanvasElements(workflowCanvas);
      setSubscribed(true);
      dispatch(rTriggerAiWorkflowValue(false));
    }
  }, [workflowCanvas]);

  useEffect(() => {
    if (activeWorkflow?.app && !subscribedPosition) {
      setDefaultPosition(getCanvasPositioning().position);
      setDefaultZoom(getCanvasPositioning().zoom);
      setSubscribedPosition(true);
    }
  }, [activeWorkflow?.app]);

  useEffect(() => {
    if (subscribed) {
      dispatch(rUpdateWorkflowCanvas(canvasElements));

      if (canvasActivity.elems) {
        registerUpdate(canvasActivity.elems, canvasActivity.act);
        setCanvasActivity({});
      }
    }
  }, [canvasElements, canvasActivity]);

  useEffect(() => {
    if (!subscribe || !activeTask?.properties?.approvalActions) {
      return;
    }
    const approvalActions = activeTask?.properties?.approvalActions;

    const oldEls = [...(workflowCanvas || [])];

    let updatedEl;
    const newEls = oldEls?.map((el) => {
      try {
        if (el.source === activeTask?.taskId) {
          if (
            el.sourceHandle === "b" &&
            el.label !== approvalActions[0]?.label
          ) {
            el.label = approvalActions[0]?.label || null;
            updatedEl = el;
          }
          if (
            el.sourceHandle === "c" &&
            el.label !== approvalActions[1]?.label
          ) {
            el.label = approvalActions[1]?.label || null;
            updatedEl = el;
          }
          if (
            el.sourceHandle === "d" &&
            el.label !== approvalActions[2]?.label
          ) {
            el.label = approvalActions[2]?.label || null;
            updatedEl = el;
          }
        }
      } catch (e) {
        // console.error("ERROR in Canvas.js > line 173");
      }
      return el;
    });

    setCanvasElements(newEls);
    setCanvasActivity({ elems: updatedEl, act: null });
  }, [activeTask?.properties?.approvalActions]);

  useEffect(() => {
    if (!subscribe || !activeTask?.properties?.decisionActions) {
      return;
    }
    const decs = activeTask?.properties?.decisionActions;
    const oldEls = [...(workflowCanvas || [])];

    let updatedEl;
    const newEls = oldEls?.map((el) => {
      try {
        if (el.source === activeTask?.taskId) {
          if (el.sourceHandle === "b" && el.label !== decs[0]?.label) {
            el.label = decs[0]?.label || null;
            updatedEl = el;
          }
          if (el.sourceHandle === "c" && el.label !== decs[1]?.label) {
            el.label = decs[1]?.label || null;
            updatedEl = el;
          }
        }
      } catch (e) {
        // console.error("ERROR in Canvas.js > line 201");
      }
      return el;
    });

    setCanvasElements(newEls);
    setCanvasActivity({ elems: updatedEl, act: null });
  }, [activeTask?.properties?.decisionActions]);

  useEffect(() => {
    if (!props.remoteUpdateCanvasElements?.length) return;
    onElementsRemove(props.remoteUpdateCanvasElements, true);
  }, [props.remoteUpdateCanvasElements]);

  const getCanvasPositioning = () => {
    const canvasPositioning = manageAppLocalStorage(
      "get",
      activeWorkflow?.app,
      "canvasPositioning"
    );

    return {
      position: canvasPositioning?.position || [0, 0],
      zoom: canvasPositioning?.zoom || 1,
    };
  };

  const registerUpdate = async (changed, canvasAction) => {
    //  not waiting...
    dispatch(updateWorkflowCanvas(changed, canvasAction));
  };

  const onLoad = (_reactFlowInstance) => {
    setReactFlowInstance(_reactFlowInstance);
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const id = v4();
    const newNode = {
      id,
      type,
      position,
      data: { label: `[Not configured]` },
    };

    const newEls = [...(workflowCanvas || [])].concat(newNode);

    setCanvasElements(newEls);
    setCanvasActivity({ elems: newNode, act: "new" });
  };

  const onConnect = async (params) => {
    const els = [...(workflowCanvas || [])];
    let updatedParams;

    //  check if link already exists from source/handle
    const exists = els?.find(
      (currentElements) =>
        currentElements.source === params.source &&
        currentElements.sourceHandle === params.sourceHandle
    );

    if (exists) {
      /* 
        This is more likely to be due to an error.
        So we will take the opportunity to scan 
        for all such linking errors, and remove:
          - links whose sources or targets are no
            longer on the canvas
          - links deleted but still partially there
      */

      //  first check for hanging links
      const taskIds = {};
      for (let itr = 0; itr < els.length; itr++) {
        if (els[itr].type) taskIds[els[itr].id] = 1;
      }

      // next, check if specified link is an error
      const hangingLinks = els.filter(
        (task) =>
          task.source && (!taskIds[task.source] || !taskIds[task.target])
      );

      const isErrorLink = hangingLinks.some(
        (hangingLink) => exists.id === hangingLink.id
      );

      //  if hanging links found, send request to delete the links
      if (hangingLinks.length) {
        //  not waiting... dialog might be displayed if necessary
        dispatch(updateWorkflowCanvas(hangingLinks, "del"));
      }

      //  if specified link is an error, also remove from canvas,
      //  else show dialog to replace
      if (isErrorLink) {
        const newEls = removeElements(hangingLinks, els);
        setCanvasElements(newEls);
      } else {
        //  show dialog
        setStoredLinksToReplace({ outbound: exists, inbound: params });
        setShowLinkReplaceDialog(true);
        return;
      }
    }

    const newEls_ = addEdge(params, els);

    //  enforce animated edges
    const newEls = newEls_.map((el) => {
      if (!!el.target) {
        el.animated = true;
        el.style = { strokeWidth: 2, stroke: "#7d868b" };

        if (params.source === el.source) {
          updatedParams = el;
          if (!!params.sourceHandle) {
            //  ~if connecting from Approval/Computation nodes
            try {
              const src = params.source;
              const approvalActions =
                workflowTasks[src]?.properties?.approvalActions ||
                workflowTasks[src]?.properties?.decisionActions;
              if (!!approvalActions && el.sourceHandle === "b")
                el.label = approvalActions[0]?.label || null;
              if (!!approvalActions && el.sourceHandle === "c")
                el.label = approvalActions[1]?.label || null;
              if (!!approvalActions && el.sourceHandle === "d")
                el.label = approvalActions[2]?.label || null;
            } catch (e) {
              // console.error("ERROR in Canvas.js > line 305");
            }
          }
        }
      }
      return el;
    });

    setCanvasElements(newEls);
    setCanvasActivity({ elems: updatedParams, act: "connect" });
  };

  const onElementsRemove = async (elementsToRemove, isFromRemote) => {
    // removeNodeFromWorkflowCanvas(elementsToRemove, elements, isFromRemote)
    let msg, wh;

    //  return if terminal node
    if (
      !!elementsToRemove?.find(
        (el) => el.type === "StartTask" || el.type === "EndTask"
      )
    )
      return;

    if (
      !!elementsToRemove?.find((el) => {
        if (el.type !== "default") {
          wh = el.type;
          return true;
        } else return false;
      })
    )
      msg = `${wh} node`;
    else msg = "link";

    if (!isFromRemote) {
      setDeleteType(msg);
      setShowDeleteConfirmDialog(true);
      setStoredElementsToRemove(elementsToRemove);
    } else {
      deleteTheElements(elementsToRemove);
    }
  };

  const deleteTheElements = async (passedElementsToRemove) => {
    const elementsToRemove = [
      ...(passedElementsToRemove || storedElementsToRemove || []),
    ];

    if (!elementsToRemove?.length) {
      dispatch(
        SetAppStatus({
          type: "error",
          msg: "Sorry an error occured. Please try again.",
        })
      );
      return;
    }

    const oldEls = [...(workflowCanvas || [])];
    const newEls = removeElements(elementsToRemove, oldEls);

    setCanvasElements(newEls);
    setCanvasActivity({ elems: elementsToRemove, act: "del" });

    setStoredElementsToRemove(null);
    dispatch(rRemoteUpdateCanvasElements([]));
    //  right hide settings panel
    _hideRightSidePanel();
  };

  const replaceNodesLink = async () => {
    const linksToReplace = { ...(storedLinksToReplace || {}) };

    if (!linksToReplace.outbound || !linksToReplace.inbound) {
      return;
    }

    onEdgeUpdate(linksToReplace.outbound, linksToReplace.inbound);

    setStoredLinksToReplace({});
  };

  const recoverThisWorkflow = async () => {
    if (!activeWorkflow?.id) {
      infoToastify("Please re-login");
      return;
    }
    const response = await recoverWorkflowAPI(activeWorkflow?.id);

    if (response?._meta?.success && !!activeWorkflow?.app) {
      dispatch(getAllWorkflows(activeWorkflow?.app, true, null));
    }
  };

  const onNodeDragStop = ({ isTrusted }, params) => {
    const oldEls = [...(workflowCanvas || [])];

    const newEls = oldEls.map((el) => {
      if (el.id === params.id) {
        el.position = params.position;
      }
      return el;
    });

    // registerUpdate(params, "move");
    setCanvasActivity({ elems: params, act: "move" });
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge, newConnection) => {
    const oldEls = [...(workflowCanvas || [])];
    const newEls = updateEdge(oldEdge, newConnection, oldEls);
    setCanvasElements(newEls);

    // registerUpdate(newConnection, "reconnect");
    setCanvasActivity({
      elems: { ...newConnection, oldId: oldEdge.id },
      act: "reconnect",
    });
  };

  const onElementClick = (isTrusted, { id, type }) => {
    if (["default", "buttonedge", "StartTask", "EndTask"].includes(type)) {
      if (type === "default")
        dispatch(SetAppStatus({ type: "info", msg: "Nodes link selected." }));
      if (type === "buttonedge")
        dispatch(SetAppStatus({ type: "info", msg: "Button edge selected." }));
      return;
    }

    dispatch(SetAppStatus({ type: "info", msg: `${type} selected.` }));
    dispatch(loadTask({ taskId: id, type }));
  };

  const edgeTypes = {
    buttonedge: ButtonEdge,
  };

  const _setShowBackDrop = (val) => {
    setShowBackDrop(val);
    dispatch(
      rSetupBackDrop({
        //  to indicate that rightsidebar is called from here and so make unhideable
        ...props.backDrop,
        show: false,
      })
    );
  };

  const _dialogResponse = (use, resp) => {
    if (resp === true) {
      switch (use) {
        case "deleteTask":
          // dispatch(removeWorkflowTask(posn));
          // alert(Object.keys(resp))

          break;

        default:
          break;
      }
    }

    dispatch(showAppDialog({ status: false }));
  };

  const _setShowHint = (e) => {
    localStorage.setItem("workflow_show_hint", "off");
    setShowHint(false);
  };

  const _hideRightSidePanel = () => {
    dispatch(clearActiveTask());
  };

  const doMove = ({ x, y, zoom }) => {
    setDefaultPosition([x, y]);
    setDefaultZoom(zoom);

    const canvasPositioning = {
      position: [x, y],
      zoom,
    };

    manageAppLocalStorage(
      "set",
      activeWorkflow?.app,
      "canvasPositioning",
      canvasPositioning
    );
  };
  const doPaneScroll = (...args) => {};

  const getHeavyTasksWarning = (tasks) => {
    return (
      <div>
        <div>WARNING: Variable-heavy tasks!</div>
        <br />
        <div>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="task heavy-task"
            >{`${task.name} (${task.type}): ...? variables`}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            key={refreshKey}
            elements={canvasElements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDragStop={onNodeDragStop}
            onElementClick={onElementClick}
            nodeTypes={nodeTypes}
            connectionLineComponent={CustomConnection}
            onEdgeUpdate={onEdgeUpdate}
            onPaneClick={_hideRightSidePanel}
            // edgeTypes={edgeTypes}
            // edgeTypesId="custom"
            selectNodesOnDrag={false}
            style={{ background: "#f5f5f5" }}
            onMove={doMove}
            onPaneScroll={doPaneScroll}
            defaultZoom={defaultZoom}
            defaultPosition={defaultPosition}
          >
            <Controls />
            <Background
              variant="dots"
              gap={12}
              size={1}
              style={{ opacity: 0.3 }}
            />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
      <Fade
        in={showHint && (showDeleteHint1 || showDeleteHint2 || showDeleteHint3)}
      >
        <div
          style={{
            position: "fixed",
            bottom: 58,
            left: 5,
            zIndex: 10,
            fontSize: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 10,
              opacity: 0.7,
            }}
          >
            HINTS:
            <span>
              <FormControlLabel
                control={
                  <Switch
                    checked={showHint}
                    size="small"
                    onChange={_setShowHint}
                  />
                }
                label="Turn off"
                labelPlacement="start"
                size="small"
                style={{ fontSize: 12, textTransform: "uppercase" }}
              />
            </span>
          </div>
          {showDeleteHint1 && (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.7)",
                display: "flex",
                padding: "5px 5px 5px 10px",
                color: "#fff",
                lineHeight: 1,
                alignItems: "center",
                borderRadius: 25,
                marginTop: 5,
                justifyContent: "space-between",
                // marginLeft: 46,
              }}
            >
              Click on node or link and hit {`<backspace>`} to delete
              <IconButton
                size="small"
                onClick={() => setShowDeleteHint1(false)}
              >
                <CancelIcon style={{ color: "white", fontSize: 18 }} />
              </IconButton>
            </div>
          )}
          {showDeleteHint2 && (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                display: "flex",
                padding: "5px 5px 5px 10px",
                color: "#fff",
                lineHeight: 1,
                alignItems: "center",
                borderRadius: 25,
                marginTop: 5,
                justifyContent: "space-between",
                // marginLeft: 46,
              }}
            >
              Click link, close to the connector, to redirect
              <IconButton
                size="small"
                onClick={() => setShowDeleteHint2(false)}
              >
                <CancelIcon style={{ color: "white", fontSize: 18 }} />
              </IconButton>
            </div>
          )}
          {showDeleteHint3 && (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                padding: "5px 5px 5px 10px",
                color: "#fff",
                lineHeight: 1,
                alignItems: "center",
                borderRadius: 25,
                marginTop: 5,
                justifyContent: "space-between",
                // marginLeft: 46,
              }}
            >
              On Canvas, scroll up and down to zoom in and out
              <IconButton
                size="small"
                onClick={() => setShowDeleteHint3(false)}
              >
                <CancelIcon style={{ color: "white", fontSize: 18 }} />
              </IconButton>
            </div>
          )}
        </div>
      </Fade>
      <MyBackDrop
        showBackDrop={props.backDrop?.show}
        setShowBackDrop={(v) => _setShowBackDrop(v)}
        clickToHideBackdrop={props.backDrop?.clickToHideBackdrop}
      />
      <SimpleDialog
        dialogProps={props.showDialog}
        onClose={_dialogResponse}
        use={useDialog}
      />
      {showDeleteConfirmDialog && (
        <CustomConfirmBox
          closeConfirmBox={() => {
            setShowDeleteConfirmDialog(false);
            setDeleteType("");
          }}
          text={`Delete this ${deleteType}? This action cannot be undone.`}
          open={showDeleteConfirmDialog}
          confirmAction={deleteTheElements}
        />
      )}
      {showLinkReplaceDialog && (
        <CustomConfirmBox
          closeConfirmBox={() => {
            setShowLinkReplaceDialog(false);
          }}
          text={
            <div>
              Link already exists from node, replace? <br />
              <span
                style={{
                  color: "#666666",
                  fontSize: "0.9em",
                  fontStyle: "italic",
                }}
              >
                (Alternatively, drag the either end of link to new node)
              </span>
            </div>
          }
          open={showLinkReplaceDialog}
          confirmAction={replaceNodesLink}
        />
      )}

      {isWorkflowCrashed && !overrideCrashStatus && !!activeWorkflow?.id && (
        <CustomConfirmBox
          closeConfirmBox={(force) => {
            !!force && setOverrideCrashStatus(true);
            setShowDeleteConfirmDialog(false);
            setDeleteType("");
          }}
          // text={`THIS WORKFLOW HAS CRASHED. ATTEMPT TO RECOVER? (Note: Nodes positions might be distorted or even inverted)`}
          text={`There is a problem with access to this Workflow. 
          Kindly re-login to access it. If this persists, try to recover it by clicking the 'Recover' button.`}
          type={"error"}
          trueText="Recover"
          falseText="Cancel"
          open={isWorkflowCrashed && !overrideCrashStatus}
          confirmAction={recoverThisWorkflow}
        />
      )}

      <div style={{ color: "transparent" }}>
        {props.thisIsRedundatStateVariable}
      </div>
    </div>
  );
};

export default connect((state) => {
  return {
    showTasks: state.workflows.showTasks,
    shouldRefetchWorkflow: state.workflows.shouldRefetchWorkflow,
    workflowTasks: state.workflows.workflowTasks,
    activeTaskIdTask: state.workflows.activeTask,
    activeTask: state.workflows.workflowTasks[state.workflows.activeTask?.id],
    workflowCanvas: state.workflows.workflowCanvas,
    activeWorkflow: state.workflows.activeWorkflow,
    backDrop: state.workflows.backDrop,
    remoteUpdateCanvasElements: state.workflows.remoteUpdateCanvasElements,
    externalSetElements: state.workflows.externalSetElements,
    isWorkflowCrashed: state.workflows.isWorkflowCrashed,
    showDialog: state.reducers.showDialog,
    thisIsRedundatStateVariable: state.workflows.thisIsRedundatStateVariable,
    workflowHeavyTasks: state.workflows.workflowHeavyTasks,
    triggerAiValueOnCanvas: state.workflows.triggerAiValueOnCanvas,
  };
})(WorkflowCanvas);
