import React, { useEffect, useState } from "react";
import { Typography, ListItem, ListItemText, Box } from "@material-ui/core";

import { StatusSwitchStyles } from "../../SettingsLayout/Pages/UserManagement/components/SwitchStyles";
import { updateUserAccount } from "../../common/components/Mutation/ProfileSetting/userMutations";
import { ActionMenu } from "./ActionMenu";

import useCustomMutation from "../../common/utils/CustomMutation";
import moment from "moment";
import useStyles from "./style";

const SingleAccount = ({
  data,
  index,
  handleOpenIntegrations,
  refetch,
  isFetching,
}) => {
  const classes = useStyles();
  const [active, setActive] = useState(data.active);

  const { mutate: updateAccount, isLoading: isUpdateAccountLoading } =
    useCustomMutation({
      apiFunc: updateUserAccount,
      onSuccess: () => refetch(),
      onError: () => refetch(),
      retries: 0,
    });

  useEffect(() => {
    if (!isFetching) {
      setActive(data.active);
    }
  }, [isFetching]);

  return (
    <>
      <div
        className="table-row_"
        key={`data-${data._id}`}
        // style={{
        //   display: isDeleted ? "none" : "flex",
        // }}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 4px rgba(110, 110, 110, 0.25)",
          marginTop: 1,
          marginBottom: 1,
        }}
      >
        <ListItem
          className={classes.table}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <ListItemText
            style={{ flex: 0.3, minWidth: 32 }}
            primary={
              <Typography style={{ paddingRight: 5, textAlign: "right" }}>
                {`${Number(index + 1)}.`}
              </Typography>
            }
          />
          <ListItemText
            style={{ flex: 2 }}
            primary={
              <div className={classes.name}>
                <div className="description">
                  <Typography style={{ overflowWrap: "anywhere" }}>
                    {data.name || "---"}
                  </Typography>
                </div>
              </div>
            }
          />
          <ListItemText
            style={{ flex: 1 }}
            primary={
              <Typography style={{ overflowWrap: "anywhere" }}>
                {moment(data.createdAt).format("L") || "--"}
              </Typography>
            }
          />
          <ListItemText
            style={{ flex: 2 }}
            primary={
              <div>
                <Typography style={{ overflowWrap: "anywhere" }}>
                  {data.email || "---"}
                </Typography>
              </div>
            }
          />
          <ListItemText
            style={{ flex: 0.5, textAlign: "center" }}
            primary={
              <div>
                <Typography>
                  {!data.totalUsers.length
                    ? data.totalUsers.length
                    : data.totalUsers[0]?.total}
                </Typography>
              </div>
            }
          />
          <ListItemText
            style={{ flex: 0.7, textAlign: "center" }}
            primary={
              <div>
                <Typography>
                  {!data.totalApps.length
                    ? data.totalApps.length
                    : data.totalApps[0]?.total}
                </Typography>
              </div>
            }
          />
          <ListItemText
            style={{
              flex: "unset",
              width: 120,
              marginRight: 15,
              textAlign: "center",
            }}
            onClick={() =>
              data.integrations.length && handleOpenIntegrations(index)
            }
            primary={
              <div>
                {data.integrations.length ? (
                  <Box boxShadow={2} className={classes.expandButton}>
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        overflowWrap: "anywhere",
                        textAlign: "center",
                        alignSelf: "center",
                        fontSize: 12,
                      }}
                    >
                      {/* {data.integrations[0].substring(
                        0,
                        data.integrations[0].indexOf(
                          data.integrations[0].match(/\p{Lu}/gu)[1]
                        )
                      )} */}
                      View all
                      <span className="inner-badge">
                        {data.integrations.length}
                      </span>
                    </Typography>
                  </Box>
                ) : (
                  "---"
                )}
              </div>
            }
          />
          <ListItemText
            style={{ flex: 1.5 }}
            primary={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography style={{ marginRight: 6 }}>
                  {`${moment(data.updatedAt).format("L") || "--"} ${(
                    moment(data.updatedAt).format("LT") || ""
                  )?.toLowerCase()}`}
                </Typography>
              </div>
            }
          />
          <ListItemText
            style={{ flex: 2, textAlign: "center" }}
            primary={
              <StatusSwitchStyles
                checked={active}
                disabled={isUpdateAccountLoading}
                onChange={(e) => {
                  setActive(e.target.checked);
                  updateAccount({
                    id: data._id,
                    active: e.target.checked,
                  });
                }}
              />
            }
          />
          <ListItemText
            style={{ flex: 0.8 }}
            primary={<ActionMenu data={data} />}
          />
        </ListItem>
      </div>
    </>
  );
};

export default SingleAccount;
