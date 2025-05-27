import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
// import { errorToastify, successToastify} from "../../../../CommonCompnents/react_toastify/toastify";
// import { handleUserActions } from "../../../../utils/userServices";
import { makeStyles } from "@material-ui/core/styles";
import PassCircle from "@material-ui/icons/CheckCircleOutline";
import FailCircle from "@material-ui/icons/HighlightOff";

const SettingsPassword = ({
  formState,
  notCompleted,
  setNotCompleted,
  setFailedPasswordValidate,
}) => {
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasMinChars, sethasMinChars] = useState(false);
  const [hasSpecialChars, setHasSpecialChars] = useState(false);

  const useStyles = makeStyles((theme) => ({
    password_status_box: {
      fontSize: 10,
      display: "flex",
      flexWrap: "wrap",
      padding: "5px 10px",
      border: "solid 0.5px #eee",
      borderRadius: "0 0 5px 5px",
      marginTop: 3,
      fontWeight: 300,
      transition: "display 2s",
      "& > div": {
        display: "flex",
        marginRight: 15,
        height: 20,
        minWidth: "45%",
        alignItems: "center",
        gap: 5,
      },
    },
  }));
  const classes = useStyles();
  //console.log(`1111`);

  useEffect(() => {
    // const onPasswordValueChange = (val) => {
    //console.log(`2222 >> ${JSON.stringify(formState)}`);
    const val = formState?.values?.password || "";

    // if (!!val) {
    //console.log(`3333`);
    const _upper = val.search(/[A-Z]/) > -1;
    setHasUpperCase(_upper);
    const _lower = val.search(/[a-z]/) > -1;
    setHasLowerCase(_lower);
    const _number = val.search(/[0-9]/) > -1;
    setHasNumber(_number);
    const _special = val.search(/[!#()^$+=?[\]*&@]/) > -1;
    setHasSpecialChars(_special);
    const _eight = val.length > 7;
    sethasMinChars(_eight);

    setNotCompleted(!(_upper && _lower && _number && _special && _eight));
    setFailedPasswordValidate(
      !(_upper && _lower && _number && _special && _eight)
    );
    // }
    if (!val) {
      setNotCompleted(true);
      setFailedPasswordValidate(false);
    }
    //   };
  }, [formState?.values?.password]);

  const passwordStatusIcon = (status) =>
    status ? (
      <PassCircle style={{ fontSize: 14, color: "#06af06" }} />
    ) : (
      <FailCircle style={{ fontSize: 14, color: "#e22c2c" }} />
    );

  return (
    <div
      className={classes.password_status_box}
      style={{
        display: formState.touched.password && notCompleted ? "flex" : "none",
        backgroundColor: notCompleted ? "#fff8f8" : "#f8fff8",
      }}
    >
      <div>
        {passwordStatusIcon(hasUpperCase)}
        <span>Containts uppercase</span>
      </div>
      <div>
        {passwordStatusIcon(hasLowerCase)}
        <span>Contains lowercase</span>
      </div>
      <div>
        {passwordStatusIcon(hasNumber)}
        <span>Contains a number</span>
      </div>
      <div>
        {passwordStatusIcon(hasMinChars)}
        <span>Up to 8 characters</span>
      </div>
      <div>
        {passwordStatusIcon(hasSpecialChars)}
        <span>{`Contains a special character e.g !#(*&`}</span>
      </div>
    </div>
  );
};

export default withRouter(SettingsPassword);
