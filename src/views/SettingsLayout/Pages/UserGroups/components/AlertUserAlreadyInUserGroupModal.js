import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import useStyles from "./style";
import AlertImage from "../../../../../assets/images/user-group-alert.svg";

export default function AlertUserInUserGroupModal({
  open,
  handleClose,
  memberId,
  updateUser,
}) {
  const classes = useStyles();

  return (
    <Dialog
      maxWidth={"sm"}
      open={open}
      onClose={() => {
        handleClose(false);
      }}
      data-testid="alert-user-group-already-exist"
      aria-labelledby="responsive-dialog-title"
      classes={{
        paper: classes.customPaper,
      }}
    >
      <DialogContent>
        <div className={classes.alertModalContent}>
          <div>
            <img
              src={AlertImage}
              alt="alert_user_already_exist"
              width={80}
              height={80}
            />
          </div>
          <div>
            <DialogContentText
              classes={{
                root: classes.alertModalContentText,
              }}
            >
              This member is already added to another department. Proceeding
              with this action will remove them from their current department
              and add them to this new department.
            </DialogContentText>
          </div>
        </div>
      </DialogContent>
      <div className={classes.alertModalActions}>
        <DialogActions
          classes={{
            root: classes.alertModalDialogActions,
          }}
        >
          <div className={classes.alertModalButtonBox}>
            <Button
              autoFocus
              onClick={() => {
                handleClose(false);
              }}
              variant="outlined"
              color="primary"
              className={classes.alertModalCancelButton}
              classes={{
                root: classes.customButton,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const updated = {
                  ...memberId.current,
                  switchFunctionalUserGroup: true,
                };

                updateUser({ data: updated });
                handleClose(false);
              }}
              variant="contained"
              color="primary"
              disabled={false}
              className={classes.alertModalChangeButton}
              classes={{
                root: classes.customButton,
              }}
            >
              Change department
            </Button>
          </div>
        </DialogActions>
      </div>
    </Dialog>
  );
}
