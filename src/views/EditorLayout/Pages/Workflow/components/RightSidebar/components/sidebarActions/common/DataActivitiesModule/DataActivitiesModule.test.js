import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router";

import * as integrationsAPIs from "../../../../../../../../../Integrations/utils/integrationsAPIs";
import * as workflowHelpers from "../../../../../../utils/workflowHelpers";
import MockProvider from "../../../../../../../../../../test-utilities/testMocks/reduxStore";
import DataActivitiesModule from ".";
import { mockThemeAndRouter } from "../../../../../../../../../../test-utilities/testMocks/themeRouter";
import { plugDataSourceTypes } from "../../../../../utils/constants";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock(
  "../../../../../../../../../Integrations/utils/integrationsAPIs",
  () => ({
    getGoogleSheetSheet: jest.fn(),
  })
);

jest.mock("../../../../../../utils/workflowHelpers", () => ({
  ...jest.requireActual("../../../../../../utils/workflowHelpers"),
  getAllWorkflowDatasheets: jest.fn(),
  getAllWorkflowIntegrations: jest.fn(),
}));

const mockStore = configureStore([]);

describe("DataActivitiesModule", () => {
  let storeData;
  const commonProps = {
    data: {
      dataSourceType: plugDataSourceTypes.VARIABLES,
    },
    updateData: jest.fn(),
  };

  beforeEach(() => {
    storeData = {
      workflows: {
        workflowTasks: {
          task1: {
            id: "task1",
            type: "ComputationTask",
            name: "Computation Task",
            properties: {},
          },
        },
        workflowCanvas: [],
        activeTask: {
          id: "task1",
        },
        variables: [],
      },
    };
    jest.clearAllMocks();
    require("react-redux").useSelector.mockImplementation((callback) => {
      return callback(storeData);
    });

    integrationsAPIs.getGoogleSheetSheet.mockResolvedValue({
      _meta: { success: true },
      data: { sheets: [] },
    });

    workflowHelpers.getAllWorkflowDatasheets.mockResolvedValue([]);
    workflowHelpers.getAllWorkflowIntegrations.mockResolvedValue({ data: [] });
    commonProps.updateData.mockClear();
  });

  const renderDataActivitiesModuleComponent = (
    props,
    updatedStoreData,
    options
  ) =>
    mockThemeAndRouter(
      <MockProvider storeData={updatedStoreData || storeData}>
        <MemoryRouter>
          <DataActivitiesModule {...props} />
        </MemoryRouter>
      </MockProvider>,
      { ...(options || {}) }
    );

  it("renders without crashing", () => {
    renderDataActivitiesModuleComponent(commonProps);
    expect(screen.getByText(/Data source type/i)).toBeInTheDocument();
  });

  it("shows 'Select variable' when data source type is 'Variables'", async () => {
    const updatedProps = {
      ...commonProps,
      data: {
        ...commonProps.data,
        dataSourceType: plugDataSourceTypes.VARIABLES,
      },
    };
    renderDataActivitiesModuleComponent(updatedProps);
    await waitFor(() => {
      expect(screen.getByText(/Select variable\(s\)/i)).toBeVisible();
    });
  });

  it("shows 'Select datasheet' when data source type is 'Datasheet'", async () => {
    const updatedProps = {
      ...commonProps,
      data: {
        ...commonProps.data,
        dataSourceType: plugDataSourceTypes.DATASHEET,
      },
    };
    workflowHelpers.getAllWorkflowDatasheets.mockResolvedValue([
      { _id: "ds1", name: "Datasheet 1" },
    ]);
    renderDataActivitiesModuleComponent(updatedProps);
    await waitFor(() => {
      expect(screen.getByText(/Select datasheet/i)).toBeVisible();
    });
  });

  it("shows 'Select integration' when data source type is 'External database'", async () => {
    const updatedProps = {
      ...commonProps,
      data: {
        ...commonProps.data,
        dataSourceType: plugDataSourceTypes.EXTERNALDATABASE,
        externalDB: "MySQL",
      },
    };
    workflowHelpers.getAllWorkflowIntegrations.mockResolvedValue({
      data: [{ id: "int1", type: "MySQL" }],
    });
    renderDataActivitiesModuleComponent(updatedProps);
    await waitFor(() => {
      expect(screen.getByText(/Select integration/i)).toBeVisible();
    });
  });
});
