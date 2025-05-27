import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { mockThemeAndRouter } from "../../../../../../test-utilities/testMocks/themeRouter";
import DashboardDataConfiguration from ".";

describe("DashboardDataConfiguration", () => {
  let props;

  beforeEach(() => {
    props = {};
  });
  afterEach(() => {
    cleanup();
  });

  const DashboardDataConfigurationComponent = (props, options) =>
    mockThemeAndRouter(
      <MemoryRouter initialEntries={["/login"]}>
        <DashboardDataConfiguration {...props} />
      </MemoryRouter>,
      { ...options }
    );

  describe("DashboardDataConfiguration", () => {
    it("should not display transpose data option if dataSourceType is not datasheet", async () => {
      props = {
        data: {
          dataSourceType: "googleSheet",
        },
        updateData: {},
        resetDataConfig: {},
        sectionType: "",
        chartType: "",
      };

      DashboardDataConfigurationComponent(props);

      const transposeDataSection = await screen.findByText("Transpose data?");
      const excludeFieldsSection = await screen.findByText("Exclude fields");

      expect(transposeDataSection).not.toBeVisible();
      expect(excludeFieldsSection).not.toBeVisible();
    });

    it("should display transpose data option (and Exclude fields) if dataSourceType is datasheet", async () => {
      props = {
        data: {
          dataSourceType: "datasheet",
          transposeData: true,
        },
        updateData: jest.fn(() => {}),
        resetDataConfig: {},
        sectionType: "",
        chartType: "",
      };

      window.confirm = jest.fn(() => true);

      DashboardDataConfigurationComponent(props);

      const transposeDataSection = await screen.findByText("Transpose data?");
      const transposeSwitch = await screen.findByRole("checkbox");
      const excludeFieldsSection = await screen.findByText("Exclude fields");

      expect(transposeDataSection).toBeVisible();
      expect(excludeFieldsSection).toBeVisible();

      await userEvent.click(transposeSwitch);
      expect(window.confirm).toHaveBeenCalled();
      expect(props.updateData).toHaveBeenCalled();
    });
  });
});
