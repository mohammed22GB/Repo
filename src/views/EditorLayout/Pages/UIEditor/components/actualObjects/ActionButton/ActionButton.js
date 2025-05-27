import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Linker from "../../../../../../common/components/Linker";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";

export default function ButtonComponent({ style, action, values, ...props }) {
  const useStyles = makeStyles((theme) => style);
  const classes = useStyles();

  if (props.disabled) return null;
  // This is a hack to hide submit buttons on form during approvals

  const { buttonText } = values;
  return (
    <div className={classes?.dimensions}>
      {Object.keys(values?.navigation || {})?.length > 0 &&
      values?.navigation.name?.toLowerCase() !== "none" ? (
        <Linker
          appDesignMode={props.appDesignMode}
          navigation={values?.navigation}
        >
          <Button
            className={`${classes?.button} ${classes?.dimensions}`}
            onClick={action}
          >
            {buttonText}
          </Button>
        </Linker>
      ) : (
        <Button
          disabled={
            props.appDesignMode === APP_DESIGN_MODES.EDIT ||
            props.appDesignMode === APP_DESIGN_MODES.PREVIEW
          }
          type={values?.type}
          className={`${classes?.button} ${classes?.dimensions}`}
          onClick={values?.type === "submit" ? () => {} : action}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
