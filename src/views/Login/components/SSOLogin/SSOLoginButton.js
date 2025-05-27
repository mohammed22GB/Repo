import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import SSOIcon from "../../../../assets/images/ssoLink.png";

import { unprotectedUrls } from "../../../common/utils/lists";

const SSOLoginButton = ({ classes }) => {
  return (
    <>
      <Link
        className={[classes.signUpButton, classes._sso]}
        component={RouterLink}
        to={unprotectedUrls.LOGIN_WITH_SSO} // for now sso login is not redirecting to the login-sso page which is still a work in progress
        style={{
          backgroundColor: "#ffffff",
          color: "#464D72",
          textDecoration: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        <img
          alt="G"
          className={classes.microsoftIcon}
          src={SSOIcon}
          width={20}
        />
        Login with SSO
      </Link>
    </>
  );
};

export default SSOLoginButton;
