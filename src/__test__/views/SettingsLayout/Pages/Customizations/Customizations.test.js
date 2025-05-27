import {
  mockThemeAndRouter,
  cleanup,
  screen,
} from "../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import Customizations from "../../../../../views/SettingsLayout/Pages/Customizations/Customizations";
import CustomAppearance from "../../../../../views/SettingsLayout/Pages/Customizations/components/CustomAppearance";
import CustomOrganisationEmail from "../../../../../views/SettingsLayout/Pages/Customizations/components/CustomOrganisationEmail";
import CustomInternalUserPortal from "../../../../../views/SettingsLayout/Pages/Customizations/components/CustomInternalUserPortal";
import CustomizationModal from "../../../../../views/SettingsLayout/Pages/Customizations/components/CustomizationModal";

describe("<Customizations />", () => {
  afterEach(() => {
    cleanup();
  });

  const Customizationcomponent = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/settings/customizations"]}>
        <Customizations />
      </MemoryRouter>,
      { ...option }
    );
  };

  const CustomAppearanceComponent = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter>
        <CustomAppearance />
      </MemoryRouter>,
      { ...option }
    );
  };

  const CustomOrganisationEmailComponent = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter>
        <CustomOrganisationEmail />
      </MemoryRouter>,
      { ...option }
    );
  };

  const CustomInternalUserPortalComponent = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter>
        <CustomInternalUserPortal />
      </MemoryRouter>,
      { ...option }
    );
  };

  const CustomizationModalComponent = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter>
        <CustomizationModal open={true} />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("Customization components rendered and is present on psge", async () => {
    Customizationcomponent();

    expect(document.title).toBe("Settings | Customizations");
  });

  test("After Customization components renders the CustomAppearance component renders", async () => {
    CustomAppearanceComponent();

    expect(screen.getByTestId("customise-appearance")).toBeInTheDocument();
  });

  test("CustomOrganisationEmail  is rendered", async () => {
    CustomOrganisationEmailComponent();

    expect(
      screen.getByTestId("customise-organization-email-appearance")
    ).toBeInTheDocument();
  });

  test("CustomInternalUserPortal is rendered", async () => {
    CustomInternalUserPortalComponent();

    expect(
      screen.getByTestId("customise-internal-userportal-appearance")
    ).toBeInTheDocument();
  });

  test("CustomizationModalComponent is rendered", async () => {
    CustomizationModalComponent();

    expect(
      screen.getByRole("presentation", { name: "customisation-modal" })
    ).toBeInTheDocument();
  });
});
