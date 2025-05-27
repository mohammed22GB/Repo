import React from "react";
import {
  Grid,
  Typography,
  Button,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Box,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";
import useStyles from "./style";

export default function ViewRolesModal({ closeModal, roleDetails }) {
  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={true}
      onClose={closeModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={true}>
        <div className={classes.paper2}>
          <div>
            <div className={classes.modalHead}>
              <Typography
                variant="h5"
                component="h2"
                style={{ textTransform: "capitalize" }}
              >
                Permissions
              </Typography>
              <IconButton
                aria-label="cancel"
                color="inherit"
                onClick={closeModal}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </div>
            <div className={classes.modalMain} id="permissions-list">
              <Grid
                //style={{ overflow: "overlay" }}
                id={`roles-permission-scroller`}
                container
                direction="column"
                spacing={1}
              >
                <Grid item>
                  <Typography variant="h5" className={classes.modalTitle}>
                    {roleDetails.name}
                  </Typography>
                </Grid>
                {roleDetails.permissions.map((detail, index) => (
                  <Grid
                    key={`roles-permission-${index}`}
                    id={`roles-permission-${index}`}
                    item
                    className={classes.roleBox}
                  >
                    <Typography variant="h6" className={classes.modalText}>
                      {detail}
                    </Typography>
                  </Grid>
                ))}
                {/* <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Description
                  </Typography>
                  <TextField
                    onChange={(e) => _updateForm("description", e.target.value)}
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter app category description"
                    multiline
                    size="small"
                  />
                </Grid> */}

                {/* <Grid item style={{ marginTop: 20 }}><Link to="/emailnotifications"><Button variant="contained" color="primary" className={classes.customButtonLabel}>Change</Button></Link></Grid> */}
              </Grid>
            </div>
            <div className={classes.modalBase}>
              <Button
                onClick={closeModal}
                variant="outlined"
                //color="primary"
                classes={{
                  root: classes.cancelButton,
                  label: classes.cancelButtonLabel,
                }}
              >
                Cancel
              </Button>
              {/* <FormControl size="small" style={{ marginLeft: 10 }}>
                <Button
                  onClick={_handleNewUserForm}
                  variant="contained"
                  color="primary"
                  classes={{
                    root: classes.customButton,
                    label: classes.customButtonLabel,
                  }}
                >
                  Save
                </Button>
              </FormControl> */}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
