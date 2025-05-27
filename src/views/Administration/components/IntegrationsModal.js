import { useState } from "react";
import {
  Typography,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  List,
  Box,
  Badge,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";
import useStyles from "./style";
//import { integrationsData } from "./FakeData";

export default function IntegrationsModal({ closeModal, integrations }) {
  const classes = useStyles();
  const [newFormData, setNewFormData] = useState({});
  const [usersDetails, setUsersDetails] = useState([]);

  const _handleNewUserForm = async () => {
    if (!newFormData.name || !newFormData.color) {
      // errorToastify('All fields are compulsory');
    } else {
      // saveNewUserGroup(newFormData);
      closeModal({ data: newFormData });
      setNewFormData({});
    }
  };

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
        <div className={classes.modal1}>
          <div>
            <div className="modalHead">
              Integrations
              <IconButton
                aria-label="cancel"
                color="inherit"
                onClick={closeModal}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </div>
            <List className={[classes.billingsTable, classes.listModal]}>
              <li>
                <ul className={classes.ul}>
                  <div className={classes.itemsWrap}>
                    {Object.keys(integrations).map((data) => (
                      <Badge
                        color="error"
                        className={classes.modalBadge}
                        badgeContent={
                          integrations[data] > 1 ? integrations[data] : 0
                        }
                        classes={{
                          badge: classes.modalBadge1,
                        }}
                      >
                        <Box boxShadow={2} className={classes.integrations}>
                          <Typography
                            style={{
                              overflowWrap: "anywhere",
                              fontSize: 13,
                              fontWeight: 300,
                            }}
                          >
                            {/* {data} */}
                            {data?.substring(
                              0,
                              data.indexOf(data.match(/\p{Lu}/gu)[1])
                            )}{" "}
                            Integration
                          </Typography>
                        </Box>
                      </Badge>
                    ))}
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
