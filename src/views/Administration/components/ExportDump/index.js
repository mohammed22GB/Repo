import { Backdrop, Button, Dialog, DialogTitle, Grid } from "@material-ui/core";
import { Fragment, useState } from "react";

import { AccountDump } from "../AccountDump";

const initialModalValue = {
  open: false,
  component: null,
  title: "",
};

export const ExportDump = () => {
  const [modal, setModal] = useState(initialModalValue);

  const handleCloseModal = () => {
    setModal(initialModalValue);
  };

  const handleAccountDump = () => {
    setModal({
      open: true,
      component: <AccountDump handleClose={handleCloseModal} />,
      title: "Export account dump",
    });
  };

  return (
    <Fragment>
      <Grid
        container
        item
        spacing={2}
        direction="row"
        justifyContent="flex-end"
      >
        <Grid item>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            onClick={handleAccountDump}
            style={{ textTransform: "none" }}
          >
            Export accounts
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={modal.open}
        onClose={handleCloseModal}
        aria-labelledby="export-dump-dialog"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <DialogTitle
          id="export-dump-dialog"
          style={{
            borderBottom: "1px solid #EEEEEE",
          }}
        >
          {modal.title}
        </DialogTitle>

        {modal.component}
      </Dialog>
    </Fragment>
  );
};
