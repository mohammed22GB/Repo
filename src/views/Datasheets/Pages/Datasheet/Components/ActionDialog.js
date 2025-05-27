import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

const ActionDialog = ({
  actionMode,
  setActionMode,
  handleItemDelete,
  selectedItem,
}) => {
  const handleRemoveItem = async () => {
    handleItemDelete(actionMode.type);
  };

  return (
    <Dialog
      open={true}
      onClose={() => setActionMode({})}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm delete</DialogTitle>
      <DialogContent>
        {actionMode.type === "column" ? (
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to DELETE {actionMode?.type}: "
            {selectedItem?.[actionMode.type]?.name}"?
          </DialogContentText>
        ) : (
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to DELETE the selected row(s) ?
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setActionMode({})}
          color="primary"
          autoFocus
          style={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleRemoveItem()}
          color="primary"
          style={{ textTransform: "none" }}
        >
          Delete!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
