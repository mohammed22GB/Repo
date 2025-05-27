import { manageAppLocalStorage } from "./index";
// Create a mock object for localStorage
const mockLocalStorage = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString(); // Ensure value is a string
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    __getStore: () => store, //optional method to view the entire localStorage
  };
})();

// Mock the global localStorage object with the mockLocalStorage
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("manageAppLocalStorage", () => {
  const mockAppId = "testAppId";
  const mockPpty = "activeScreen";
  const mockValue = "testValue";

  beforeEach(() => {
    localStorage.clear();
    // Mock window.location.pathname for cases where appId is not provided
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost/editor/testAppId/uieditor"),
      writable: true,
    });
  });

  afterEach(() => {
    localStorage.clear();
    // Reset window.location
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost"),
      writable: true,
    });
  });

  it("should set a value in localStorage", () => {
    manageAppLocalStorage("set", mockAppId, mockPpty, mockValue);
    const stored = JSON.parse(localStorage.getItem("plug_app_meta_data"));
    expect(stored).toEqual({ [mockAppId]: { [mockPpty]: mockValue } });
  });

  it("should get a value from localStorage", () => {
    manageAppLocalStorage("set", mockAppId, mockPpty, mockValue);
    const retrievedValue = manageAppLocalStorage("get", mockAppId, mockPpty);
    expect(retrievedValue).toBe(mockValue);
  });

  it("should clear data for a specific appId", () => {
    manageAppLocalStorage("set", mockAppId, mockPpty, mockValue);
    manageAppLocalStorage("clear", mockAppId, mockPpty);
    const stored = localStorage.getItem("plug_app_meta_data");
    expect(stored).toBe("{}");
  });

  it("should return null for an invalid property", () => {
    const result = manageAppLocalStorage("get", mockAppId, "invalidProperty");
    expect(result).toBeNull();
  });

  it("should return null for an invalid action", () => {
    const result = manageAppLocalStorage(
      "invalidAction",
      mockAppId,
      mockPpty,
      mockValue
    );
    expect(result).toBeNull();
  });

  it("should handle appId not provided, default to current pathname", () => {
    manageAppLocalStorage("set", null, mockPpty, mockValue);
    const stored = JSON.parse(localStorage.getItem("plug_app_meta_data"));
    expect(stored).toEqual({ [mockAppId]: { [mockPpty]: mockValue } });
  });

  it("should return false if appId is not provided and not on editor page", () => {
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost/apps"), // Simulating not being on an editor page
      writable: true,
    });
    const result = manageAppLocalStorage("set", null, mockPpty, mockValue);
    expect(result).toBe(false);
  });

  it("should allow setting multiple properties for the same app", () => {
    manageAppLocalStorage("set", mockAppId, "activeScreen", "value1");
    manageAppLocalStorage("set", mockAppId, "activeWorkflow", "value2");

    const storedData = JSON.parse(localStorage.getItem("plug_app_meta_data"));
    expect(storedData).toEqual({
      [mockAppId]: {
        activeScreen: "value1",
        activeWorkflow: "value2",
      },
    });

    expect(manageAppLocalStorage("get", mockAppId, "activeScreen")).toBe(
      "value1"
    );
    expect(manageAppLocalStorage("get", mockAppId, "activeWorkflow")).toBe(
      "value2"
    );
  });

  it("should handle multiple appIds", () => {
    const mockAppId2 = "testAppId2";

    manageAppLocalStorage("set", mockAppId, mockPpty, mockValue);
    manageAppLocalStorage("set", mockAppId2, mockPpty, "testValue2");

    const stored = JSON.parse(localStorage.getItem("plug_app_meta_data"));
    expect(stored).toEqual({
      [mockAppId]: { [mockPpty]: mockValue },
      [mockAppId2]: { [mockPpty]: "testValue2" },
    });
  });

  it("should work with valid property names in localStorageableProperties", () => {
    const validProps = [
      "app",
      "activeScreen",
      "activeWorkflow",
      "screenStyles",
      "uieCanvasMode",
      "isNew",
      "canvasPositioning",
    ];

    validProps.forEach((prop) => {
      manageAppLocalStorage("set", mockAppId, prop, "validValue");
      expect(manageAppLocalStorage("get", mockAppId, prop)).toBe("validValue");
    });
  });
});
