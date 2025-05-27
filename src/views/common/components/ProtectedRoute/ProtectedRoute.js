import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";

import ErrorBoundary from "./ErrorBoundary";
import { portalNavigationUrls, unprotectedUrls } from "../../utils/lists";
import IdleTimer from "../IdleTimer/IdleTimer";
import { handleRolePageAccess } from "../../utils/userRoleEvaluation";
import PortalDashBoard from "../../../Portal";

const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
  isVerifying,
  ...rest
}) => {
  const { user } = useSelector(({ auth }) => auth);
  const history = useHistory();
  const isUserPortalEnabled = user?.account?.enableCustomPortal;

  const isAuthorized = () => {
    const result = handleRolePageAccess(
      rest.path,
      rest.exact,
      user.roles,
      isUserPortalEnabled
    );
    return result;
  };

  const EvaluatePageAccess = (props) => {
    if (isVerifying) {
      return <div />;
    } else if (isAuthenticated) {
      if (isAuthorized()) {
        return (
          <ErrorBoundary>
            <IdleTimer>
              <Component {...props} />
            </IdleTimer>
          </ErrorBoundary>
        );
      } else {
        return (
          <div className="not-authourized">
            <div>NOT AUTHORIZED</div>
            <div className="go-back" onClick={() => history.goBack()}>
              {"<"} Go back
            </div>
          </div>
        );
      }
    } else {
      return (
        <Redirect
          to={{
            pathname: unprotectedUrls.LOGIN,
            search: `?redirect=${window.location.pathname}${
              window.location.search || ""
            }`,
            state: { from: props.location },
          }}
        />
      );
    }
  };

  return (
    <Route
      {...rest}
      render={(props) => EvaluatePageAccess(props)}
      /*  isVerifying ? (
          <div />
        ) : isAuthenticated ? (
          <ErrorBoundary>
            <Component {...props} />
          </ErrorBoundary>
        ) : isAuthenticated ? (
          <Redirect to="/apps" />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              search: `?redirect=${window.location.pathname}${
                window.location.search || ""
              }`,
              state: { from: props.location },
            }}
          />
        )
      } */
    />
  );
};

export default ProtectedRoute;
