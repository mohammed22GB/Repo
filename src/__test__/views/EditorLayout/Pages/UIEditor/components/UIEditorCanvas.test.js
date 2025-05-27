import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as reactRedux from "react-redux";
import { MemoryRouter } from "react-router-dom";
import * as liveData from "../../../../../../views/common/helpers/LiveData";
import { mockThemeAndRouter } from "../../../../../../test-utilities/testMocks/themeRouter";
import MockProvider from "../../../../../../test-utilities/testMocks/reduxStore";
import UIEditorCanvas from "../../../../../../views/EditorLayout/Pages/UIEditor/components/UIEditorCanvas";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  __esModule: true,
  ...jest.requireActual("react-router-dom"),
  default: (...args) => mockFunc((...args) => ({})),
}));
jest.mock("react-pdf", () => ({
  pdfjs: {
    GlobalWorkerOptions: { workerSrc: {} },
  },
  Document: () => () => <div>Document</div>,
  Page: () => () => <div>Page</div>,
  default: (...args) => mockFunc((...args) => ({})),
}));
jest.mock("pdfjs-dist/build/pdf.worker.entry", () => ({
  default: (...args) => mockFunc((...args) => ({})),
}));

jest.mock("../../../../../../views/common/helpers/LiveData", () => ({
  getLiveData: jest.fn(),
  runCurrentTask: jest.fn(),
}));

describe("UIEditorCanvas", () => {
  let props, storeData;
  const mockInitiateCustomValidationSetup = jest.fn();

  beforeEach(() => {
    storeData = {
      auth: { user: { id: "test-user" } },
      liveData: {
        screen: {
          items: [],
        },
        runFirstScreen: "67ab34798586acfe8a3b555a",
        screenLoading: false,
        screenError: null,
        error: null,
        workflowInstance: {
          status: "in-progress",
          variables: [],
          active: true,
          _id: "67ab36a18586acfe8a3b5642",
          app: "67ab34798586acfe8a3b5554",
          workflow: "67ab34798586acfe8a3b5556",
          task: "67ab36758586acfe8a3b55a6",
          statusHistory: [],
          __v: 0,
          approvalHistory: [],
          id: "67ab36a18586acfe8a3b5642",
        },
        taskRunning: false,
        task: {
          properties: {
            screenReuse: {
              isReusableScreen: false,
              isReusingScreen: false,
              fieldsAttributes: [{}],
              reusableScreenVariableId: "",
              reusableScreenTaskId: "",
            },
            dynamicContents: [],
            _dynamicContentsStructure: [],
            screenType: "app",
            previewDownload: false,
            screen: "67ab34798586acfe8a3b555a",
          },
          _id: "67ab36758586acfe8a3b55a6",
          workflow: "67ab34798586acfe8a3b5556",
          name: "scr",
          index: 2,
          nextTask: "67ab347a8586acfe8a3b5567",
          id: "67ab36758586acfe8a3b55a6",
        },
        screensInfo: {
          _id: "67ab34798586acfe8a3b555a",
          type: "app",
          style: {},
          layout: {
            master: true,
            orientation: "horizontal",
            children: [
              {
                orientation: "vertical",
                children: [
                  {
                    id: "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6",
                    itemType: "dateTime",
                  },
                  {
                    id: "e60779f6-847c-4f86-97f9-d6b9fe98c31a",
                    itemType: "inputText",
                  },
                ],
              },
            ],
          },
          active: true,
          deleted: false,
          app: "67ab34798586acfe8a3b5554",
          name: "Screen 1",
          slug: "screen-1-2",
          items: [
            {
              _id: "67ab34858586acfe8a3b557e",
              default: false,
              toVariable: true,
              isDynamic: false,
              isComputed: false,
              forLookup: false,
              data: [],
              active: true,
              deleted: false,
              name: "My date time",
              itemRef: "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6",
              type: "dateTime",
              title: "Date Time",
              dataType: "text",
              id: "67ab34858586acfe8a3b557e",
              values: {
                label: "Start Date",
                datePlaceholder: "Enter date placeholder here",
                timePlaceholder: "Enter time placeholder here",
                toolTip: "Enter toolTip",
                hideLabel: false,
                showDate: true,
                showTime: false,
                showTooltip: false,
                rangeStartId: "5e26c8b3-4273-488a-ab08-f7a9b2786dee",
                rangeEndId: "95eb13c0-b239-4395-b725-e43686c2d44d",
                rangeDurationId: "e8870cbb-6683-43a6-9015-d884313bdaeb",
                setRange: true,
                hasDuration: true,
                required: true,
                durationMeasure: "day",
              },
            },
            {
              _id: "67ab348b8586acfe8a3b5588",
              default: false,
              toVariable: true,
              isDynamic: false,
              isComputed: false,
              forLookup: false,
              data: [],
              active: true,
              deleted: false,
              name: "input1",
              itemRef: "e60779f6-847c-4f86-97f9-d6b9fe98c31a",
              type: "inputText",
              title: "Input Text",
              dataType: "text",
              id: "67ab348b8586acfe8a3b5588",
            },
          ],
          id: "67ab34798586acfe8a3b555a",
        },
        app: {
          isPublic: false,
          hasPlugTrigger: true,
          hasWebhookTrigger: false,
          active: true,
          _id: "67ab34798586acfe8a3b5554",
          feVersion: "1.0.0",
          slug: "testing-testing",
          beVersion: "1.1.4",
          id: "67ab34798586acfe8a3b5554",
        },
        filesUploaded: {},
      },
      screens: {
        activeScreen: {
          _id: "67ab34798586acfe8a3b555a",
          type: "app",
          style: {},
          layout: {
            master: true,
            orientation: "horizontal",
            children: [
              {
                orientation: "vertical",
                children: [
                  {
                    id: "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6",
                    itemType: "dateTime",
                  },
                  {
                    id: "e60779f6-847c-4f86-97f9-d6b9fe98c31a",
                    itemType: "inputText",
                  },
                ],
              },
            ],
          },
          active: true,
          deleted: false,
          items: [
            {
              _id: "67ab34858586acfe8a3b557e",
              toVariable: true,
              isDynamic: false,
              isComputed: false,
              forLookup: false,
              data: [],
              name: "My date time",
              itemRef: "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6",
              type: "dateTime",
              screen: "67ab34798586acfe8a3b555a",
              title: "Date Time",
              dataType: "text",
              id: "67ab34858586acfe8a3b557e",
              values: {
                label: "Start Date",
                datePlaceholder: "Enter date placeholder here",
                timePlaceholder: "Enter time placeholder here",
                toolTip: "Enter toolTip",
                hideLabel: false,
                showDate: true,
                showTime: false,
                showTooltip: false,
                rangeStartId: "5e26c8b3-4273-488a-ab08-f7a9b2786dee",
                rangeEndId: "95eb13c0-b239-4395-b725-e43686c2d44d",
                rangeDurationId: "e8870cbb-6683-43a6-9015-d884313bdaeb",
                setRange: true,
                hasDuration: true,
                required: true,
                durationMeasure: "day",
              },
            },
            {
              _id: "67ab348b8586acfe8a3b5588",
              toVariable: true,
              isDynamic: false,
              isComputed: false,
              forLookup: false,
              data: [],
              active: true,
              deleted: false,
              name: "input1",
              itemRef: "e60779f6-847c-4f86-97f9-d6b9fe98c31a",
              type: "inputText",
              title: "Input Text",
              dataType: "text",
              id: "67ab348b8586acfe8a3b5588",
              values: {
                placeholder: "Enter value here",
              },
            },
          ],
          id: "67ab34798586acfe8a3b555a",
        },
      },
      uieditor: {
        canvasStructure: {
          master: true,
          orientation: "horizontal",
          children: [
            {
              orientation: "vertical",
              children: [
                {
                  id: "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6",
                  itemType: "dateTime",
                },
                {
                  id: "e60779f6-847c-4f86-97f9-d6b9fe98c31a",
                  itemType: "inputText",
                },
              ],
            },
          ],
        },
        dragStart: {},
        screensItems: {
          "67ab34798586acfe8a3b555a": {
            "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6": {
              _id: "67ab34858586acfe8a3b557e",
              default: false,
              toVariable: true,
              isDynamic: false,
              isComputed: false,
              forLookup: false,
              data: [],
              name: "My date time",
              itemRef: "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6",
              type: "dateTime",
              dataType: "text",
              id: "67ab34858586acfe8a3b557e",
              values: {
                label: "Start Date",
                datePlaceholder: "Enter date placeholder here",
                timePlaceholder: "Enter time placeholder here",
                toolTip: "Enter toolTip",
                hideLabel: false,
                showDate: true,
                showTime: false,
                showTooltip: false,
                rangeStartId: "5e26c8b3-4273-488a-ab08-f7a9b2786dee",
                rangeEndId: "95eb13c0-b239-4395-b725-e43686c2d44d",
                rangeDurationId: "e8870cbb-6683-43a6-9015-d884313bdaeb",
                setRange: true,
                hasDuration: true,
                required: true,
                durationMeasure: "day",
              },
            },
            "e60779f6-847c-4f86-97f9-d6b9fe98c31a": {
              _id: "67ab348b8586acfe8a3b5588",
              default: false,
              toVariable: true,
              isDynamic: false,
              isComputed: false,
              forLookup: false,
              data: [],
              name: "input1",
              itemRef: "e60779f6-847c-4f86-97f9-d6b9fe98c31a",
              type: "inputText",
              dataType: "text",
              __v: 0,
              id: "67ab348b8586acfe8a3b5588",
              values: {
                placeholder: "Enter value here",
              },
            },
          },
        },
        activeItem: {},
        uieCanvasMode: "live",
      },
      reducers: {},
    };

    const mockDispatch = jest.fn();
    reactRedux.useDispatch.mockReturnValue(mockDispatch);
    liveData.getLiveData.mockImplementation(() => async (dispatch) => {
      dispatch(mockResponse);
      return mockResponse;
    });
    liveData.runCurrentTask.mockImplementation(() => async (dispatch) => {
      dispatch(mockResponse);
      return mockResponse;
    });
  });
  afterEach(() => {
    cleanup();
  });

  const UIEditorCanvasComponent = (props, updatedStoreData, options) => {
    return mockThemeAndRouter(
      <MockProvider storeData={updatedStoreData || storeData}>
        <MemoryRouter initialEntries={["/login"]}>
          <UIEditorCanvas {...props} />
        </MemoryRouter>
      </MockProvider>,
      { ...(options || {}) }
    );
  };

  it("calls initiateCustomValidationSetup on initial render", async () => {
    UIEditorCanvasComponent({
      ...props,
      initiateCustomValidationSetup: mockInitiateCustomValidationSetup,
    });

    await waitFor(() => {
      expect(mockInitiateCustomValidationSetup).toHaveBeenCalled();
      expect(mockInitiateCustomValidationSetup).toHaveBeenCalledWith(
        Object.values(
          storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"]
        )
      );
      expect(mockInitiateCustomValidationSetup).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ type: "dateTime" })])
      );
    });
  });

  it("calls initiateCustomValidationSetup again when activeScreenId changes with the new screenItems based on the activeScreenId", async () => {
    const updatedStoreData = {
      ...storeData,
      screens: {
        ...storeData.screens,
        activeScreen: { id: "new-screen-id" },
      },
      uieditor: {
        ...storeData.uieditor,
        screensItems: {
          "new-screen-id": {
            "new-item-id-1": {
              _id: "new-id-1",
              name: "new-item-1",
              itemRef: "new-item-id-1",
            },
            "new-dateTime-item": {
              _id: "new-id-2",
              name: "new-dateTime-item",
              itemRef: "new-dateTime-item",
              type: "dateTime",
            },
            "new-item-id-2": {
              _id: "new-id-2",
              name: "new-item-2",
              itemRef: "new-item-id-2",
            },
          },
        },
      },
    };

    storeData = updatedStoreData;

    UIEditorCanvasComponent({
      ...props,
      initiateCustomValidationSetup: mockInitiateCustomValidationSetup,
    });

    await waitFor(() => {
      expect(mockInitiateCustomValidationSetup).toHaveBeenCalled();
      expect(mockInitiateCustomValidationSetup).toHaveBeenCalledWith(
        Object.values(updatedStoreData.uieditor.screensItems["new-screen-id"])
      );
      expect(mockInitiateCustomValidationSetup).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ type: "dateTime" })])
      );
    });
  });
});
