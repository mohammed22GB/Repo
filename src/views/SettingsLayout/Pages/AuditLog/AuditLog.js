import {
  Grid,
  List,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
  TextField,
  FormControl,
  Select,
} from "@material-ui/core";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import ReactSpinnerTimer from "react-spinner-timer";
import { useEffect, useState, useRef } from "react";

import useStyles from "./components/styles";
import useCustomQuery from "../../../common/utils/CustomQuery";
import { getAuditLogsAPI } from "./utils/auditLogAPI";
import { errorToastify } from "../../../common/utils/Toastify";
import { DEBOUNCE_TIME } from "../../../common/utils/constants";
import { listNums } from "../../../common/utils/perPage";
import SingleLogInstance from "./components/SingleLogInstance";

const AuditLog = () => {
  const classes = useStyles();

  const { pageSearchText } = useSelector(({ reducers }) => reducers);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [pageError, setPageError] = useState(false);

  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [entries, setEntries] = useState(0);
  const [perPageArr, setPerPageArr] = useState([]);

  const [auditLogData, setAuditLogData] = useState([]);
  const [filteredAuditLogData, setFilteredAuditLogData] = useState([]);

  useEffect(() => {
    document.title = "Audit Logs";
  }, []);

  const onGetAppAuditLogsSuccess = (data) => {
    setAuditLogData(data.data?.data);
    setPerPage(data.data?._meta?.pagination?.per_page);
    setEntries(data.data?._meta?.pagination?.total_count);
    setIsLoading(false);
  };

  const onError = () => {
    setIsLoading(false);
    setIsSearching(false);
    setPageError(true);
  };

  const { isFetching } = useCustomQuery({
    queryKey: ["auditLogs", perPage, pageNo],
    apiFunc: getAuditLogsAPI,
    onSuccess: onGetAppAuditLogsSuccess,
    onError: onError,
  });

  useEffect(() => {
    setFilteredAuditLogData(auditLogData);
  }, [auditLogData]);

  useEffect(() => {
    handleSearchChange(pageSearchText);
  }, [pageSearchText]);

  const userDebounceSearch = useRef(
    debounce(async (searchValue) => {
      if (!searchValue) {
        return;
      }

      setIsSearching(true);
      try {
        const valueSearch = await getAuditLogsAPI(null, searchValue);
        const searchResult = valueSearch?.data;

        setFilteredAuditLogData(searchResult);
      } catch (error) {
        setIsSearching(false);
        errorToastify(
          "An error occured. Please try searching again after a while."
        );
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_TIME)
  );

  const handleSearchChange = (input) => {
    if (!auditLogData.length) {
      return;
    } else {
      userDebounceSearch.current(input);
      const filtered = !!input ? filteredAuditLogData : auditLogData;

      setFilteredAuditLogData(filtered);

      setPageNo((prevValue) => prevValue);
      setPerPage((prevValue) => prevValue);
    }
  };

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (entries) setPerPageArr(listNums(entries));
  }, [entries]);

  if (isLoading || isFetching) {
    return (
      <div className={classes.loadingPage}>
        <ReactSpinnerTimer
          timeInSeconds={3}
          totalLaps={2}
          isRefresh={false}
          onLapInteraction={handleChange}
        />
      </div>
    );
  }

  return (
    <div>
      {!isLoading && (
        <>
          {!isFetching && (
            <>
              {!filteredAuditLogData?.length && !isSearching && (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <img
                    src="../../../images/dashboard-no-post.svg"
                    alt="No Posts"
                    width={100}
                    style={{ marginTop: 50 }}
                  />
                  {pageError ? (
                    <div className={classes.errorMessage}>
                      An error occured. Please check your connection and
                      refresh.
                    </div>
                  ) : (
                    <div className={classes.noAuditLog}>
                      No Audit logs available.
                    </div>
                  )}
                </div>
              )}
              {(!!filteredAuditLogData?.length || isSearching) && (
                <Grid container item sm={12} xs={12}>
                  <Grid item sm={12} xs={12} style={{ overflow: "auto" }}>
                    <List className={classes.root} style={{ minWidth: 700 }}>
                      <li>
                        <ul className={classes.ul}>
                          <Paper elevation={2}>
                            <ListSubheader className={classes.listSubHeader}>
                              <ListItemText
                                style={{
                                  flex: 2.9,
                                  paddingLeft: 15,
                                }}
                                primary={
                                  <Typography
                                    variant="body2"
                                    className={classes.headingText}
                                  >
                                    User&apos;s name
                                  </Typography>
                                }
                              />
                              <ListItemText
                                style={{ flex: 3 }}
                                primary={
                                  <Typography
                                    variant="body2"
                                    className={classes.headingText}
                                  >
                                    Resource
                                  </Typography>
                                }
                              />
                              <ListItemText
                                style={{ flex: 3 }}
                                primary={
                                  <Typography
                                    variant="body2"
                                    className={classes.headingText}
                                  >
                                    Action
                                  </Typography>
                                }
                              />
                              <ListItemText
                                style={{ flex: 3 }}
                                primary={
                                  <Typography
                                    variant="body2"
                                    className={classes.headingText}
                                  >
                                    IP address
                                  </Typography>
                                }
                              />
                              <ListItemText
                                style={{ flex: 3.5 }}
                                primary={
                                  <Typography
                                    variant="body2"
                                    className={classes.headingText}
                                  >
                                    Device type
                                  </Typography>
                                }
                              />
                              <ListItemText
                                style={{ flex: 3.14 }}
                                primary={
                                  <Typography
                                    variant="body2"
                                    className={classes.headingText}
                                  >
                                    Timestamp
                                  </Typography>
                                }
                              />
                            </ListSubheader>
                          </Paper>

                          {isSearching ? (
                            <div className={classes.noRecord}>
                              <Typography>
                                Searching. Please Wait...
                                <img
                                  src="../../../images/loading-anim.svg"
                                  alt="searching"
                                  width={20}
                                />
                              </Typography>
                            </div>
                          ) : (
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                paddingBottom: 10,
                              }}
                            >
                              {!!filteredAuditLogData?.length &&
                                filteredAuditLogData?.map((item, index) => (
                                  <SingleLogInstance
                                    item={item}
                                    indexKey={index}
                                  />
                                ))}
                            </div>
                          )}
                        </ul>
                      </li>
                    </List>
                  </Grid>

                  {!!perPageArr?.length && (
                    <div className={classes.rowPerPage}>
                      <Typography>Rows per page:</Typography>
                      <FormControl className="perpage-dropdown">
                        <Select
                          className={classes.perPageInput}
                          defaultValue={perPage}
                          onChange={(e) => {
                            setPerPage(e.target.value);
                          }}
                          displayEmpty
                          native
                          inputProps={{
                            "aria-label": "Without label",
                            disableUnderline: true,
                          }}
                        >
                          {perPageArr.map((num) => (
                            <option
                              className={classes.options}
                              key={num}
                              value={num}
                            >
                              {num}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <Grid item>
                        <Typography>{entries} entries. </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>Showing</Typography>
                      </Grid>
                      <Grid item style={{ width: 80 }}>
                        <TextField
                          id="outlined-password-input"
                          type="number"
                          autoComplete="current-password"
                          variant="outlined"
                          size="small"
                          InputProps={{
                            inputProps: {
                              min: 1,
                              max: Math.ceil(entries / perPage),
                            },
                          }}
                          defaultValue={pageNo}
                          onChange={(e) => setPageNo(e.target.value)}
                        />
                      </Grid>
                      <Grid item>
                        <Typography>
                          of {Math.ceil(entries / perPage)}{" "}
                          {entries / perPage > 1 ? "pages" : "page"}
                        </Typography>
                      </Grid>
                    </div>
                  )}
                </Grid>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AuditLog;
