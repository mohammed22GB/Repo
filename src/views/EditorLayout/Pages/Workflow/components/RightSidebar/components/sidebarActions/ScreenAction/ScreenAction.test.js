import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { mockThemeAndRouter } from "../../../../../../../../../test-utilities/testMocks/themeRouter";
import ScreenTaskActions from ".";

describe("ScreenAction", () => {
  let props;

  beforeEach(() => {
    props = {};
  });
  afterEach(() => {
    cleanup();
  });

  const ScreenActionComponent = (props, options) =>
    mockThemeAndRouter(
      <MemoryRouter>
        <ScreenTaskActions {...props} />
      </MemoryRouter>,
      { ...options }
    );

  describe("Reuseable Field Attributes", () => {
    it("does not render reuseable field attributes section (rfas) if not isReusableScreen and not isReusingScreen", () => {
      props.isReusableScreen = false;
      props.isReusingScreen = false;

      ScreenActionComponent(props);

      const reusablefieldattribSection = screen.queryByTestId(
        "config-reusablefieldattrib-section"
      );

      expect(reusablefieldattribSection).toBeNull();
    });

    it("renders rfas if isReusableScreen or isReusingScreen, but if not fields, displays 'No...fields'", () => {
      props.isReusableScreen = true;
      props.isReusingScreen = false;
      props.fieldsAttributes = {};

      ScreenActionComponent(props);

      const reusablefieldattribSection = screen.getByTestId(
        "config-reusablefieldattrib-section"
      );
      const reusablefieldattribSectionHeading = screen.queryByText(
        "Reusable screen fields"
      );
      const noReusablefieldattribSectionHeading = screen.getByText(
        "No reusable screen fields"
      );

      expect(reusablefieldattribSection).toBeInTheDocument();
      expect(reusablefieldattribSectionHeading).toBeNull();
      expect(noReusablefieldattribSectionHeading).toBeInTheDocument();
    });

    it("renders rfas if isReusableScreen or isReusingScreen, but if fields, displays fields heading", () => {
      props.isReusableScreen = true;
      props.isReusingScreen = false;
      props.fieldsAttributes = { "field-1": {} };

      ScreenActionComponent(props);

      const reusablefieldattribSection = screen.getByTestId(
        "config-reusablefieldattrib-section"
      );
      const reusablefieldattribSectionHeading = screen.getByText(
        "Reusable screen fields"
      );
      const noReusablefieldattribSectionHeading = screen.queryByText(
        "No reusable screen fields"
      );

      expect(reusablefieldattribSection).toBeInTheDocument();
      expect(reusablefieldattribSectionHeading).toBeInTheDocument();
      expect(noReusablefieldattribSectionHeading).toBeNull();
    });

    it("renders rfas if isReusableScreen or isReusingScreen, if dynamic field, make 'Editable' menuitem disabled", async () => {
      props.isReusableScreen = true;
      props.isReusingScreen = false;
      props.fieldsAttributes = { "field-1": { name: "@my-field-name" } };

      ScreenActionComponent(props);

      /* 'Readonly' becomes default selection */
      const fieldAtributeDropdown = screen.getByText(/Readonly/i);
      expect(fieldAtributeDropdown).toBeInTheDocument();
      await userEvent.click(fieldAtributeDropdown);

      await waitFor(() => {
        const attributeEditableFromDropdownOptions = screen.getByRole(
          "option",
          {
            name: /Editable/i,
          }
        );

        expect(attributeEditableFromDropdownOptions).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
    });
  });

  describe("Lookup Contents", () => {
    it("renders lookup contents (lcs) section, but if no contents, displays 'No...fields'", () => {
      props.lookupContents = [];

      ScreenActionComponent(props);

      const lookupContentsSectionHeading = screen.queryByText("Lookup fields");
      const noLookupContentsSectionHeading =
        screen.getByText("No lookup fields");

      expect(lookupContentsSectionHeading).toBeNull();
      expect(noLookupContentsSectionHeading).toBeInTheDocument();
    });

    it("renders lookup contents (lcs) section, and if with contents, displays 'Lookupfields'", () => {
      props.lookupContents = [{}];

      ScreenActionComponent(props);

      const lookupContentsSectionHeading = screen.getByText("Lookup fields");
      const noLookupContentsSectionHeading =
        screen.queryByText("No lookup fields");

      expect(lookupContentsSectionHeading).toBeInTheDocument();
      expect(noLookupContentsSectionHeading).toBeNull();
    });
  });
});
