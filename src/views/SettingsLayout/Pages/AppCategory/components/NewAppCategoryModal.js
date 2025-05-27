import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  Modal,
  Fade,
  Backdrop,
  IconButton,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";
import useStyles from "./style";

export default function NewUserModal({
  closeModal,
  mode,
  data,
  saveNewUserGroup,
}) {
  const classes = useStyles();
  const [newFormData, setNewFormData] = useState({});
  const [usersDetails, setUsersDetails] = useState([]);
  const [textColor, setTextColor] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [emptyFieldCheck, setEmptyFieldCheck] = useState(true);
  const [disableSave, setDisableSave] = useState(true);

  const _updateForm = (orig, val) => {
    setNewFormData({
      ...newFormData,
      [orig]: val,
    });
  };

  useEffect(() => {
    function generateDarkColor() {
      let color = "#";
      for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
      }
      setTextColor(color);
      _updateForm("color", color);
      return color;
    }
    generateDarkColor();
  }, []);

  const _handleNewUserForm = async () => {
    if (!newFormData.name || !newFormData.color) {
      const bothFields = !newFormData.name && !newFormData.color;
    } else {
      // saveNewUserGroup(newFormData);
      closeModal({ mode, data: { ...newFormData, id: data.id } });
      setNewFormData({});
    }
  };

  useEffect(() => {
    if (newFormData.name && newFormData.color) {
      setEmptyFieldCheck(false);
    } else {
      setEmptyFieldCheck(true);
    }
  }, [newFormData]);

  useEffect(() => {
    if (newFormData.name && newFormData.name.length > 25) {
      setErrMsg("Name should be 25 characters or less");
      setDisableSave(true);
    } else {
      setErrMsg("");
      setDisableSave(false);
    }
  }, [newFormData.name]);

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
                {mode} App Category
              </Typography>
              <IconButton
                aria-label="cancel"
                color="inherit"
                onClick={closeModal}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </div>
            <div className={classes.modalMain}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Name
                    <span style={{ color: "red" }}>{"*"}</span>
                  </Typography>
                  <TextField
                    onChange={(e) => _updateForm("name", e.target.value)}
                    fullWidth
                    defaultValue={data && data.name}
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter app category name"
                    size="small"
                    error={errMsg !== ""}
                    helperText={errMsg}
                    InputProps={{
                      inputProps: {
                        style: {
                          color: `${textColor}`,
                          fontSize: "15px",
                        },
                      },
                    }}
                  />
                </Grid>
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
              <FormControl>
                <Button
                  id="cancel-category-btn"
                  onClick={closeModal}
                  variant="contained"
                  color="primary"
                  classes={{
                    root: classes.customButton,
                    label: classes.customButtonLabel,
                  }}
                >
                  Cancel
                </Button>
              </FormControl>
              <FormControl size="small" style={{ marginLeft: 10 }}>
                <Button
                  id="save-category-btn"
                  onClick={_handleNewUserForm}
                  variant="contained"
                  color="primary"
                  disabled={emptyFieldCheck || disableSave}
                  classes={{
                    root: classes.customButton,
                    label: classes.customButtonLabel,
                  }}
                >
                  Save
                </Button>
              </FormControl>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
