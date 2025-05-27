import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as reactRedux from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { mockThemeAndRouter } from "../../../test-utilities/testMocks/themeRouter";
import MockProvider from "../../../test-utilities/testMocks/reduxStore";
import { RunScreen } from "..";
import * as liveData from "../../common/helpers/LiveData";

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

jest.mock("../../../views/common/helpers/LiveData", () => ({
  getLiveData: jest.fn(),
  runCurrentTask: jest.fn(),
}));

describe("RunScreen", () => {
  let props, storeData;

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
                    itemType: "inputText",
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
              name: "input1",
              itemRef: "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6",
              type: "inputText",
              title: "Input Text",
              dataType: "text",
              id: "67ab34858586acfe8a3b557e",
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
              name: "input2",
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
                    itemType: "inputText",
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
              name: "input1",
              itemRef: "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6",
              type: "inputText",
              screen: "67ab34798586acfe8a3b555a",
              title: "Input Text",
              dataType: "text",
              id: "67ab34858586acfe8a3b557e",
              values: {
                placeholder: "Enter value here",
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
              name: "input2",
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
                  itemType: "inputText",
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
              name: "input1",
              itemRef: "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6",
              type: "inputText",
              dataType: "text",
              id: "67ab34858586acfe8a3b557e",
              values: {
                placeholder: "Enter value here",
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
              name: "input2",
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

  const runScreenComponent = (props, updatedStoreData, options) =>
    mockThemeAndRouter(
      <MockProvider storeData={updatedStoreData || storeData}>
        <MemoryRouter initialEntries={["/login"]}>
          <RunScreen {...props} />
        </MemoryRouter>
      </MockProvider>,
      { ...(options || {}) }
    );

  describe("RunScreen rendering", () => {
    it("renders not-required items, and submits form without input data", async () => {
      let nextButton,
        rendersUiEditorCanvas,
        rendersItems,
        requiredFieldErrorMsg;

      runScreenComponent(props);

      await waitFor(async () => {
        rendersUiEditorCanvas = screen.queryByTestId("ui-editor-canvas");
        rendersItems = screen.queryAllByPlaceholderText("Enter value here");
        nextButton = await screen.findByRole("button", {
          name: "Next",
        });

        expect(rendersUiEditorCanvas).toBeTruthy();
        expect(rendersItems).toBeTruthy();
        expect(nextButton).toBeInTheDocument();
      });

      await waitFor(async () => {
        await userEvent.click(nextButton);
        expect(liveData.runCurrentTask).toHaveBeenCalled();

        requiredFieldErrorMsg = screen.queryByText(
          "* complete required fields"
        );
        expect(requiredFieldErrorMsg).toBeNull();
      });
    });

    it("renders required items but doesn't submit except with all required fields filled", async () => {
      let nextButton,
        rendersUiEditorCanvas,
        rendersItems,
        requiredFieldErrorMsg;

      const updatedStoreData = {
        ...storeData,
        screens: {
          ...storeData.screens,
          activeScreen: {
            ...storeData.screens.activeScreen,
            items: storeData.screens.activeScreen.items.map((item) => ({
              ...item,
              values: {
                required: true,
              },
            })),
          },
        },
        uieditor: {
          ...storeData.uieditor,
          screensItems: {
            ...storeData.uieditor.screensItems,
            "67ab34798586acfe8a3b555a": {
              ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"],
              "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6": {
                ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"][
                  "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6"
                ],
                values: {
                  ...storeData.uieditor.screensItems[
                    "67ab34798586acfe8a3b555a"
                  ]["14528a39-ac7c-4eb6-9a36-59e82e7d2ad6"].values,
                  required: true,
                },
              },
              "e60779f6-847c-4f86-97f9-d6b9fe98c31a": {
                ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"][
                  "e60779f6-847c-4f86-97f9-d6b9fe98c31a"
                ],
                values: {
                  ...storeData.uieditor.screensItems[
                    "67ab34798586acfe8a3b555a"
                  ]["e60779f6-847c-4f86-97f9-d6b9fe98c31a"].values,
                  required: true,
                },
              },
            },
          },
        },
      };

      runScreenComponent(props, updatedStoreData);

      await waitFor(async () => {
        rendersUiEditorCanvas = screen.queryByTestId("ui-editor-canvas");
        rendersItems = screen.queryAllByPlaceholderText("Enter value here");

        expect(rendersUiEditorCanvas).toBeTruthy();
        expect(rendersItems).toHaveLength(2);
      });

      await waitFor(async () => {
        nextButton = await screen.findByRole("button", {
          name: "Next",
        });
        expect(nextButton).toBeInTheDocument();

        await userEvent.click(nextButton);
        expect(liveData.runCurrentTask).not.toHaveBeenCalled();
      });

      requiredFieldErrorMsg = await screen.findByText(
        "* complete required fields"
      );
      expect(requiredFieldErrorMsg).toBeInTheDocument();

      /* submission fails if only one of two required fields are filled */
      await waitFor(async () => {
        await userEvent.type(rendersItems[0], "first text");
        await userEvent.click(nextButton);

        expect(requiredFieldErrorMsg).toBeInTheDocument();
        expect(liveData.runCurrentTask).not.toHaveBeenCalled();
      });

      /* submission passes if both required fields are filled */
      await waitFor(async () => {
        await userEvent.type(rendersItems[1], "second text");
        await userEvent.click(nextButton);

        expect(requiredFieldErrorMsg).not.toBeInTheDocument();
        expect(liveData.runCurrentTask).toHaveBeenCalled();
      });
    });

    it("renders reusable field values and passes form submission if field is hidden and required but empty", async () => {
      let nextButton, rendersUiEditorCanvas, rendersItems;

      const reusableFieldsAttributes = {
        "67ab34858586acfe8a3b557e": {
          name: "input1",
          attribute: "hidden",
          value: "",
        },
        "67ab348b8586acfe8a3b5588": {
          name: "input2",
          attribute: "readonly",
          value: "sdsd",
        },
      };

      const updatedStoreData = {
        ...storeData,
        screens: {
          ...storeData.screens,
          activeScreen: {
            ...storeData.screens.activeScreen,
            items: storeData.screens.activeScreen.items.map((item) => ({
              ...item,
              values: {
                required: true,
              },
            })),
          },
        },
        uieditor: {
          ...storeData.uieditor,
          screensItems: {
            ...storeData.uieditor.screensItems,
            "67ab34798586acfe8a3b555a": {
              ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"],
              "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6": {
                ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"][
                  "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6"
                ],
                values: {
                  ...storeData.uieditor.screensItems[
                    "67ab34798586acfe8a3b555a"
                  ]["14528a39-ac7c-4eb6-9a36-59e82e7d2ad6"].values,
                  required: true,
                },
              },
              "e60779f6-847c-4f86-97f9-d6b9fe98c31a": {
                ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"][
                  "e60779f6-847c-4f86-97f9-d6b9fe98c31a"
                ],
                values: {
                  ...storeData.uieditor.screensItems[
                    "67ab34798586acfe8a3b555a"
                  ]["e60779f6-847c-4f86-97f9-d6b9fe98c31a"].values,
                  required: true,
                },
              },
            },
          },
        },
        liveData: {
          ...storeData.liveData,
          task: {
            ...storeData.liveData.task,
            properties: {
              ...storeData.liveData.task.properties,
              screenReuse: {
                ...storeData.liveData.task.properties.screenReuse,
                isReusableScreen: false,
                isReusingScreen: true,
                fieldsAttributes: [reusableFieldsAttributes],
                reusableScreenVariableId:
                  "e13843ba-4ef7-4f21-b1fa-cdefcd338332",
                reusableScreenTaskId: "aa8b1d20-720d-45b0-8e14-90cfb87341af",
              },
            },
          },
        },
        workflowInstance: {
          ...storeData.workflowInstance,
          reusableFields: reusableFieldsAttributes,
        },
      };

      runScreenComponent(props, updatedStoreData);

      await waitFor(async () => {
        rendersUiEditorCanvas = screen.queryByTestId("ui-editor-canvas");
        rendersItems = screen.queryAllByPlaceholderText("Enter value here");

        expect(rendersUiEditorCanvas).toBeTruthy();
        expect(rendersItems).toHaveLength(2);
      });

      await waitFor(async () => {
        nextButton = await screen.findByRole("button", {
          name: "Next",
        });
        expect(nextButton).toBeInTheDocument();

        await userEvent.click(nextButton);
        expect(liveData.runCurrentTask).toHaveBeenCalled();
      });
    });

    it("renders conditional required items and passes form submission if field is hidden and required but empty", async () => {
      let nextButton,
        rendersUiEditorCanvas,
        rendersItems,
        requiredFieldErrorMsg;

      const updatedStoreData = {
        ...storeData,
        screens: {
          ...storeData.screens,
          activeScreen: {
            ...storeData.screens.activeScreen,
            items: storeData.screens.activeScreen.items.map((item) => ({
              ...item,
              values: {
                required: true,
                conditionals: true,
                conditionalElement: {},
              },
            })),
          },
        },
        uieditor: {
          ...storeData.uieditor,
          screensItems: {
            ...storeData.uieditor.screensItems,
            "67ab34798586acfe8a3b555a": {
              ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"],
              "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6": {
                ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"][
                  "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6"
                ],
                values: {
                  ...storeData.uieditor.screensItems[
                    "67ab34798586acfe8a3b555a"
                  ]["14528a39-ac7c-4eb6-9a36-59e82e7d2ad6"].values,
                  required: true,
                  conditionals: true,
                  conditionalElement: {},
                },
              },
              "e60779f6-847c-4f86-97f9-d6b9fe98c31a": {
                ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"][
                  "e60779f6-847c-4f86-97f9-d6b9fe98c31a"
                ],
                values: {
                  ...storeData.uieditor.screensItems[
                    "67ab34798586acfe8a3b555a"
                  ]["e60779f6-847c-4f86-97f9-d6b9fe98c31a"].values,
                  required: true,
                  conditionals: true,
                  conditionalElement: {},
                },
              },
            },
          },
        },
      };

      runScreenComponent(props, updatedStoreData);

      await waitFor(async () => {
        rendersUiEditorCanvas = screen.queryByTestId("ui-editor-canvas");
        rendersItems = screen.queryAllByPlaceholderText("Enter value here");

        expect(rendersUiEditorCanvas).toBeTruthy();
        expect(rendersItems).toHaveLength(2);
      });

      await waitFor(async () => {
        nextButton = await screen.findByRole("button", {
          name: "Next",
        });
        expect(nextButton).toBeInTheDocument();

        await userEvent.click(nextButton);
        expect(liveData.runCurrentTask).toHaveBeenCalled();
      });
    });

    it("renders LOADING when canvasSctructure is not loaded", async () => {
      let rendersRunScreenLoading;

      const updatedStoreData = {
        ...storeData,
        uieditor: {
          ...storeData.uieditor,
          screensItems: {},
          canvasStructure: {},
        },
      };

      runScreenComponent(props, updatedStoreData);

      await waitFor(async () => {
        rendersRunScreenLoading = screen.queryByText("L O A D I N G . . .");

        expect(rendersRunScreenLoading).toBeInTheDocument();
      });
    });

    it("doesn't render LOADING when canvasSctructure is not loaded and error is returned", async () => {
      let rendersRunScreenLoading, rendersErrorCode, rendersRErrorMessage;
      const error = {
        code: "LOAD ERROR",
        message: "An error just occured",
      };

      const updatedStoreData = {
        ...storeData,
        uieditor: {
          ...storeData.uieditor,
          screensItems: {},
          canvasStructure: {},
        },
        liveData: {
          ...storeData.liveData,
          error,
        },
      };

      runScreenComponent(props, updatedStoreData);

      await waitFor(async () => {
        rendersRunScreenLoading = screen.queryByText("L O A D I N G . . .");
        rendersErrorCode = screen.queryByText(error.code);
        rendersRErrorMessage = screen.queryByText(error.message);

        expect(rendersRunScreenLoading).not.toBeInTheDocument();
        expect(rendersErrorCode).toBeInTheDocument();
        expect(rendersRErrorMessage).toBeInTheDocument();
      });
    });
  });

  describe("Document Screen rendering", () => {
    it("shows 'Download PDF' button if and only if screenType is 'document' and 'previewDownload' is true", async () => {
      let rendersDocScreenNextBtn, rendersDocScreenDownloadBtn;
      const formDataMock = jest.fn().mockImplementation(() => ({
        append: jest.fn(),
      }));
      global.FormData = formDataMock;
      const updatedStoreData = {
        ...storeData,
        screens: {
          ...storeData.screens,
          activeScreen: {
            ...storeData.screens.activeScreen,
            type: "document",
            items: storeData.screens.activeScreen.items.map((item) => ({
              ...item,
              values: {
                required: true,
                conditionals: true,
                conditionalElement: {},
              },
            })),
          },
        },
        uieditor: {
          ...storeData.uieditor,
          screensItems: {
            ...storeData.uieditor.screensItems,
            "67ab34798586acfe8a3b555a": {
              ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"],
              "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6": {
                ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"][
                  "14528a39-ac7c-4eb6-9a36-59e82e7d2ad6"
                ],
                values: {
                  ...storeData.uieditor.screensItems[
                    "67ab34798586acfe8a3b555a"
                  ]["14528a39-ac7c-4eb6-9a36-59e82e7d2ad6"].values,
                  required: true,
                  conditionals: true,
                  conditionalElement: {},
                },
              },
              "e60779f6-847c-4f86-97f9-d6b9fe98c31a": {
                ...storeData.uieditor.screensItems["67ab34798586acfe8a3b555a"][
                  "e60779f6-847c-4f86-97f9-d6b9fe98c31a"
                ],
                values: {
                  ...storeData.uieditor.screensItems[
                    "67ab34798586acfe8a3b555a"
                  ]["e60779f6-847c-4f86-97f9-d6b9fe98c31a"].values,
                  required: true,
                  conditionals: true,
                  conditionalElement: {},
                },
              },
            },
          },
        },
        liveData: {
          ...storeData.liveData,
          task: {
            ...storeData.liveData.task,
            properties: {
              ...storeData.liveData.task.properties,
              screenType: "document",
              previewDownload: true,
            },
          },
          screensInfo: {
            ...storeData.liveData.screensInfo,
            type: "document",
          },
        },
      };

      runScreenComponent(props, updatedStoreData);

      rendersDocScreenNextBtn = screen.queryByRole("button", {
        name: "Next",
      });
      rendersDocScreenDownloadBtn = screen.queryByRole("button", {
        name: "Download PDF",
      });

      expect(rendersDocScreenNextBtn).toBeInTheDocument();
      expect(rendersDocScreenDownloadBtn).toBeInTheDocument();
    });
  });
});
