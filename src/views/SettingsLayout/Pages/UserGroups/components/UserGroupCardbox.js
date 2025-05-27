import { Typography } from "@material-ui/core";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import SortRoundedIcon from "@material-ui/icons/SortRounded";
import FilterListIcon from "@material-ui/icons/FilterList";
import SingleUserGroup from "./SingleUserGroup";
import useStyles from "./style";

const UserGroupCardbox = ({
  userGroupCardTitle,
  userGroupCardDescription,
  userGroup,
  userGroupType,
  deleteUserGroup,
  functionalStatus,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.userGroupCard}>
      <div className={classes.userGroupCardHeader}>
        <div>
          <Typography className={classes.userGroupCardTitle}>
            {userGroupCardTitle}
          </Typography>
          <Typography className={classes.userGroupCardDescription}>
            {userGroupCardDescription}
          </Typography>
        </div>

        <div className={classes.userGroupCardUtility}>
          <div
            data-testid="user-group-cardbox"
            onClick={functionalStatus}
            className={classes.userGroupCardAddIcon}
          >
            <AddCircleRoundedIcon fontSize="inherit" htmlColor="#2457C1" />
          </div>

          <div className={classes.userGroupCardFilter}>
            <Typography className={classes.userGroupCardFilterText}>
              Filter
            </Typography>

            <FilterListIcon htmlColor="#2457C1" fontSize="small" />
          </div>
          <div className={classes.userGroupCardFilter}>
            <Typography className={classes.userGroupCardFilterText}>
              Sort by
            </Typography>

            <SortRoundedIcon htmlColor="#2457C1" fontSize="small" />
          </div>
        </div>
      </div>
      <div className={classes.userGroupCardSingleUserCard}>
        {!!userGroup?.length &&
          userGroup.map((data) => (
            <SingleUserGroup
              key={data.id}
              item={data}
              userGroups={userGroup}
              deleteMe={() => deleteUserGroup(data.id)}
              userGroupType={userGroupType}
            />
          ))}
      </div>

      {!userGroup?.length && (
        <div className={classes.noRecord}>
          <Typography>No user group created yet.</Typography>
        </div>
      )}
    </div>
  );
};

export default UserGroupCardbox;
