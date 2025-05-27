import { useEffect, useState } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  NOTIFICATION_MENU,
  SINGLE_NOTIFICATION,
} from "../../../store/actions/inappActions";
import NotificationItem from "./NotificationItem";
import Parser from "html-react-parser";
//import CustomListNotification from "../../../components/InAppNotification/CustomListNotification";

const useStyles = makeStyles((theme) => ({
  container: ({ isLoading }) => ({
    width: "100%",
    //minWidth: "50%",
    minHeight: "10rem",
    // boxShadow: "0px 0px 5px #ccc",
    border: "solid 1px #eee",
    borderRadius: 7,
    backgroundColor: isLoading ? "transparent" : "#fdfdfd",
  }),
  wrapper: {
    width: "100%",
    display: "flex",
    // height: "100%",
    flexDirection: "column",
  },

  topHeading: {
    margin: "2rem 0px",
    textTransform: "capitalize",
    width: "50%",
    minWidth: "170px",
    transform: "translate(10%, 100%)",
  },
  list: {
    width: "100%",
    // height: "65vh",
    //marginTop: "2rem",
  },

  search: {
    display: "flex",
    marginTop: "1rem",
    paddingLeft: "1.3rem",
  },

  text: {
    fontSize: 20,
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
  },

  btn_wrapper: {
    position: "absolute",
    top: "1%",
    left: "0.5rem",
  },
}));

const NotificationsList = (props) => {
  const { isLoading, notificationMenu, isFetching, notificationsData } = props;
  const classes = useStyles({ isLoading });
  const history = useHistory();

  const [_sort, setSort] = useState("");
  const [_category, setCategory] = useState("");

  const dispatch = useDispatch();
  const { pageSearchText } = useSelector(({ reducers }) => reducers);

  const parseTitle = (title) => {
    const content = Parser(title);
    const extractChild = content[0] + content[1]?.props?.children + content[2];
    return `${extractChild}`;
  };

  useEffect(() => {
    let filteredContent = notificationsData?.filter((data) =>
      parseTitle(data?.title)
        ?.toLowerCase()
        ?.includes(pageSearchText?.toLowerCase())
    );

    dispatch({
      type: NOTIFICATION_MENU,
      payload: [...filteredContent],
    });
  }, [pageSearchText]);

  /**
   * It creates a new object with a key of the value of the sortBy object's sortby property.
   * @param sortBy - {
   */
  const handleSortBy = async (sortBy) => {
    /* This is a way to create a new object. */
    let sortOption = {};

    switch (sortBy?.sortby) {
      case "updatedAt":
        sortOption[sortBy?.sortby] = "desc";
        break;

      default:
        break;
    }

    // set the query
    // setSortParams(sortOption);

    /* This is a way to set the sort parameter. */
    setSort(sortBy?.sortby);
  };

  const handleFilterBy = async (filterBy) => {
    setCategory(filterBy?.categories);
  };

  const handleGoBack = () => {
    /* Sending a notification to the store that a notification has been dismissed. */
    dispatch({ type: SINGLE_NOTIFICATION, payload: null });
    history.goBack();
    /* The above code is navigating back to the previous page. */
  };

  return (
    <>
      {!isFetching && !!notificationMenu?.length && (
        <div className={classes.container}>
          <Grid container item className={classes.wrapper}>
            <Grid item className={classes.list}>
              {!isLoading &&
                notificationMenu.map((data, idx) => (
                  <NotificationItem
                    type={data?.type}
                    read={data?.read}
                    key={data?.idx}
                    id={data?._id}
                    title={data?.title}
                    createdAt={data?.createdAt}
                    description={data?.description}
                    history={history}
                    link={data?.link}
                  />
                ))}
            </Grid>
          </Grid>
        </div>
      )}

      {!isFetching && !notificationMenu?.length && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "5em" }}
        >
          <Typography style={{ fontSize: "0.8rem", color: "red" }}>
            No notification was found
          </Typography>
        </Grid>
      )}
    </>
  );
};

export default NotificationsList;
