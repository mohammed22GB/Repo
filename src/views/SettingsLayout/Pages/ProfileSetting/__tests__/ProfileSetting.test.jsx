import { MemoryRouter } from "react-router-dom";
import ProfileSetting from "../ProfileSetting";
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";
import { updateUserAccount } from "../../../../common/components/Mutation/ProfileSetting/userMutations";
import { updateUserFields } from "../../../../common/components/Mutation/ProfileSetting/userMutations";
import {
  mockThemeAndRouter,
  waitFor,
  cleanup,
  fireEvent,
  queryWrapper,
  screen,
} from "../../../../../test-utilities/testMocks/themeRouter";
import useCustomMutation from "../../../../common/utils/CustomMutation";

//

describe("<AccountProfile />", () => {
  afterEach(() => {
    cleanup();
  });

  const query = {
    queryKey: [
      {
        appSortParams: { updatedAt: "desc" },
        selectedCategory: "HR & Admin",
        page: 1,
        perPage: 10,
      },
    ],
  };

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/settings/profile"]}>
        <ProfileSetting />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("Static elements are present", async () => {
    component();

    const {
      getByText,
      getByTestId,
      getAllByText,
      getByTitle,
      getByPlaceholderText,
    } = screen;
    //screen.debug(undefined, Infinity);
    //console.log(AppsInterfaceTitle.length);

    const userInfoHeader = await waitFor(() => getByText("User Information"));
    expect(userInfoHeader).toBeInTheDocument();
    const orgInfoHeader = await waitFor(() =>
      getByText("Organisation Information")
    );
    expect(orgInfoHeader).toBeInTheDocument();
    //console.log(document.title);
    expect(document.title).toBe("Settings | Profile");
  });

  test("Profile form fields values exist", async () => {
    component();

    const {
      getByText,
      getByTestId,
      getAllByText,
      getByTitle,
      getByPlaceholderText,
      getAllByPlaceholderText,
      getByRole,
    } = screen;
    //screen.debug(undefined, Infinity);
    //console.log(AppsInterfaceTitle.length);

    const firstNameField = await waitFor(() =>
      getByPlaceholderText("Enter your first name")
    );
    expect(firstNameField).toBeInTheDocument();
    const countrySelectors = await waitFor(() =>
      getAllByPlaceholderText("Enter name here")
    );
    const phoneNumField = await waitFor(() =>
      getByPlaceholderText("1 (702) 123-4567")
    );
    expect(phoneNumField).toBeDisabled();
    const editIcon = await waitFor(() => getByTitle("edit"));
    expect(editIcon).toBeInTheDocument();
    fireEvent.click(editIcon);
    expect(phoneNumField).not.toBeDisabled();

    expect(countrySelectors).toHaveLength(4);
    expect(countrySelectors[3]).toBeInTheDocument();
  });

  test("Change and save form fields values", async () => {
    component();

    const {
      getByText,
      getByTestId,
      getAllByText,
      getByTitle,
      getByPlaceholderText,
      getAllByPlaceholderText,
    } = screen;
    //screen.debug(undefined, Infinity);
    //console.log(AppsInterfaceTitle.length);

    const countrySelectors = await waitFor(() =>
      getAllByPlaceholderText("Enter name here")
    );
    // const firstNameField = await waitFor(() =>
    //   getByPlaceholderText("Enter your first name")
    // );

    fireEvent.change(countrySelectors[3], { target: { value: "Nigeria" } });
    fireEvent.change(getByPlaceholderText("Enter your first name"), {
      target: { value: "New Name" },
    });
    const submitBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitBtn);

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateUserFields,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        id: "6408bd847efbca662474ac02",
        data: {
          name: "Jenscable",
          country: "Nigeria",
          noOfEmployee: "101 - 500",
          industry: "Information Technology",
          id: "6408bd847efbca662474ac02",
          twoFactorAuthEnabled: false,
        },
      }));
    });

    // await waitFor(() => {
    //   expect(result.current.data).toBeDefined();
    //   expect(result.current.isError).toBe(false);
    // });
  });
  test("Change and save form fields values - Account", async () => {
    component();

    const {
      getByText,
      getByTestId,
      getAllByText,
      getByTitle,
      getByPlaceholderText,
      getAllByPlaceholderText,
    } = screen;
    //screen.debug(undefined, Infinity);
    //console.log(AppsInterfaceTitle.length);

    const countrySelectors = await waitFor(() =>
      getAllByPlaceholderText("Enter name here")
    );
    // const firstNameField = await waitFor(() =>
    //   getByPlaceholderText("Enter your first name")
    // );

    //expect(phoneNumField).toBeDisabled();
    fireEvent.change(countrySelectors[3], { target: { value: "Nigeria" } });
    fireEvent.change(getByPlaceholderText("Enter company's name"), {
      target: { value: "New Company Name" },
    });
    const submitBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitBtn);

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateUserAccount,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        id: "6408bd847efbca662474ac02",
        data: {
          name: "Jenscable",
          country: "Nigeria",
          noOfEmployee: "101 - 500",
          industry: "Information Technology",
          id: "6408bd847efbca662474ac02",
          twoFactorAuthEnabled: false,
        },
      }));
    });

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  });

  test.only("Change and verify phone Number", async () => {
    component();

    const {
      getByText,
      getByTestId,
      getAllByText,
      getByTitle,
      getByPlaceholderText,
      getAllByPlaceholderText,
    } = screen;

    const phoneNumField = await waitFor(() =>
      getByPlaceholderText("234 080 161 483 18")
    );

    fireEvent.click(phoneNumField);

    fireEvent.change(phoneNumField, {
      target: { value: "234 812 314-1298" },
    });
    setTimeout(() => {
      expect(phoneNumField.value).toBe("234 812 314-1298");
    }, 300);

    fireEvent.click(getByTestId("verifyLink"));
  });
});
