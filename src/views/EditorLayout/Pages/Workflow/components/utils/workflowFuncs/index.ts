// Import necessary functions and types
import { debounce, set, mergeWith, cloneDeep, isArray } from "lodash";
// Assuming other imports like react-flow-renderer are still needed
import { removeElements, Elements, Node, Edge } from "react-flow-renderer";

// Import the mocked or real version depending on test setup
import { updateWorkflowTask } from "../../../utils/workflowHelpers";

// Import helpers (ensure these are correctly mocked or imported in tests)
import {
  getFieldName,
  getFieldValue,
} from "../../../../../../common/helpers/helperFunctions";

// --- Refactored Helper ---
/**
 * Determines the correct target path for a property based on mainProps.
 * @param key The original property key (can be dot-notation).
 * @param mainProps Array of top-level keys considered main properties.
 * @returns The target path (e.g., 'name' or 'properties.customField').
 */
const getTargetPath = (key: string, mainProps: string[]): string => {
  if (!key) {
    return "";
  } // Handle empty key case
  // Ensure mainProps is an array before using includes
  const safeMainProps = Array.isArray(mainProps) ? mainProps : [];
  const firstPart = key.split(".")[0];
  return safeMainProps.includes(firstPart) ? key : `properties.${key}`;
};

// --- Refactored applyDecomposedUpdates ---
/**
 * Applies updates from a 'changes' object to a 'targetObject',
 * placing properties correctly based on mainProps using _.mergeWith.
 * Modifies targetObject directly.
 * @param changes An object containing potentially dot-notation keys and their values.
 * @param targetObject The object to apply updates to.
 * @param mainProps Array of top-level keys considered main properties.
 */
export const applyDecomposedUpdates = (
  changes: Record<string, any>,
  targetObject: Record<string, any>,
  mainProps: string[]
): void => {
  // Returns void, modifies targetObject
  if (!changes || !targetObject) {
    return;
  }
  // Ensure mainProps is an array
  const safeMainProps = Array.isArray(mainProps) ? mainProps : [];

  Object.keys(changes).forEach((key) => {
    const value = changes[key];
    const props = key.split(".");
    const firstPart = props[0];

    // Determine the path prefix based on mainProps
    const pathPrefix = safeMainProps.includes(firstPart) ? "" : "properties.";

    // Construct the object fragment needed for mergeWith for this specific key
    const updateFragment = {};
    set(updateFragment, `${pathPrefix}${key}`, value); // Use lodash.set to build the fragment

    // Merge this single fragment into the target object using the customizer
    mergeWith(targetObject, updateFragment, customizer);
  });
};

// --- Refactored globalSetTaskInfo (Aligned with Tests) ---
export const globalSetTaskInfo = debounce(
  (
    dispatch: Function,
    e: any, // Event or changes object
    ppty: string | null, // Explicitly allow null
    isGrouped: boolean,
    activeTask: Record<string, any> | null, // Allow null
    setTaskUpdated: (updated: boolean) => void,
    additionalOuterProperties: string[] = [],
    checkSetupStatus?: (taskState: Record<string, any>) => boolean | any, // Optional callback
    refreshTask?: Function // Optional callback
  ) => {
    try {
      if (!activeTask) {
        // Match original behavior: throw error if activeTask is null/undefined
        throw new Error("No active task provided to globalSetTaskInfo");
      }

      // Define MAIN_FIELDS consistently
      const MAIN_FIELDS = [
        "name",
        "description",
        "configured",
        "useCustomTrigger",
        "triggerType",
        "triggeredByWorkflow",
        "triggeredByWebhook",
        "isDynamicTable",
        "assignedTo",
        "assignTask",
        "escalateTo",
        "escalateTask",
        "executorVariablesConfig",
        ...(Array.isArray(additionalOuterProperties)
          ? additionalOuterProperties
          : []), // Ensure it's an array
      ];

      let initialChanges: Record<string, any> = {};
      let propertyName = ppty;
      // Track if the update originated from a single UI event (!isGrouped)
      const wasSingleUIEvent = !isGrouped && !!e?.target?.tagName;

      // 1. Determine the initial 'changes' object
      if (isGrouped) {
        initialChanges = { ...e }; // Copy the grouped changes
      } else {
        // Handle single update
        // Use the actual helper functions (assuming they are correctly imported/mocked in tests)
        propertyName = getFieldName(e, propertyName);
        if (!propertyName) {
          console.error(
            "Error: Could not determine property name for update.",
            { e, ppty }
          );
          // Match original behavior: alert if property name is missing
          alert("Error occured determining field name.");
          return; // Stop execution
        }
        const value = getFieldValue(e);
        initialChanges = { [propertyName]: value };
      }

      // 2. Create the state object that will be modified and eventually passed as 'info'
      // This matches the test expectation of passing a modified task object.
      const taskStateForInfo = cloneDeep(activeTask);
      applyDecomposedUpdates(initialChanges, taskStateForInfo, MAIN_FIELDS);

      // Keep track of the final set of changes to build the 'update' object
      let finalChanges = { ...initialChanges };
      let configuredStatusChanged = false;

      // 3. Check setup status if callback provided
      if (checkSetupStatus) {
        // Pass the modified state for checking
        const status = checkSetupStatus(taskStateForInfo);

        // Check if status is boolean and different from the original activeTask's configured status
        if (typeof status === "boolean" && activeTask.configured !== status) {
          // Update finalChanges object *and* the taskStateForInfo if status changes
          finalChanges.configured = status;
          taskStateForInfo.configured = status; // Keep taskStateForInfo consistent
          configuredStatusChanged = true;
        }
      }

      // 4. Handle setTaskUpdated call based on test expectations
      // The test 'single -> grouped' expects setTaskUpdated *not* to be called.
      // Call only if it was a single UI event AND checkSetupStatus didn't run or didn't cause a change.
      if (wasSingleUIEvent && !checkSetupStatus) {
        setTaskUpdated(true);
      }
      // If checkSetupStatus *did* run, the tests imply setTaskUpdated is skipped,
      // even if it started as a single event. So, no 'else' needed here based on tests.

      // 5. Build the final 'dispatchUpdate' object from the final 'finalChanges'
      const dispatchUpdate: Record<string, any> = {};
      Object.keys(finalChanges).forEach((key) => {
        const targetPath = getTargetPath(key, MAIN_FIELDS);
        if (targetPath) {
          // Ensure targetPath is valid
          dispatchUpdate[targetPath] = finalChanges[key];
        }
      });

      // This matches the original function's likely behavior reflected in tests.
      if (!taskStateForInfo.properties) {
        taskStateForInfo.properties = {};
      }

      // 7. Dispatch the update
      const saveToDB = true; // Keep logic simple as per original
      // Pass the potentially modified taskStateForInfo as the second argument ('info')
      dispatch(
        updateWorkflowTask(
          dispatchUpdate,
          taskStateForInfo,
          saveToDB,
          refreshTask
        )
      );
    } catch (err: any) {
      // Added type hint for error
      // Match original behavior: log error if something goes wrong (e.g., activeTask is null)
      console.error("Error in globalSetTaskInfo:", err.message || err); // Log the error message
      // alert("An unexpected error occurred."); // Optional: keep alert if needed
    }
  },
  800 // Debounce time
);

interface VariableInfo {
  parent: string;
  group: string;
  dataType: string[];
}

interface VariableObj {
  info?: VariableInfo;
}

interface WorkflowNode extends Node<any> {}

interface WorkflowEdge extends Edge<any> {}

type WorkflowElement = WorkflowNode | WorkflowEdge;

interface OtherProps {
  registerUpdate2: (
    elementsToRemove: WorkflowElement[],
    newElements: WorkflowElement[],
    oldElements: WorkflowElement[],
    action: string
  ) => Promise<boolean | undefined>;
  setElements: (newElements: WorkflowElement[]) => void;
  _hideRightSidePanel: () => void;
}

// --- Keep other functions ---

export const removeNodeFromWorkflowCanvas = async (
  elementsToRemove: Elements<any>,
  elements: Elements<any> | null,
  isFromRemote: boolean,
  otherProps: OtherProps
): Promise<void> => {
  let msg: string, wh: string | undefined;

  //  return if terminal node
  if (
    !!elementsToRemove.find(
      (el: WorkflowElement) => el.type === "StartTask" || el.type === "EndTask"
    )
  ) {
    return;
  }

  if (
    !!elementsToRemove.find((el: WorkflowElement) => {
      if (el.type !== "default") {
        wh = el.type;
        return true;
      } else {
        return false;
      }
    })
  ) {
    msg = `${wh} node`;
  } else {
    msg = "link";
  }

  if (!isFromRemote) {
    const conf = window?.confirm(`Delete this ${msg}?`);
    if (!conf) {
      return;
    }
  }

  const oldEls = elements ? [...elements] : [];
  const newEls = removeElements(elementsToRemove, oldEls);
  // const done = await registerUpdate(newEls, elementsToRemove, "del");
  const done = await otherProps.registerUpdate2(
    elementsToRemove,
    newEls,
    newEls,
    "del"
  );

  if (done !== false) {
    otherProps.setElements(newEls as Elements<any>);
  }
  //  right hide settings panel
  otherProps._hideRightSidePanel();
};

export const validFormSelfReferenceFields = (
  variables: VariableObj[],
  activeTaskId: string
): VariableObj[] => {
  return (variables || []).filter(
    (v: VariableObj) =>
      v.info?.parent === activeTaskId &&
      v.info?.group === "Form" &&
      v.info?.dataType &&
      !v.info.dataType.includes("none")
  );
};

export interface IVariable {
  id: string;
  info: {
    name: string;
    parent: string;
    nodeType: string;
    dataType: string[];
    group: string;
    matching: {
      valueSourceType: string;
      valueSourceId: string;
      valueSourceInput: string;
    };
  };
  tasks: string[];
  usage?: any[];
}

interface CanvasNode {
  id?: string;
  type?: string;
  source?: string;
  target?: string;
}

export const isConnectedTo = (
  me: string,
  canvas: CanvasNode[],
  to: "anyNode" | "startNode"
): boolean | undefined => {
  switch (to) {
    case "anyNode":
      return !!canvas.find((node: CanvasNode) => node.target === me);

    case "startNode":
      const startNode = canvas.find(
        (node: CanvasNode) => node.type === "StartTask"
      )?.id;
      return !!canvas.find(
        (node: CanvasNode) => node.source === startNode && node.target === me
      );

    default:
      return undefined; // Handles the case when `to` doesn't match.
  }
};

export const getTaskVariables = (
  activeTaskId: string,
  allVariables: IVariable[],
  inclusive = false
): IVariable[] | undefined => {
  return allVariables?.filter(
    (variable: IVariable) =>
      variable?.tasks?.includes(activeTaskId) && // Converting to string for comparison.
      (inclusive || variable?.info?.parent !== activeTaskId)
  );
};

// customizer remains the same - needed if mergeWith is kept
export const customizer = (objValue: any, srcValue: any) => {
  if (isArray(objValue)) {
    return srcValue; // Replace arrays entirely
  }
  // For other types, return undefined to let mergeWith handle default merging
  return undefined;
};
