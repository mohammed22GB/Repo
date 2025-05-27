import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import {
  Signup as SignupView,
  SignupDetail as SignupDetailView,
  Welcome as WelcomeView,
  ForgotPassword as ForgotPasswordView,
  Login as LoginView,
  VerifyOTP as VerifyOTPView,
  Administration as AdministrationView,
  Apps as AppsView,
  AppTemplates as AppTemplatesView,
  ResetPassword as ResetPasswordView,
  Download as DownloadView,
  DashboardEditor as DashboardEditorView,
  DashboardsList as DashboardsListView,
} from "./views";
import AccountDetails from "./views/Administration/AccountDetails";
import UIEditorPublish from "./views/EditorLayout/Pages/Publish";
import EditorLayout from "./views/EditorLayout/EditorLayout";
import SettingsLayout from "./views/SettingsLayout/SettingsLayout";
import Datasheets from "./views/Datasheets";
import Datasheet from "./views/Datasheets/Pages/Datasheet";
import RunAppView, { RunScreen } from "./views/Run";
import ApprovalScreen from "./views/Run/ApprovalScreen";
import RunAppCompleted from "./views/Run/Completed";
import Analytics from "./views/Analytics";
import Integrations from "./views/Integrations";
import SingleWorkAnalytics from "./views/Analytics/SingleWorkflowAnalytics";
import InAppNotification from "./views/InAppNotification/index";
import SignatureModal from "./views/Run/SignatureModal";
import LoginWithSSO from "./views/LoginWithSSO/index";
import ProtectedRoute from "./views/common/components/ProtectedRoute/ProtectedRoute";
import {
  mainNavigationUrls,
  otherProtectedUrls,
  unprotectedUrls,
  portalNavigationUrls,
} from "./views/common/utils/lists";
import Appendage from "./views/common/components/AppendageForm/Appendage";
import VerifySSO from "./views/Login/components/SSOLogin/VerifySSO";
import ErrorPage from "./views/common/components/Errorpage/Error";
import CreatePasswordHome from "./views/CreatePassword/CreatePassword";
import DashboardPortal from "./views/Portal/DashboardPortal";
import AppsPortal from "./views/Portal/AppsPortal/AppsPortal";
import RecordsPortal from "./views/Portal/ViewRecords/ViewRecords";
import NewPlugEditorLayout from "./views/Plug_2.0/components/UIEditorLayout";

const Routes = (props) => {
  const { isAuthenticated, isVerifying } = props;

  return (
    <>
      <Switch>
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.ADMINISTRATION}/:slug`}
          component={AccountDetails}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.ADMINISTRATION}`}
          component={AdministrationView}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        {/* )} */}
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.APPS}`}
          component={AppsView}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.TEMPLATES}`}
          component={AppTemplatesView}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.ANALYTICS}/:id`}
          component={SingleWorkAnalytics}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />

        {/* <ProtectedRoute
          path="/custom"
          component={CustomDialogBox}
          exact
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        /> */}
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.ANALYTICS}`}
          component={Analytics}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        {/* <ProtectedRoute
          exact
          path="/apps/uploaded"
          component={DragDrop}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        /> */}

        <ProtectedRoute
          exact
          path="/appendage"
          component={Appendage}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.NOTIFICATIONS}`}
          component={InAppNotification}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.DATASHEETS}/:id`}
          component={Datasheet}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.DATASHEETS}`}
          component={Datasheets}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />

        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.INTEGRATIONS}`}
          component={Integrations}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path="/new/uieditor"
          component={NewPlugEditorLayout}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />

        <ProtectedRoute
          exact
          path={`${otherProtectedUrls.DASHBOARDS_EDITOR}/:slug`}
          component={DashboardEditorView}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${mainNavigationUrls.DASHBOARDS}`}
          component={DashboardsListView}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${portalNavigationUrls.DASHBOARD}`}
          component={DashboardPortal}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${portalNavigationUrls.APPS}`}
          component={AppsPortal}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          exact
          path={`${portalNavigationUrls.RECORDS}`}
          component={RecordsPortal}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />

        <Route exact path={`${unprotectedUrls.ROOT}`} component={LoginView} />
        <Route exact path={`${unprotectedUrls.LOGIN}`} component={LoginView} />
        <Route
          exact
          path={`${unprotectedUrls.LOGIN_WITH_SSO}`}
          component={LoginWithSSO}
        />
        <Route
          exact
          path={`${unprotectedUrls.VERIFY_SSO}`}
          component={VerifySSO}
        />
        <Route
          exact
          path={`${unprotectedUrls.SIGN}`}
          component={SignatureModal}
        />
        <Route
          exact
          path={`${unprotectedUrls.SIGNUP_DETAIL}`}
          component={SignupDetailView}
        />
        <Route
          exact
          path={`${unprotectedUrls.WELCOME}`}
          component={WelcomeView}
        />
        <Route
          exact
          path={`${unprotectedUrls.FORGOT_PASSWORD}`}
          component={ForgotPasswordView}
        />
        <Route
          exact
          path={`${unprotectedUrls.RESET_PASSWORD}`}
          component={ResetPasswordView}
        />
        <Route
          exact
          path={`${unprotectedUrls.CREATE_PASSWORD}`}
          component={CreatePasswordHome}
        />
        <Route
          exact
          path={`${unprotectedUrls.VERIFY}`}
          component={VerifyOTPView}
        />
        <Route
          exact
          path={`${unprotectedUrls.RUN_COMPLETED}`}
          component={RunAppCompleted}
        />
        <Route
          exact
          path={`${unprotectedUrls.RUN}/:accountSlug/:appSlug`}
          component={RunAppView}
        />
        <Route
          exact
          path={`${unprotectedUrls.RUN}/:accountSlug/:appSlug/:screenSlug`}
          component={RunScreen}
        />
        <ProtectedRoute
          exact
          path={`${otherProtectedUrls.EDITOR_UIEDITOR_PUBLISH}`}
          component={UIEditorPublish}
        />
        <ProtectedRoute
          exact
          path={`${otherProtectedUrls.DOWNLOAD}/:id`}
          component={DownloadView}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <Route
          exact
          path={`${unprotectedUrls.DOWNLOAD_PUBLIC}/:id`}
          component={DownloadView}
        />
        {/* <Route exact path={`/thinktank`} component={PlaygroundView} /> */}
        <Route path={`${unprotectedUrls.ERROR}`} component={ErrorPage} />
        <ProtectedRoute
          exact
          path={`${otherProtectedUrls.APPROVAL}/:accountSlug/:appSlug`}
          component={ApprovalScreen}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          path={`${otherProtectedUrls.EDITOR}`}
          component={EditorLayout}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <ProtectedRoute
          path={`${mainNavigationUrls.SETTINGS}`}
          component={SettingsLayout}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
        >
          <Route
            exact
            path={`${unprotectedUrls.SIGNUP}`}
            component={SignupView}
          />
        </GoogleReCaptchaProvider>
      </Switch>
    </>
  );
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
}

export default withRouter(connect(mapStateToProps)(Routes));
