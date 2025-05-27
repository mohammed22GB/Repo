import { useState } from "react";
import {
  Grid,
  List,
  ListSubheader,
  Typography,
  ListItemText,
  Paper,
} from "@material-ui/core";

import useStyles from "./style";
import { getOrganizations } from "../utils/administrationAPIs";
import useCustomQuery from "../../common/utils/CustomQuery";

const BillingHistory = (props) => {
  const classes = useStyles();
  const [filteredAppCategories, setFilteredAppCategories] = useState([]);
  const [entries, setEntries] = useState(0);
  const [allAppCategories, setAllAppCategories] = useState([]);

  const options = {
    query: {
      // population: ["users"],
      population: [{ path: "categories", select: "id name" }],
    },
  };
  const onGetAppCategorySuccess = ({ data }) => {
    setAllAppCategories(data?.data?.response);
    setEntries(data._meta.pagination.total_count);
  };

  const { isLoading, isFetching } = useCustomQuery({
    //queryKey: ["allAppCategories", options],
    apiFunc: getOrganizations,
    onSuccess: onGetAppCategorySuccess,
  });
  // const fakeDeltaMembersLength = (delta) => {
  //   setFakeGroupMemebersCount(fakeGroupMemebersCount + delta);
  // };
  return (
    // <Grid
    //   container
    //   item
    //   sm={12}
    //   xs={12}
    //   justifyContent="flex-end"
    //   className={classes.topMargin0}
    // >
    <Grid container item sm={6} xs={6}>
      <Paper elevation={3} className={classes.billingSection}>
        <Typography
          variant="h1"
          style={{
            paddingLeft: 15,
            fontSize: 12,
            position: "sticky",
            background: "#FFFFFF",
            zIndex: 2,
            width: "100%",
            top: 0,
            borderBottom: "0.2px solid #ABB3BF",
          }}
        >
          Billing history
        </Typography>
        <List className={classes.billingsTable}>
          <li className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader
                style={{
                  display: "flex",
                  flexDirection: "row",
                  //justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#F3F7FB",
                  padding: "3px 15px",
                  marginBottom: 2,
                  borderRadius: "24px",
                }}
              >
                <ListItemText
                  style={{ flex: 1.2 }}
                  primary={
                    <Typography
                      variant="h6"
                      className={classes.billingSubHeader}
                    >
                      Plan
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 0.7 }}
                  primary={
                    <Typography
                      variant="h6"
                      className={classes.billingSubHeader}
                    >
                      Date
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 1 }}
                  primary={
                    <Typography
                      variant="h6"
                      className={classes.billingSubHeader}
                    >
                      Amount
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 0.8 }}
                  primary={
                    <Typography
                      variant="h6"
                      className={classes.billingSubHeader}
                    >
                      Status
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 0.5 }}
                  primary={
                    <Typography
                      variant="h6"
                      className={classes.billingSubHeader}
                    >
                      Action
                    </Typography>
                  }
                />
              </ListSubheader>
              <Typography
                variant="h6"
                style={{
                  marginTop: "6%",
                  textAlign: "center",
                  color: "gray",
                  fontStyle: "italic",
                  fontSize: 12,
                  fontWeight: 300,
                }}
              >
                No records found
              </Typography>
            </ul>
          </li>
        </List>
      </Paper>
    </Grid>
    // </Grid>
  );
};

export default BillingHistory;
