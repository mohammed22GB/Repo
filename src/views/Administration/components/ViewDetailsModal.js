import { useState } from "react";
import {
  Typography,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";
import moment from "moment";

import useStyles from "./style";
import { getOrganizationDetails } from "../utils/administrationAPIs";
import useCustomQuery from "../../common/utils/CustomQuery";

export default function ViewDetailsModal({ closeModal, roleDetails, ID }) {
  const classes = useStyles();
  const [newFormData, setNewFormData] = useState({});
  const [orgDetails, setOrgDetails] = useState();

  const _handleNewUserForm = async () => {
    if (!newFormData.name || !newFormData.color) {
      // errorToastify('All fields are compulsory');
    } else {
      // saveNewUserGroup(newFormData);
      closeModal({ data: newFormData });
      setNewFormData({});
    }
  };
  // fetch Organization detail
  const options = {
    query: {
      // population: ["users"],
      ID,
      population: [{ path: "categories" }],
    },
  };
  const onGetUsersSuccess = ({ data }) => {
    //console.log(data.data[0]);
    const loadedData = data.data[0];
    setOrgDetails(data.data[0]);
  };

  const { isLoading, isFetching } = useCustomQuery({
    queryKey: ["orgDetails", options, ID],
    apiFunc: getOrganizationDetails,
    onSuccess: onGetUsersSuccess,
  });

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
        <div className={classes.modal2}>
          <div>
            <div className="modalHead">
              About Organization
              <IconButton
                aria-label="cancel"
                color="inherit"
                onClick={closeModal}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </div>
            <List className={[classes.billingsTable, classes.listModal]}>
              <li className="table-row_">
                <ul className={classes.ul}>
                  <ListSubheader
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      position: "static",
                      alignItems: "center",
                      backgroundColor: "#F3F7FB",
                      padding: "3px 15px",
                      marginBottom: 2,
                      borderRadius: "24px",
                    }}
                  >
                    <ListItemText
                      style={{ flex: 1, marginLeft: 10 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Organization name
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 1.1 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Industry
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 0.6 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Location
                        </Typography>
                      }
                    />
                  </ListSubheader>
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "6px 0",
                      marginTop: 2,
                      marginLeft: 10,
                    }}
                  >
                    <ListItem>
                      <ListItemText
                        style={{ flex: 1 }}
                        primary={
                          <div className={classes.name}>
                            <div className="description">
                              <Typography style={{ overflowWrap: "anywhere" }}>
                                {orgDetails?.name || ""}
                              </Typography>
                            </div>
                          </div>
                        }
                      />
                      <ListItemText
                        style={{ flex: 1.1 }}
                        primary={
                          <Typography style={{ overflowWrap: "anywhere" }}>
                            {orgDetails?.industry || "𝘕𝘰𝘵 𝘧𝘰𝘶𝘯𝘥"}
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 0.6 }}
                        primary={
                          <div>
                            <Typography style={{ overflowWrap: "anywhere" }}>
                              {orgDetails?.country || ""}
                            </Typography>
                          </div>
                        }
                      />
                    </ListItem>
                  </div>
                  <ListSubheader
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      position: "static",
                      alignItems: "center",
                      backgroundColor: "#F3F7FB",
                      padding: "3px 15px",
                      marginBottom: 2,
                      borderRadius: "24px",
                    }}
                  >
                    <ListItemText
                      style={{ flex: 1, marginLeft: 10 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Created
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 1.1 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          No. of employees
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 0.6 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Plan
                        </Typography>
                      }
                    />
                  </ListSubheader>
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "6px 0",
                      marginTop: 2,
                      marginLeft: 10,
                    }}
                  >
                    <ListItem>
                      <ListItemText
                        style={{ flex: 1 }}
                        primary={
                          <div className={classes.name}>
                            <div className="description">
                              <Typography style={{ overflowWrap: "anywhere" }}>
                                {moment(orgDetails?.createdAt).format("L") ||
                                  "--"}
                              </Typography>
                            </div>
                          </div>
                        }
                      />
                      <ListItemText
                        style={{ flex: 1.1 }}
                        primary={
                          <Typography style={{ overflowWrap: "anywhere" }}>
                            {orgDetails?.noOfEmployee || 0}
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 0.6 }}
                        primary={
                          <div>
                            <Typography style={{ overflowWrap: "anywhere" }}>
                              {orgDetails?.plan || "𝘕𝘰 𝘱𝘭𝘢𝘯"}
                            </Typography>
                          </div>
                        }
                      />
                    </ListItem>
                  </div>
                  <ListSubheader
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      position: "static",
                      alignItems: "center",
                      backgroundColor: "#F3F7FB",
                      padding: "3px 15px",
                      marginBottom: 2,
                      borderRadius: "24px",
                    }}
                  >
                    <ListItemText
                      style={{ flex: 1, marginLeft: 10 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Admin name
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 1.1 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Email
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 0.6 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Phone no.
                        </Typography>
                      }
                    />
                  </ListSubheader>
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "6px 0",
                      marginTop: 2,
                      marginLeft: 10,
                    }}
                  >
                    <ListItem>
                      <ListItemText
                        style={{ flex: 1 }}
                        primary={
                          <div className={classes.name}>
                            <div className="description">
                              <Typography style={{ overflowWrap: "anywhere" }}>
                                {orgDetails?.adminName || "𝘕𝘰𝘵 𝘧𝘰𝘶𝘯𝘥"}
                              </Typography>
                            </div>
                          </div>
                        }
                      />
                      <ListItemText
                        style={{ flex: 1.1 }}
                        primary={
                          <Typography style={{ overflowWrap: "anywhere" }}>
                            {orgDetails?.email || "𝘕𝘰𝘵 𝘧𝘰𝘶𝘯𝘥"}
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 0.6 }}
                        primary={
                          <div>
                            <Typography style={{ overflowWrap: "anywhere" }}>
                              {orgDetails?.mobile || "𝘕𝘰𝘵 𝘧𝘰𝘶𝘯𝘥"}
                            </Typography>
                          </div>
                        }
                      />
                    </ListItem>
                  </div>
                  <ListSubheader
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      position: "static",
                      alignItems: "center",
                      backgroundColor: "#F3F7FB",
                      padding: "3px 15px",
                      marginBottom: 2,
                      borderRadius: "24px",
                    }}
                  >
                    <ListItemText
                      style={{ flex: 1, marginLeft: 10 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Total users
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 1.1 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Total live apps
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 0.6 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Total app drafts
                        </Typography>
                      }
                    />
                  </ListSubheader>
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "6px 0",
                      marginTop: 2,
                      marginLeft: 10,
                    }}
                  >
                    <ListItem>
                      <ListItemText
                        style={{ flex: 1 }}
                        primary={
                          <div className={classes.name}>
                            <div className="description">
                              <Typography style={{ overflowWrap: "anywhere" }}>
                                {orgDetails?.totalUsers[0]?.total ||
                                  "𝘕𝘰 𝘶𝘴𝘦𝘳 𝘧𝘰𝘶𝘯𝘥"}
                              </Typography>
                            </div>
                          </div>
                        }
                      />
                      <ListItemText
                        style={{ flex: 1.1 }}
                        primary={
                          <Typography style={{ overflowWrap: "anywhere" }}>
                            {orgDetails?.totalApps[0]?.total || "𝘕𝘰 apps 𝘧𝘰𝘶𝘯𝘥"}
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 0.6 }}
                        primary={
                          <div>
                            <Typography style={{ overflowWrap: "anywhere" }}>
                              {orgDetails?.totalApps[0]?.draft || "𝘕𝘰 𝘥𝘳𝘢𝘧𝘵𝘴"}
                            </Typography>
                          </div>
                        }
                      />
                    </ListItem>
                  </div>
                  <ListSubheader
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      position: "static",
                      alignItems: "center",
                      backgroundColor: "#F3F7FB",
                      padding: "3px 15px",
                      marginBottom: 2,
                      borderRadius: "24px",
                    }}
                  >
                    <ListItemText
                      style={{ flex: 1, marginLeft: 10 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          No of sessions
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 1.1 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Last user login
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 0.6 }}
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.detailsHeader}
                        >
                          Total Integrations
                        </Typography>
                      }
                    />
                  </ListSubheader>
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "6px 0",
                      marginTop: 2,
                      marginLeft: 10,
                    }}
                  >
                    <ListItem>
                      <ListItemText
                        style={{ flex: 1 }}
                        primary={
                          <div className={classes.name}>
                            <div className="description">
                              <Typography style={{ overflowWrap: "anywhere" }}>
                                {orgDetails?.sessions || "𝘕𝘰 𝘳𝘦𝘤𝘰𝘳𝘥 𝘧𝘰𝘶𝘯𝘥"}
                              </Typography>
                            </div>
                          </div>
                        }
                      />
                      <ListItemText
                        style={{ flex: 1.1 }}
                        primary={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography style={{ marginRight: 6 }}>
                              {moment(orgDetails?.updatedAt).format("L") ||
                                "--"}{" "}
                            </Typography>
                            <Typography variant="body2">
                              {" "}
                              {moment(orgDetails?.updatedAt).format("LT") || ""}
                            </Typography>
                          </div>
                        }
                      />
                      <ListItemText
                        style={{ flex: 0.6 }}
                        primary={
                          <div>
                            <Typography style={{ overflowWrap: "anywhere" }}>
                              {"15"}
                            </Typography>
                          </div>
                        }
                      />
                    </ListItem>
                  </div>
                </ul>
              </li>
            </List>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
