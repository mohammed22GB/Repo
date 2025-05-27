import React, { useState } from "react";
import { Typography, Grid, Divider, Button, Tooltip } from "@material-ui/core";
import useStyles from "./style";
import AssignUserModal from "./AssignUserModal";
import CustomPromptBox from "../../../../common/components/CustomPromptBox/CustomPromptBox";
import { useQueryClient } from "react-query";
import NewUserModal from "./NewUserGroupModal";
import EditIcon from "@material-ui/icons/Edit";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import DeleteIcon from "@material-ui/icons/Delete";

const SingleUser = ({
  item,
  toggleRolePermissions,
  toggleRoleUsers,
  userGroups,
  deleteMe,
  userGroupType,
}) => {
  const classes = useStyles();
  const [openAssignMembers, setOpenAssignMembers] = useState(false);
  const [groupData, setGroupData] = useState({});
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [refetchQuery, setRefetchQuery] = useState(false);
  const [deleteUserGroupModal, setDeleteUserGroupModal] = useState(false);
  const [editUserGroupModal, setEditUserGroupModal] = useState(null);
  const queryClient = useQueryClient();

  const handleAssignMembers = () => {
    setGroupData(item);
    setOpenAssignMembers(true);
  };

  const handleRemoveGroup = async () => {
    deleteMe();
  };

  const closeAssignModal = () => {
    setOpenAssignMembers(false);
    if (refetchQuery) {
      queryClient.invalidateQueries(["allUserGroups"]);
      setRefetchQuery(false);
    }
    queryClient.removeQueries(["allUsers"]);
    //observerElem.current = null;
  };

  return (
    <Grid
      title="userGroupItem"
      item
      xs={12}
      sm={12}
      lg={12}
      style={{ display: isDeleted ? "none" : "flex" }}
    >
      <div className={classes.singleUserGroupCard}>
        <div className={classes.singleUserGroupCardHeader}>
          <Tooltip title={item?.name} placement="top">
            <Typography className={classes.singleUserGroupCardItemName}>
              {item?.name}
            </Typography>
          </Tooltip>

          <Typography className={classes.singleUserGroupCardItemUserLength}>
            {item?.users?.length || 0}{" "}
            {item?.users?.length === 1 ? "member" : "members"}
          </Typography>
          <div className={classes.singleUserGroupCardItemActions}>
            <EditIcon
              htmlColor="#535353"
              title="editGroupIcon"
              onClick={() => setEditUserGroupModal("edit")}
              className={classes.iconPointer}
            />
            <SupervisedUserCircleIcon
              htmlColor="#535353"
              title="groupListIcon"
              onClick={handleAssignMembers}
              className={classes.iconPointer}
            />
            <DeleteIcon
              htmlColor="#535353"
              title="deleteGroupIcon"
              onClick={() => setDeleteUserGroupModal(true)}
              className={classes.iconPointer}
            />
          </div>
        </div>
        <Divider className={classes.singleUserGroupCardDivider} />
        <div className={classes.singleUserGroupCardItemButtonContainer}>
          <Button
            variant="contained"
            className={classes.singleUserGroupCardItemButton}
            onClick={handleAssignMembers}
          >
            View member
          </Button>
        </div>
      </div>
      {editUserGroupModal === "edit" && (
        <NewUserModal
          closeModal={() => setEditUserGroupModal(null)}
          id={item?.id || item?._id}
          name={item?.name}
          description={item?.description}
          // userGroupType={item?.type}
          mode={editUserGroupModal}
          userGroupType={item?.type ?? userGroupType}
        />
      )}
      {openAssignMembers && (
        <AssignUserModal
          usergroupID={item?.id || item?._id}
          adminArr={item?.admins}
          groupData={groupData}
          userGroups={userGroups}
          open={openAssignMembers}
          closeModal={closeAssignModal}
          setRefetchQuery={setRefetchQuery}
        />
      )}
      {deleteUserGroupModal && (
        <CustomPromptBox
          title="confirm deletion"
          actionText={
            "Kindly type “delete” in the text field below to continue this action. Note that you lose the user group and members assigned to it."
          }
          handleCloseDialog={setDeleteUserGroupModal}
          open={deleteUserGroupModal}
          confirmAction={() => handleRemoveGroup()}
        />
      )}
    </Grid>
  );
};

export default SingleUser;
