import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { mockThemeAndRouter } from "../../../../../../../../../../test-utilities/testMocks/themeRouter";
import RichTextEditor from "../../../../../../../../../../views/EditorLayout/Pages/Workflow/components/RightSidebar/components/sidebarActions/common/RichTextEditor";

describe("RichTextEditor", () => {
  let props;

  beforeEach(() => {
    props = {
      holdBody: jest.fn(),
    };
  });
  afterEach(() => {
    cleanup();
  });

  const RTEComponent = (props, options) =>
    mockThemeAndRouter(
      <MemoryRouter initialEntries={["/login"]}>
        <RichTextEditor {...props} />
      </MemoryRouter>,
      { ...options }
    );

  describe("RichTextEditor Variables List", () => {
    it("renders the RTE, shows Variables btn, and on click it displays the Search text field with 'no variables'", async () => {
      RTEComponent(props);

      /* the 'Variables' button is rendered */
      const variablesListBtn = await screen.findByRole("button", {
        name: "Variables",
      });
      expect(variablesListBtn).toBeInTheDocument();

      await userEvent.click(variablesListBtn);

      /* the 'Search variables' input is rendered */
      const searchTextField = await screen.findByPlaceholderText(
        "Search variables"
      );
      expect(searchTextField).toBeInTheDocument();

      /* the 'No variables' message is rendered */
      const noVariablesAvailableYet = await screen.findByText("No variables");
      expect(noVariablesAvailableYet).toBeInTheDocument();
    });

    it("renders list of passed in variables, and filters as user types", async () => {
      props.variables = [
        {
          id: "var-1",
          info: {
            name: "Variable 1",
            parent: "screen-1",
            matching: {
              valueSourceId: "var-1",
              valueSourceInput: "var-1",
            },
          },
        }, //  variable 1
        {
          id: "var-2",
          info: {
            name: "Variable 2",
            parent: "screen-1",
            matching: {
              valueSourceId: "var-2",
              valueSourceInput: "var-2",
            },
          },
        },
      ];

      RTEComponent(props);

      /* the 'Variables' button is rendered */
      const variablesListBtn = await screen.findByRole("button", {
        name: "Variables",
      });
      expect(variablesListBtn).toBeInTheDocument();

      await userEvent.click(variablesListBtn);

      /* the 'Search variables' input is rendered */
      const searchTextField = await screen.findByPlaceholderText(
        "Search variables"
      );
      expect(searchTextField).toBeInTheDocument();

      /* the full list of variables is rendered */
      const variablesListItems = await screen.findAllByRole("menuitem");
      expect(variablesListItems).toHaveLength(2);

      await userEvent.type(searchTextField, "2");

      /* the filtered-by-name list of variables is rendered */
      const filteredVariablesListItems = await screen.findAllByRole("menuitem");
      expect(filteredVariablesListItems).toHaveLength(1);
    });
  });
});
