import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import PhoneInput from "react-phone-input-2";
import { startsWith } from "lodash";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import {
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Grid,
  Select,
  MenuItem,
} from "@material-ui/core";
import { successToastify } from "../../../common/utils/Toastify";
import useCustomQuery from "../../../common/utils/CustomQuery";
import { getUserById } from "../../../common/components/Query/profileSettings/profileSetting";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  updateUserAccount,
  updateUserFields,
} from "../../../common/components/Mutation/ProfileSetting/userMutations";
import { sendVerifyPhoneOTP } from "../../../../store/actions";
import { unprotectedUrls } from "../../../common/utils/lists";
import { hasEmptyField } from "../../../common/helpers/helperFunctions";
import { validateEmail } from "../../../common/helpers/validation";
import {
  countryDropDown,
  employeeDropDown,
  industryDropDown,
  roleDropDown,
} from "../../../common/components/DropDown/util/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    maxWidth: 500,
  },

  title: {
    // fontFamily: "Inter",
    // fontStyle: "normal",
    // fontWeight: 500,
    fontSize: 12,
    // lineHeight: "132.24%",
    color: "#091540",
    fontWeight: 600,
    // margin: "40px 0 0",
    // display: "flex", */
    backgroundColor: "#fafafa",
    padding: "5px 8px",
    border: "solid 0.5px #ccc",
    borderRadius: 5,
  },
  phonenumber: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 12,
    lineHeight: "132.24%",
    color: "#091540",
    top: 366,
    left: 707,
    position: "absolute",
    width: 79,
    height: 16,
    display: "flex",
    alignItems: "center",
  },
  phonenumberTextField: {
    position: "absolute",
    width: 410,
    height: 62,
    top: 394,
    left: 707,

    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,

    display: "flex",
    alignItems: "center",
    color: "#ABB3BF",
  },
  customButton: {
    // backgroundColor: "#dd4400",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  customButtonLabel: {
    textTransform: "capitalize",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 300,
    // lineHeight: 1,
  },

  formLabels: {
    paddingTop: theme?.spacing(3),
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 12,
    lineHeight: "132.24%",
    display: "flex",
    color: "#091540",
  },

  formTextField: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,
    display: "flex",
    color: "#091540",
    backgroundColor: "#FFFFFF",
  },

  nameGrid: {
    [theme?.breakpoints?.down("sm")]: {
      margin: 0,
      "& > .MuiGrid-item": {
        padding: 0,
      },
    },
  },

  next: {
    fontFamily: "Inter",
    fontStyle: "normal",
    margin: theme?.spacing(4, 0),
    backgroundColor: "#062044",
    color: "#fff",
    textTransform: "none",
    borderRadius: 3,
    justifyContent: "right",
    padding: theme?.spacing(1, 5),

    "&$disabled": {
      background: "#E7E9EE",
      color: "#fff",
    },
  },
  selectPadding: {
    padding: "10.5px 14px",
    backgroundColor: "#ffffff",
  },
  disabled: {},
}));

const ProfileSetting = () => {
  const {
    auth: { user: currentUser },
  } = useSelector((state) => state);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme?.breakpoints?.down("sm"));
  const classes = useStyles();
  const history = useHistory();

  const [verifying, setVerifying] = useState(false);
  const [updatedPhoneField, setUpdatedPhoneField] = useState("");
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [userFormData, setUserFormData] = useState({});
  const [accountFormData, setAccountFormData] = useState({});
  const [queryKey, setQueryKey] = useState(null);
  const [fullUserInfo, setFullUserInfo] = useState({});
  const [appLoading, setAppLoading] = useState(false);

  useEffect(() => {
    document.title = "Settings | Profile";
  }, []);

  useEffect(() => {
    getIsFormValid();
  }, [userFormData, accountFormData]);

  useEffect(() => {
    const queryKey_ = [
      "getSingleUserProfile",
      { id: currentUser?.id, population: '["account"]' },
    ];

    setQueryKey(queryKey_);
  }, []);

  // define dispatch;
  const dispatch = useDispatch();

  // fetch single user data success checkout
  const onSuccess = ({ data }) => {
    // set data to global state

    setFullUserInfo(data?.data?.data);
    setUserRoles(data?.data?.data?.roles);
    setUpdatedPhoneField(data?.data?.data?.mobile);

    storeUserData(data?.data?.data);
  };

  // update user account
  const onUserOrAccountUpdateSuccess = async ({ data }) => {
    storeUserData(data?.data);

    successToastify("Updated Successfully");
    setUserFormData({});
    setAccountFormData({});
    setAppLoading(false);
  };

  //  fetch user details
  const { isLoading, isFetching } = useCustomQuery({
    apiFunc: getUserById,
    queryKey,
    onSuccess,
  });

  // update user details
  const { mutate: updateUser } = useCustomMutation({
    apiFunc: updateUserFields,
    onSuccess: onUserOrAccountUpdateSuccess,
    retries: 0,
  });

  // update user account
  const { mutate: updateAccount } = useCustomMutation({
    apiFunc: updateUserAccount,
    onSuccess: onUserOrAccountUpdateSuccess,
    retries: 0,
  });

  // user props change
  const onUserInfoChange = (event) => {
    setUserFormData({
      ...userFormData,
      [event.target.name]: event.target.value,
    });
    setFullUserInfo({
      ...fullUserInfo,
      [event.target.name]: event.target.value,
    });
  };

  // user account props change
  const onUserAccountChange = (event) => {
    setAccountFormData({
      ...accountFormData,
      [event.target.name]: event.target.value,
    });
    setFullUserInfo({
      ...fullUserInfo,
      account: {
        ...fullUserInfo.account,
        [event.target.name]: event.target.value,
      },
    });
  };

  // submit data to the server
  const saveFormUpdates = async (e) => {
    e.preventDefault();
    setAppLoading(true);

    if (Object.keys(userFormData).length) {
      updateUser({ data: userFormData, id: currentUser?.id });
    }
    if (Object.keys(accountFormData).length) {
      updateAccount({
        data: accountFormData,
        id: fullUserInfo?.account?.id,
      });
    }
  };

  const storeUserData = (data) => {
    const retrieved_ = localStorage.getItem("userInfo");
    const retrieved = JSON.parse(retrieved_);

    if (data.account) {
      //  if user data (returned with id of account)
      const account_ = retrieved.account;
      data.account = account_;
    } else {
      //  if account data
      retrieved.account = data;
      data = retrieved;
    }

    localStorage.setItem("userInfo", JSON.stringify(data));
    // dispatch(receiveLogin(data));
  };

  const doVerifyPhone = async (newPhone) => {
    setVerifying(true);
    const resp = await sendVerifyPhoneOTP(newPhone || fullUserInfo?.mobile);

    if (resp?.data?._meta?.success) {
      localStorage.setItem(
        "verify_preotp_phone",
        newPhone || fullUserInfo?.mobile
      );
      // window.location.href = unprotectedUrls.VERIFY;
      history.push(unprotectedUrls.VERIFY);
    } else {
      setVerifying(false);
    }
  };

  const changePhoneNumber = () => {
    const newPhone_ = prompt(
      "Enter new phone number for verification (without the country code)"
    );
    if (!newPhone_) {
      return;
    }
    const newPhone = newPhone_.replace("+", "");
    doVerifyPhone(newPhone);
  };

  // disable fields when a field is empty;
  const getIsFormValid = () => {
    const isInvalid =
      hasEmptyField(userFormData) || hasEmptyField(accountFormData);

    setIsFormValid(
      (Object.keys(userFormData).length ||
        Object.keys(accountFormData).length) &&
        !isInvalid
    );
  };

  const validateEmail_ = (email) => {
    if (typeof email?.length === "undefined") {
      return false;
    }
    return email?.length === 0 || validateEmail(email);
  };

  // load git while waitin for the data

  const handlePhoneField = (value) => {
    setUserFormData({
      ...userFormData,
      mobile: value,
    });

    if (value === updatedPhoneField) {
      setPhoneChanged(false);
    } else {
      setPhoneChanged(true);
    }
  };

  return isLoading || isFetching ? (
    <div className={classes.loading}>
      Loading... please wait...
      <img src="../../../images/loading-anim.svg" alt="Clone" width={20} />
    </div>
  ) : (
    <div className={classes.root}>
      <div className={classes.title}>User information</div>

      <form onSubmit={(e) => saveFormUpdates(e)}>
        <Typography className={classes.formLabels} gutterBottom>
          First name
        </Typography>
        <div>
          <TextField
            id={"profile-settings-user-firstname"}
            className={classes.formTextField}
            name="firstName"
            required
            error={userFormData?.firstName?.length === 0}
            size="small"
            fullWidth
            placeholder="Enter your first name"
            onChange={onUserInfoChange}
            type="text"
            inputMode="text"
            value={fullUserInfo?.firstName || ""}
            variant="outlined"
          />
        </div>

        <Typography className={classes.formLabels} gutterBottom>
          Last name
        </Typography>
        <div>
          <TextField
            id={"profile-settings-user-lastname"}
            className={classes.formTextField}
            name="lastName"
            required
            error={userFormData?.lastName?.length === 0}
            fullWidth
            size="small"
            placeholder="Enter your last name"
            onChange={onUserInfoChange}
            type="text"
            inputMode="text"
            value={fullUserInfo?.lastName || ""}
            variant="outlined"
          />
        </div>
        <Typography className={classes.formLabels} gutterBottom>
          Email
        </Typography>
        <div>
          <TextField
            id={"profile-settings-user-email"}
            //disabled={!userRoles.includes("Admin")}
            className={classes.formTextField}
            name="email"
            required
            inputMode="email"
            error={validateEmail_(userFormData?.email)}
            fullWidth
            disabled
            size="small"
            placeholder="Enter your email"
            onChange={onUserInfoChange}
            type="text"
            value={fullUserInfo?.email || ""}
            variant="outlined"
          />
        </div>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Typography className={classes.formLabels} gutterBottom>
            Phone number
          </Typography>
        </Grid>

        <div>
          <PhoneInput
            id={"profile-settings-user-phone"}
            country={"ng"}
            error={userFormData?.mobile?.length === 0}
            name="mobile"
            required
            placeholder={"234 080 161 483 18"}
            //disabled={updatedPhoneField}
            inputStyle={{ width: "100%" }}
            value={fullUserInfo?.mobile}
            onChange={(value) => handlePhoneField(value)}
            fullWidth
            isValid={(inputNumber, country, countries) => {
              return countries.some((country) => {
                return (
                  startsWith(inputNumber, country?.dialCode) ||
                  startsWith(country?.dialCode, inputNumber)
                );
              });
            }}
          />
          {!!fullUserInfo?.mobileVerified && !phoneChanged ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "4px",
              }}
            >
              <CheckCircleOutlineIcon
                style={{ fontSize: 16, marginRight: 5, color: "green" }}
              />
              <span style={{ marginRight: 10, color: "green" }}>Verified</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "red",
                fontWeight: 200,
                fontSize: 12,
                marginTop: "4px",
              }}
            >
              <ErrorOutlineIcon style={{ fontSize: 14, marginRight: 5 }} />
              {verifying ? (
                <span id={"profile-settings-user-phone-verify-wait"}>
                  Please wait...
                </span>
              ) : (
                <span
                  data-testid="verifyLink"
                  style={{
                    textDecoration: "underline",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onClick={() => doVerifyPhone()}
                  id={"profile-settings-user-phone-verify"}
                >
                  Click here to verify
                </span>
              )}
              {/* <Button
              variant="text"
              size="small"
              title="verifyBtn"
              style={{
                textTransform: "capitalize",
                textDecoration: "underline",
                fontWeight: 200,
                fontSize: 12,
              }}
              onClick={() => doVerifyPhone()}
            >
              Verify
              {verifying ? (
                <HourglassEmptyIcon style={{ fontSize: 16, marginLeft: 5 }} />
              ) : (
                <OpenInBrowserIcon style={{ fontSize: 16, marginLeft: 5 }} />
              )}
            </Button> */}
            </div>
          )}
        </div>

        {userFormData?.twoFactorAuthEnabled && (
          <>
            <Typography className={classes.formLabels} gutterBottom>
              Receive login OTP (Two-Factor Authentication)
            </Typography>
            <Select
              id={"profile-settings-user-otp-login"}
              // className={classes.FormTextField}
              size="small"
              name="hasNull"
              required
              onChange={onUserInfoChange}
              fullWidth
              value={fullUserInfo?.twoFactorAuthType || ""}
              placeholder={`Enter name here`}
              type="text"
              variant="outlined"
              classes={{
                root: classes.selectPadding,
              }}
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="mobile" disabled={!fullUserInfo?.mobileVerified}>
                Phone{" "}
                <em>
                  {fullUserInfo?.mobileVerified ? "" : " (phone not verified)"}
                </em>
              </MenuItem>
              <MenuItem value="both" disabled={!fullUserInfo?.mobileVerified}>
                Both{" "}
                <em>
                  {fullUserInfo?.mobileVerified ? "" : " (phone not verified)"}
                </em>
              </MenuItem>
            </Select>
          </>
        )}
        <Typography className={classes.formLabels} gutterBottom>
          Your role
        </Typography>
        <Select
          id={"profile-settings-user-role"}
          disabled={!userRoles?.includes("Admin")}
          size="small"
          name="roles"
          required
          onChange={onUserInfoChange}
          fullWidth
          multiple
          value={fullUserInfo?.roles || []}
          placeholder={`Enter name here`}
          error={userFormData?.roles?.length === 0}
          type="text"
          variant="outlined"
          classes={{
            root: classes.selectPadding,
          }}
        >
          {roleDropDown.map((r, i) => (
            <MenuItem value={r[0]} key={i} disabled={!r[0]}>
              {r[1]}
            </MenuItem>
          ))}
        </Select>

        <div className={classes.title} style={{ marginTop: 25 }}>
          Organisation information
        </div>

        <Typography className={classes.formLabels} gutterBottom>
          Organisation name
        </Typography>
        <TextField
          id={"profile-settings-organisation-name"}
          disabled={!userRoles?.includes("Admin")}
          className={classes.formTextField}
          // className={classes.orgnameTextField}
          size="small"
          name="name"
          required
          error={accountFormData?.name?.length === 0}
          fullWidth
          placeholder="Enter company's name"
          onChange={onUserAccountChange}
          type="text"
          inputMode="text"
          value={fullUserInfo?.account?.name || ""}
          variant="outlined"
        />
        <Typography className={classes.formLabels} gutterBottom>
          Organisation email
        </Typography>
        <TextField
          id={"profile-settings-organisation-email"}
          disabled={!userRoles?.includes("Admin")}
          className={classes.formTextField}
          // className={classes.orgnameTextField}
          size="small"
          name="email"
          required
          error={validateEmail_(accountFormData?.email)}
          fullWidth
          placeholder="Enter company's email"
          onChange={onUserAccountChange}
          type="email"
          inputMode="email"
          value={fullUserInfo?.account?.email || ""}
          variant="outlined"
        />
        <Grid container direction="row" spacing={isSmall ? 0 : 4}>
          <Grid item xs={12} md={6}>
            <Typography className={classes.formLabels} gutterBottom>
              Number of employees
            </Typography>
            <Select
              id={"profile-settings-organisation-noe"}
              disabled={!userRoles?.includes("Admin")}
              size="small"
              name="noOfEmployee"
              required
              onChange={onUserAccountChange}
              fullWidth
              value={fullUserInfo?.account?.noOfEmployee || ""}
              placeholder={`Enter name here`}
              error={accountFormData?.noOfEmployee?.length === 0}
              type="text"
              variant="outlined"
              classes={{
                root: classes.selectPadding,
              }}
            >
              {employeeDropDown.map((r, i) => (
                <MenuItem value={r[0]} key={i} disabled={!r[0]}>
                  {r[1]}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className={classes.formLabels} gutterBottom>
              Country
            </Typography>
            <Select
              id={"profile-settings-organisation-country"}
              disabled={!userRoles?.includes("Admin")}
              size="small"
              name="country"
              required
              onChange={onUserAccountChange}
              fullWidth
              value={fullUserInfo?.account?.country || ""}
              placeholder={`Enter name here`}
              error={accountFormData?.country?.length === 0}
              type="text"
              variant="outlined"
              classes={{
                root: classes.selectPadding,
              }}
            >
              {countryDropDown.map((r, i) => (
                <MenuItem value={r[0]} key={i} disabled={!r[0]}>
                  {r[1]}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <Typography className={classes.formLabels} gutterBottom>
          Industry
        </Typography>
        <Select
          id={"profile-settings-organisation-industry"}
          disabled={!userRoles?.includes("Admin")}
          size="small"
          name="industry"
          required
          onChange={onUserAccountChange}
          fullWidth
          value={fullUserInfo?.account?.industry || ""}
          placeholder={`Enter name here`}
          error={accountFormData?.industry?.length === 0}
          type="text"
          variant="outlined"
          classes={{
            root: classes.selectPadding,
          }}
        >
          {industryDropDown.map((r, i) => (
            <MenuItem value={r[0]} key={i} disabled={!r[0]}>
              {r[1]}
            </MenuItem>
          ))}
        </Select>
        <br />
        <Grid
          container
          alignItems="flex-start"
          justifyContent="space-between"
          direction="row"
        >
          <Button
            id={"profile-settings-save-btn"}
            color="primary"
            style={{ marginTop: 15 }}
            classes={{
              root: classes.customButton,
              label: classes.customButtonLabel,
              disabled: classes.disabled,
            }}
            /* classes={{
            root: classes.next,
          }} */
            disabled={!isFormValid || appLoading}
            size="large"
            title="submitBtn"
            type="submit"
            variant="contained"
          >
            Save
            {appLoading && <div className="activity-loader"></div>}
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default ProfileSetting;
