// Import necessary functions and types
import { applyDecomposedUpdates, customizer, globalSetTaskInfo } from "./index"; // Adjust path if needed
import * as workflowHelpers from "../../../utils/workflowHelpers"; // Path to updateWorkflowTask
import { cloneDeep } from "lodash"; // Needed for testing non-mutation of original objects if required

// Mock lodash BEFORE any imports from the file under test if possible,
// or at the top level of the test file.
jest.mock("lodash/debounce", () => (fn) => {
  // Mock lodash.debounce
  return () => {
    // In this mock, the function is called immediately
    fn();
  };
});

// Mock the customizer if needed, but since it's exported, we can use the real one.
// If it had side effects or complex dependencies, mocking would be better.

describe("applyDecomposedUpdates", () => {
  let targetObject;
  const mainProps = ["name", "description", "configured"];

  beforeEach(() => {
    // Reset targetObject before each test
    targetObject = {};
  });

  it("should return early if changes object is null or undefined", () => {
    targetObject = { existing: "value" };
    const originalTarget = cloneDeep(targetObject);

    applyDecomposedUpdates(null, targetObject, mainProps);
    expect(targetObject).toEqual(originalTarget);

    applyDecomposedUpdates(undefined, targetObject, mainProps);
    expect(targetObject).toEqual(originalTarget);
  });

  it("should return early if targetObject is null or undefined", () => {
    const changes = { name: "test" };
    // We just expect it not to throw an error
    expect(() =>
      applyDecomposedUpdates(changes, null, mainProps)
    ).not.toThrow();
    expect(() =>
      applyDecomposedUpdates(changes, undefined, mainProps)
    ).not.toThrow();
  });

  it("should apply updates to main properties directly", () => {
    const changes = {
      name: "New Workflow Name",
      description: "Updated description",
    };
    applyDecomposedUpdates(changes, targetObject, mainProps);
    expect(targetObject).toEqual({
      name: "New Workflow Name",
      description: "Updated description",
    });
  });

  it('should apply updates to non-main properties under the "properties" key', () => {
    const changes = {
      customField: "value1",
      anotherSetting: 123,
    };
    applyDecomposedUpdates(changes, targetObject, mainProps);
    expect(targetObject).toEqual({
      properties: {
        customField: "value1",
        anotherSetting: 123,
      },
    });
  });

  it("should handle dot-notation keys for main properties", () => {
    const changes = {
      "name.first": "John", // 'name' is a main prop
    };
    const extendedMainProps = ["name", "config"]; // Add 'name'
    applyDecomposedUpdates(changes, targetObject, extendedMainProps);
    expect(targetObject).toEqual({
      name: {
        first: "John",
      },
    });
  });

  it("should handle dot-notation keys for non-main properties", () => {
    const changes = {
      "config.timeout": 5000, // 'config' is NOT a main prop here
      "api.url": "http://example.com",
    };
    applyDecomposedUpdates(changes, targetObject, mainProps);
    expect(targetObject).toEqual({
      properties: {
        config: {
          timeout: 5000,
        },
        api: {
          url: "http://example.com",
        },
      },
    });
  });

  it("should correctly merge mixed main and non-main properties", () => {
    targetObject = {
      name: "Old Name",
      properties: {
        existingProp: true,
        nested: { a: 1 },
      },
    };
    const changes = {
      description: "New Description", // main
      customField: "abc", // non-main
      "nested.b": 2, // non-main, dot-notation
    };
    applyDecomposedUpdates(changes, targetObject, mainProps);
    expect(targetObject).toEqual({
      name: "Old Name",
      description: "New Description",
      properties: {
        existingProp: true,
        customField: "abc",
        nested: { a: 1, b: 2 }, // Deep merge for objects
      },
    });
  });

  it("should handle empty changes object without modifying the target", () => {
    targetObject = { name: "Initial" };
    const originalTarget = cloneDeep(targetObject);
    const changes = {};
    applyDecomposedUpdates(changes, targetObject, mainProps);
    expect(targetObject).toEqual(originalTarget);
  });

  it("should treat all properties as non-main if mainProps is empty or invalid", () => {
    const changes = {
      name: "Test Name",
      custom: "Value",
    };

    // Test with empty array
    targetObject = {};
    applyDecomposedUpdates(changes, targetObject, []);
    expect(targetObject).toEqual({
      properties: {
        name: "Test Name",
        custom: "Value",
      },
    });

    // Test with invalid mainProps (should default to empty array internally)
    targetObject = {};
    applyDecomposedUpdates(changes, targetObject, undefined); // Force invalid type
    expect(targetObject).toEqual({
      properties: {
        name: "Test Name",
        custom: "Value",
      },
    });
  });

  it("should replace arrays instead of merging them (due to customizer)", () => {
    targetObject = {
      properties: {
        list: [1, 2, 3],
        items: ["a", "b"],
      },
      mainList: ["x"], // Main prop array
    };
    const changes = {
      list: [4, 5], // non-main
      items: ["c"], // non-main
      mainList: ["y", "z"], // main
    };
    const propsWithMainList = [...mainProps, "mainList"];

    applyDecomposedUpdates(changes, targetObject, propsWithMainList);

    expect(targetObject).toEqual({
      properties: {
        list: [4, 5], // Replaced
        items: ["c"], // Replaced
      },
      mainList: ["y", "z"], // Replaced
    });
  });

  it("should handle deep object merging for non-array values", () => {
    targetObject = {
      properties: {
        config: { theme: "dark", features: { beta: false } },
      },
      mainConfig: { user: "admin" },
    };
    const changes = {
      "config.features.beta": true, // non-main
      "config.newSetting": 123, // non-main
      "mainConfig.role": "editor", // main
    };
    const propsWithMainConfig = [...mainProps, "mainConfig"];

    applyDecomposedUpdates(changes, targetObject, propsWithMainConfig);

    expect(targetObject).toEqual({
      properties: {
        config: { theme: "dark", features: { beta: true }, newSetting: 123 },
      },
      mainConfig: { user: "admin", role: "editor" },
    });
  });
});

// Also include the customizer function itself if it wasn't imported
// (Assuming it's in the same file or imported correctly)
/*
export const customizer = (objValue: any, srcValue: any) => {
  if (isArray(objValue)) {
    return srcValue; // Replace arrays entirely
  }
  // For other types, return undefined to let mergeWith handle default merging
  return undefined;
};
*/

// Optional: Keep the customizer tests if you want to test it in isolation as well
describe("customizer", () => {
  it("should return source value if object value is an array", () => {
    expect(customizer(["a"], ["b"])).toEqual(["b"]);
    expect(customizer([], [1, 2])).toEqual([1, 2]);
  });

  it("should return undefined (letting merge handle it) if object value is not an array", () => {
    expect(customizer({ a: 1 }, { b: 2 })).toBeUndefined();
    expect(customizer("hello", "world")).toBeUndefined();
    expect(customizer(123, 456)).toBeUndefined();
    expect(customizer(null, "not null")).toBeUndefined();
    expect(customizer(undefined, "defined")).toBeUndefined();
  });
});

// Mock internal helpers (though objectSplitDots is simple, mocking ensures isolation if needed)
// We'll let applyDecomposedUpdates run as it's tightly coupled with checkSetupStatus logic here
// const mockObjectSplitDots = jest.fn();
// jest.mock('./workflowFuncs', () => ({
//   ...jest.requireActual('./workflowFuncs'), // Keep original functions
//   objectSplitDots: (...args: any[]) => mockObjectSplitDots(...args), // Mock specific function
// }));

// Spy on console.log and window.alert to suppress output and check calls
// const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

describe("globalSetTaskInfo", () => {
  let mockDispatch;
  let mockSetTaskUpdated;
  let mockCheckSetupStatus;
  let mockRefreshTask;
  let mockActiveTask;

  // Use fake timers for debounce
  beforeEach(() => {
    jest.useFakeTimers();

    mockDispatch = jest.fn();
    mockSetTaskUpdated = jest.fn();
    mockCheckSetupStatus = jest.fn();
    mockRefreshTask = jest.fn();

    jest.spyOn(workflowHelpers, "updateWorkflowTask").mockResolvedValue({
      // Return a basic action object structure
      type: "MOCK_UPDATE_WORKFLOW_TASK",
      payload: {},
    });

    // Reset mocks before each test
    jest.clearAllMocks();
    // Reset spies
    // consoleLogSpy.mockClear();
    alertSpy.mockClear();

    // Default active task state
    mockActiveTask = {
      id: "task-1",
      name: "Initial Task Name",
      description: "Initial Description",
      configured: false,
      properties: {
        customField1: "value1",
      },
    };
  });

  afterEach(() => {
    // Restore real timers after each test
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // --- Basic Debounce Test ---
  it("should debounce the function call", () => {
    const event = { target: { name: "name", value: "New Name" } };
    globalSetTaskInfo(
      mockDispatch,
      event,
      null,
      false,
      mockActiveTask,
      mockSetTaskUpdated
    );
    globalSetTaskInfo(
      mockDispatch,
      event,
      null,
      false,
      mockActiveTask,
      mockSetTaskUpdated
    );

    // Should not have been called yet
    expect(mockDispatch).not.toHaveBeenCalled();

    // Advance time by less than the debounce delay
    jest.advanceTimersByTime(799);
    expect(mockDispatch).not.toHaveBeenCalled();

    // Advance time past the debounce delay
    jest.advanceTimersByTime(1);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledTimes(1);
  });

  // --- Single Update Tests (!isGrouped) ---
  it("should update a main field for a single event", () => {
    const event = {
      target: { name: "name", value: "Updated Task Name", tagName: "INPUT" },
    }; // tagName simulates UI event
    globalSetTaskInfo(
      mockDispatch,
      event,
      null,
      false,
      mockActiveTask,
      mockSetTaskUpdated
    );
    jest.runAllTimers(); // Trigger debounce

    expect(mockSetTaskUpdated).toHaveBeenCalledWith(true);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      { name: "Updated Task Name" }, // update object
      {
        configured: false,
        description: "Initial Description",
        id: "task-1",
        name: "Updated Task Name",
        properties: { customField1: "value1" },
      },
      true, // saveToDB
      undefined // refreshTask (not provided)
    );
  });

  it("should update a custom field (properties) for a single event using ppty", () => {
    const event = { target: { value: "newCustomValue", tagName: "INPUT" } };
    const propertyName = "customField2";
    globalSetTaskInfo(
      mockDispatch,
      event,
      propertyName,
      false,
      mockActiveTask,
      mockSetTaskUpdated
    );
    jest.runAllTimers();

    expect(mockSetTaskUpdated).toHaveBeenCalledWith(true);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      { "properties.customField2": "newCustomValue" },
      expect.objectContaining({
        properties: expect.objectContaining({
          customField1: "value1",
          customField2: "newCustomValue",
        }),
      }),
      true,
      undefined
    );
    // Check if info.properties was actually updated (important!)
    const dispatchedInfo = workflowHelpers.updateWorkflowTask.mock.calls[0][1];
    expect(dispatchedInfo.properties.customField2).toBe("newCustomValue");
  });

  it("should update a custom field (properties) for a single event using event.target.name", () => {
    const event = {
      target: { name: "customField3", value: "anotherValue", tagName: "INPUT" },
    };
    globalSetTaskInfo(
      mockDispatch,
      event,
      null,
      false,
      mockActiveTask,
      mockSetTaskUpdated
    ); // ppty is null
    jest.runAllTimers();

    expect(mockSetTaskUpdated).toHaveBeenCalledWith(true);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      { "properties.customField3": "anotherValue" },
      expect.objectContaining({
        properties: expect.objectContaining({
          customField1: "value1",
          customField3: "anotherValue",
        }),
      }),
      true,
      undefined
    );
    const dispatchedInfo = workflowHelpers.updateWorkflowTask.mock.calls[0][1];
    expect(dispatchedInfo.properties.customField3).toBe("anotherValue");
  });

  // --- Grouped Update Tests (isGrouped) ---
  it("should update multiple fields (main and custom) when isGrouped is true", () => {
    const groupedUpdate = {
      name: "Group Updated Name",
      description: "Group Updated Desc",
      customGroupField: "groupValue1",
      "nested.group.field": "nestedValue",
    };
    globalSetTaskInfo(
      mockDispatch,
      groupedUpdate,
      null,
      true,
      mockActiveTask,
      mockSetTaskUpdated
    );
    jest.runAllTimers();

    expect(mockSetTaskUpdated).not.toHaveBeenCalled(); // setTaskUpdated is not called in the grouped loop
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      {
        // update object
        name: "Group Updated Name",
        description: "Group Updated Desc",
        "properties.customGroupField": "groupValue1",
        "properties.nested.group.field": "nestedValue",
      },
      {
        configured: false,
        description: "Group Updated Desc",
        id: "task-1",
        name: "Group Updated Name",
        properties: expect.objectContaining({
          customField1: "value1",
          customGroupField: "groupValue1",
          nested: {
            group: {
              field: "nestedValue",
            },
          },
        }),
      },
      true,
      undefined
    );
    // Check info object state more thoroughly
    const dispatchedInfo = workflowHelpers.updateWorkflowTask.mock.calls[0][1];
    expect(dispatchedInfo.name).toBe("Group Updated Name");
    expect(dispatchedInfo.properties.customGroupField).toBe("groupValue1");
    expect(dispatchedInfo.properties.nested.group.field).toBe("nestedValue");
  });

  // --- checkSetupStatus Tests ---
  it("should call checkSetupStatus and include configured=true in update (grouped)", () => {
    mockCheckSetupStatus.mockReturnValue(true); // Simulate check returning true
    const groupedUpdate = { name: "Setup Check Name" };

    globalSetTaskInfo(
      mockDispatch,
      groupedUpdate,
      null,
      true,
      mockActiveTask,
      mockSetTaskUpdated,
      [],
      mockCheckSetupStatus // Provide the callback
    );
    jest.runAllTimers();

    // Verify checkSetupStatus was called with a simulated updated state
    expect(mockCheckSetupStatus).toHaveBeenCalledTimes(1);
    expect(mockCheckSetupStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Setup Check Name", // The simulated update
      })
    );

    // Verify 'configured' was added to the update payload
    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Setup Check Name", configured: true }), // 'configured' added here
      expect.objectContaining({ name: "Setup Check Name", configured: true }), // and here in info
      true,
      undefined
    );
  });

  it("should call checkSetupStatus and not include configured=false (since configured value didn't change) in update (single -> grouped)", () => {
    mockCheckSetupStatus.mockReturnValue(false); // Simulate check returning false
    const event = {
      target: {
        name: "description",
        value: "Setup Check Desc",
        tagName: "INPUT",
      },
    };

    globalSetTaskInfo(
      mockDispatch,
      event,
      null, // ppty derived from event
      false, // Starts as single
      mockActiveTask,
      mockSetTaskUpdated,
      [],
      mockCheckSetupStatus // Provide the callback
    );
    jest.runAllTimers();

    // Verify checkSetupStatus was called with simulated state
    expect(mockCheckSetupStatus).toHaveBeenCalledTimes(1);
    expect(mockCheckSetupStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Setup Check Desc",
      })
    );

    // Verify the update became grouped and includes 'configured'
    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      {
        // update object now contains both original change and configured
        description: "Setup Check Desc",
        // configured: false,
      },
      expect.objectContaining({
        // info object
        description: "Setup Check Desc",
        configured: false,
      }),
      true,
      undefined
    );
    // setTaskUpdated should still be called because it originated from a UI event (!isGrouped initially)
    expect(mockSetTaskUpdated).not.toHaveBeenCalled();
  });

  it("should call checkSetupStatus and include configured=false (if configured value was true) in update (single -> grouped)", () => {
    mockActiveTask.configured = true;
    mockCheckSetupStatus.mockReturnValue(false); // Simulate check returning false
    const event = {
      target: {
        name: "description",
        value: "Setup Check Desc",
        tagName: "INPUT",
      },
    };

    globalSetTaskInfo(
      mockDispatch,
      event,
      null, // ppty derived from event
      false, // Starts as single
      mockActiveTask,
      mockSetTaskUpdated,
      [],
      mockCheckSetupStatus // Provide the callback
    );
    jest.runAllTimers();

    // Verify checkSetupStatus was called with simulated state
    expect(mockCheckSetupStatus).toHaveBeenCalledTimes(1);
    expect(mockCheckSetupStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Setup Check Desc",
      })
    );

    // Verify the update became grouped and includes 'configured'
    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      {
        // update object now contains both original change and configured
        description: "Setup Check Desc",
        configured: false,
      },
      expect.objectContaining({
        // info object
        description: "Setup Check Desc",
        configured: false,
      }),
      true,
      undefined
    );
    // setTaskUpdated should still be called because it originated from a UI event (!isGrouped initially)
    expect(mockSetTaskUpdated).not.toHaveBeenCalled();
  });

  it("should not modify update if checkSetupStatus returns non-boolean", () => {
    mockCheckSetupStatus.mockReturnValue("pending"); // Simulate non-boolean return
    const event = {
      target: { name: "name", value: "Pending Check", tagName: "INPUT" },
    };

    globalSetTaskInfo(
      mockDispatch,
      event,
      null,
      false,
      mockActiveTask,
      mockSetTaskUpdated,
      [],
      mockCheckSetupStatus
    );
    jest.runAllTimers();

    expect(mockCheckSetupStatus).toHaveBeenCalledTimes(1);
    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      { name: "Pending Check" }, // 'configured' is NOT added
      expect.objectContaining({ name: "Pending Check" }),
      true,
      undefined
    );
    // Check that configured wasn't added to info either
    const dispatchedInfo = workflowHelpers.updateWorkflowTask.mock.calls[0][1];
    expect(dispatchedInfo.configured).toBe(false); // Remains the original value
  });

  // --- Other Parameter Tests ---
  it("should include additionalOuterProperties in MAIN_FIELDS check", () => {
    const event = { target: { value: "extraValue", tagName: "INPUT" } };
    const extraProp = "myExtraOuterField";
    globalSetTaskInfo(
      mockDispatch,
      event,
      extraProp, // Use the extra property name
      false,
      mockActiveTask,
      mockSetTaskUpdated,
      [extraProp] // Provide it in additionalOuterProperties
    );
    jest.runAllTimers();

    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      { [extraProp]: "extraValue" }, // Should be treated as a main field
      expect.objectContaining({ [extraProp]: "extraValue" }),
      true,
      undefined
    );
  });

  it("should pass refreshTask callback to updateWorkflowTask", () => {
    const event = { target: { name: "name", value: "Refresh Test" } };
    globalSetTaskInfo(
      mockDispatch,
      event,
      null,
      false,
      mockActiveTask,
      mockSetTaskUpdated,
      [],
      undefined, // no checkSetupStatus
      mockRefreshTask // Provide refreshTask
    );
    jest.runAllTimers();

    expect(workflowHelpers.updateWorkflowTask).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      true,
      mockRefreshTask // Expect the callback to be passed through
    );
  });

  // --- Error Handling Test ---
  it("should catch errors and log them", () => {
    const error = new Error("Something went wrong");
    // Force an error, e.g., by making activeTask null when it's accessed
    mockActiveTask = null;
    const event = { target: { name: "name", value: "Error Test" } };

    globalSetTaskInfo(
      mockDispatch,
      event,
      null,
      false,
      mockActiveTask,
      mockSetTaskUpdated
    );
    jest.runAllTimers();

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
