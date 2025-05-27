import { useState, useEffect, useRef, useCallback } from "react";
import { Cancel } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import ArrowRight from "@material-ui/icons/ArrowRight";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { debounce } from "lodash";
import { ClickAwayListener } from "@material-ui/core";
import { MenuItem, MenuList, Paper } from "@mui/material";
import moment from "moment";

import {
  getUsersAPI,
  searchUsersAPI,
} from "../../../../../../../../SettingsLayout/Pages/UserManagement/utils/usersAPIs";
import {
  getUserGroupsAPI,
  searchUserGroupsAPI,
} from "../../../../../../../../SettingsLayout/Pages/UserGroups/utils/usergroupsAPIs";
import useCustomQuery from "../../../../../../../../common/utils/CustomQuery";
import Divider from "../../../../../../../../common/components/Divider/Divider";
import { useInfiniteQuery } from "react-query";

const SelectOnSteroids = ({
  name = "",
  mode = "div", //  "div" | "menu"
  disabled,
  readOnly,
  anchorIcon,
  style,
  source = "content",
  variables,
  onChange,
  value,
  trackChange = false,
  hideVariableSelect = false, //  deprecated and replaced with "contents"
  variablesAndCustomOnly = false, //  deprecated and replaced with "contents"
  variablesOnly = false, //  deprecated and replaced with "contents"
  type = "email",
  multiple = true,
  placeholderText = "",
  contents = ["variables", "users", "userGroups", "custom"],
}) => {
  const useStyles = makeStyles((theme) => ({
    select: {
      // margin: 10,
      border: "solid 1px #bbb",
      ...(anchorIcon ? { paddingRight: 25 } : {}),
      paddingBottom: 1,
      position: "relative",
      width: "100%",
      // minHeight: 35.25,
      minHeight: 36.5,
      backgroundColor: "#FFFFFF",
      boxSizing: "border-box",
      borderRadius: 5,
      "&:hover": {
        border: disabled ? "solid 1px #ccc" : "solid 1px #1a2256",
        // minHeight: 34.25,
        // margin: 9,
      },
      // zIndex: 2000,
    },
    selectSelectedSearch: {
      display: "flex",
      width: "100%",
      minWidth: 60,
    },
    selectSelected: {
      alignItems: "center",
      padding: "0px 5px 0px 10px",
      marginLeft: 2,
      marginTop: 2,
      backgroundColor: multiple ? "#e8e8e8" : "transparent",
      fontSize: 12,
      fontWeight: "normal",
      borderRadius: 5,
      userSelect: "none",
      opacity: disabled ? 0.5 : 1,
      height: 30,
      // lineHeight: 1,
      // display: "flex",
      lineHeight: "30px",
      whiteSpace: "nowrap",
      minWidth: 50,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    searchInput: {
      flex: 1,
      minWidth: 30,
      border: "none",
      outline: "none",
      marginTop: 2,
      marginLeft: 5,
      paddingLeft: 5,
      height: 30,
      background: "transparent",
      "&::placeholder": {
        color: disabled ? "#d8d8d8" : "#aaa",
      },
    },
    selectResults: {
      position: "absolute",
      bottom: -253,
      boxShadow: "0 4px 8px #ccc",
      borderRadius: 5,
      width: "100%",
      minWidth: 200,
      left: 0,
      height: 250,
      overflow: "auto",
      backgroundColor: "#fff",
      zIndex: 50000,
      userSelect: "none",
    },
    selectResult: {
      fontSize: 11,
      padding: "5px 10px",
      overflowX: "auto",
      display: "block !important",
      "&:hover": {
        backgroundColor: "#ddd",
      },
    },
    customSelection: {
      fontSize: 12,
      padding: "10px 5px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#dcf8e6 !important",
      },
    },
    completeString: {
      fontSize: 12,
      padding: 10,
      fontStyle: "italic",
      color: "#999",
    },
    sectionLabel: {
      padding: 10,
      backgroundColor: "#eee !important",
      textTransform: "uppercase !important",
      fontSize: "10px !important",
      fontWeight: "bold !important",
      overflow: "hidden !important",
      textOverflow: "ellipsis !important",
      whiteSpace: "nowrap !important",
      width: "100% !important",
      display: "inline-block !important",
      textAlign: "center !important",
      boxSizing: "border-box",
      "&:after": {
        content: " ",
        width: 10,
        height: 36,
        border: "solid 5px #ffffff",
        borderLeftColor: "#2457c1",
        position: "absolute",
        left: -10,
      },
    },
    noResult: {
      margin: 10,
      fontSize: 12,
      fontStyle: "italic",
      color: "#999",
    },
  }));

  const { workflowTasks: allTasks, workflowCanvas } = useSelector(
    ({ workflows }) => workflows
  );

  const hasVariables =
    (contents.includes("variables") ||
      variablesAndCustomOnly ||
      variablesOnly) &&
    !hideVariableSelect;
  const hasCustom = contents.includes("custom") || variablesAndCustomOnly;
  const hasUsers = contents.includes("users");
  const hasUserGroups = contents.includes("userGroups");

  const contentTypesTextArray = [];
  if (hasVariables) {
    contentTypesTextArray.push("variables");
  }
  if (hasUsers) {
    contentTypesTextArray.push("users");
  }
  if (hasUserGroups) {
    contentTypesTextArray.push("user groups");
  }

  const contentTypesText = contentTypesTextArray.join(" ,");

  placeholderText = placeholderText || `Type or select ${contentTypesText}`;

  // if (hasUsers) getFetchUsers(true);
  // if (hasUserGroups) getFetchUserGroups(true);

  const refInput = useRef();
  const observerElem = useRef(null);
  const classes = useStyles();
  const initialResults = [];
  const [selected, setSelected] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [placeholderD, setPlaceholderD] = useState("");
  const [resultsV, setResultsV] = useState([]);
  const [resultsVT, setResultsVT] = useState([]);
  const [resultsU, setResultsU] = useState([]);
  const [resultsUT, setResultsUT] = useState([]);
  const [resultsG, setResultsG] = useState([]);
  const [resultsGT, setResultsGT] = useState([]);
  const [onFocus, setOnFocus] = useState(false);
  const [onDateOpen, setOnDateOpen] = useState(null);
  const [startDate, setStartDate] = useState(null);
  // const [fetchUsers, getFetchUsers] = useState(false);
  // const [fetchUserGroups, getFetchUserGroups] = useState(false);
  const [optionsUsers, setOptionsUsers] = useState(null);
  const [optionsUserGroups, setOptionsUserGroups] = useState(null);

  /* Setting the placeholderText variable to the value of the placeholderText variable or the value of
the variablesAndCustomOnly variable or the value of the variablesOnly variable or the value of the
string "Type in user, user groups or emails". */

  /* Setting the selected value to the value passed in. */
  useEffect(() => {
    if (value?.length === 1 && !value[0]) {
      value.pop();
    }
    const objValueHolder = !value
      ? []
      : !Array.isArray(value)
      ? [value]
      : value;
    setSelected(objValueHolder || []);

    return () => {
      setSelected(() => []);
    };
  }, [value]);

  /* Filtering the variables based on the type and then mapping the variables to a new list. */
  useEffect(() => {
    const vars = [...(variables || [])];
    const newList = vars
      .filter(
        (v) =>
          v?.info?.dataType?.includes(type) ||
          isUserVariableType(v) ||
          type === "text"
      )
      .map((v) => {
        return {
          id: v.id,
          name: v.info?.name,
          dataType: v.info?.dataType,
          [`${source}Type`]: "Variable",
          info: !v.info?.group
            ? null
            : v.info?.group === "Initiator" &&
              !allTasks?.[v?.info?.parent]?.name
            ? "App Initiator"
            : getVariableSubText(v),
        };
      });

    setResultsV(newList);
    setResultsVT(newList);
  }, [variables]);

  useEffect(() => {
    if (onFocus) {
      const optionsUsers_ = {
        query: {
          selection: ["id", "firstName", "lastName", "email"],
        },
      };

      const optionsUserGroups_ = {
        query: {
          selection: ["id", "name"],
        },
      };

      setOptionsUsers(optionsUsers_);
      setOptionsUserGroups(optionsUserGroups_);
    }
  }, [onFocus]);

  const isUserVariableType = (variable) => {
    return (
      ["text", "email", "name", "user"].includes(type) &&
      variable?.info?.dataType?.includes("user")
    );
  };

  const getVariableSubText = (variable) => {
    const varSourceId = variable?.info?.parent;
    const varSource =
      allTasks?.[varSourceId] ||
      workflowCanvas.find((c) => c.id === varSourceId);
    const text = `${varSource?.name || "..."} (${varSource?.type})`;
    return text;
  };

  /**
  * "If the response data is not null, then map the response data to a new array of objects, and set
  * the state of the results to the new array of objects."
  * 
  * The function is called in the following way:
  * @param res - {
  
  */

  /**
   * Processes a list of user data and formats it into a standardized structure.
   *
   * @param {Array} data - The array of user objects to process. Each object should contain user details such as `id`, `firstName`, and `lastName`.
   * @returns {Array} - A new array of formatted user objects. Each object includes `id`, `name`, `sourceType`, and additional user details in the `extra` field.
   */
  const usersList = (data) => {
    if (!data?.length) {
      return [];
    }
    const newList = data.map((v) => {
      const nm = [];
      !!v.firstName && nm.push(v.firstName);
      !!v.lastName && nm.push(v.lastName);
      const name = nm.join(" ");
      return {
        id: v.id,
        name,
        [`${source}Type`]: "User",
        extra: {
          email: v.email,
          employeeId: v.employeeId,
          mobile: v.mobile,
        },
      };
    });
    setResultsU(newList);
    return newList;
  };

  const onLoadItemsSuccessU = (res) => {
    if (!res?.data?.data) {
      return;
    }
    const newVals = res.data.data;
    const newList = usersList(newVals);
  };

  /**
   * If the response data is not null, then map the response data to a new array and set the results to
   * the new array.
   * @param res - {
   * @returns {
   *     "data": {
   *       "data": [
   *         {
   *           "id": "1",
   *           "name": "Group 1",
   *           "userGroupType": "UserGroup"
   *         }
   *        ]
   *      }
   *    }
   *  }
   */

  const userGroupsList = (data) => {
    if (!data?.length) {
      return;
    }
    const newList = data.map((v) => {
      return {
        id: v.id,
        name: v.name,
        [`${source}Type`]: "UserGroup",
      };
    });
    setResultsG(newList);
    setResultsGT(newList);
  };
  const onLoadItemsSuccessG = (res) => {
    if (!res?.data?.data) {
      return;
    }

    const newVals = res.data.data;
    const newList = userGroupsList(newVals);
  };

  /* Using the useCustomQuery hook to fetch data from the API. */
  const { isLoadingU, isFetchingU } = useCustomQuery({
    queryKey: ["filteredUsers", optionsUsers],
    apiFunc: getUsersAPI,
    onSuccess: onLoadItemsSuccessU,
    enabled: onFocus && hasUsers,
  });

  // Infinite Query for Users
  const {
    data: usersData,
    fetchNextPage: fetchNextUserPage,
    hasNextPage: hasNextUserPage,
    isFetchingNextPage: isFetchingNextUserPage,
  } = useInfiniteQuery(
    "allUsers",
    ({ pageParam = 1 }) => getUsersAPI({ pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage?._meta.pagination?.next;
        return lastPage?.data?.length !== 0 ? nextPage : undefined;
      },
      enabled: onFocus && hasUsers,
    }
  );

  // Infinite scrolling observer for users
  const handleUserObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target?.isIntersecting && hasNextUserPage) {
        fetchNextUserPage();
      }
    },
    [fetchNextUserPage, hasNextUserPage]
  );

  useEffect(() => {
    const element = observerElem.current;
    const option = { threshold: 0 };
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(handleUserObserver, option);
    observer?.observe(element);
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasNextUserPage, handleUserObserver, observerElem]);

  // Update results when users data changes
  useEffect(() => {
    if (usersData?.pages) {
      const result = usersData.pages
        ?.map((page) => page?.data)
        ?.reduce((prev, curr) => prev.concat(curr), []);
      const newList = usersList(result);
      setResultsUT(newList);
    }
  }, [usersData]);

  /* Using the useCustomQuery hook to make a call to the API and then on success it is calling the
 onLoadItemsSuccessG function. */
  const { isLoadingG, isFetchingG } = useCustomQuery({
    queryKey: ["filteredUserGroups", optionsUserGroups],
    apiFunc: getUserGroupsAPI,
    onSuccess: onLoadItemsSuccessG,
    enabled: onFocus && hasUserGroups,
  });

  /**
   * If the variable "variablesOnly" is true and the variable "variablesAndCustomOnly" is false, then
   * return false. Otherwise, if the variable "type" is equal to "email", then return true if the entry
   * is a valid email address. Otherwise, return true if the entry is not an empty string.
   * @param entry - The value of the input field.
   * @returns the result of the switch statement.
   */
  function validateEntry(entry) {
    if (!hasCustom) {
      return false;
    }

    const validType = type;

    switch (validType) {
      case "email":
        var re = /\S+@\S+\.\S+/;
        return re.test(entry);

      case "number":
        return !isNaN(entry);

      case "datetime":
        return moment(entry).isValid();

      default:
        return entry.length;
      // || entry.length > 1;
    }
  }

  /**
   * It takes a selection, adds it to the selected array, and then calls the onChange function with the
   * selection.
   * @param sel - the selected item
   */
  const saveSelection = (sel) => {
    const prev = multiple ? [...selected] : [];
    prev.push(sel);
    setSelected(prev);
    setSearchString("");

    setResultsVT([...resultsV]);
    setResultsUT([...resultsU]);
    setResultsGT([...resultsG]);

    if (trackChange) {
      sel.selection = "added";
      onChange(sel);
    } else {
      onChange(prev);
    }
  };

  /**
   * It takes the value of the searchString variable and creates a new object with the value as the
   * name and id. It then calls the saveSelection function and passes the new object as an argument.
   */
  const addCustomSelection = () => {
    let value = searchString;
    const sel = {
      id: value,
      name: value,
      [`${source}Type`]: "Custom",
    };

    saveSelection(sel);
  };

  /**
   * If the trackChange variable is true, then set the selection property of the selected item to
   * "removed" and call the onChange function with the selected item as the argument. Otherwise, call
   * the onChange function with the new list of selected items as the argument.
   * @param sel - the selected item
   */
  const removeSelection = (sel) => {
    const newList = [...selected].filter((f) => f.id !== sel.id);
    setSelected(newList);
    if (trackChange) {
      sel.selection = "removed";
      onChange(sel);
    } else {
      onChange(newList);
    }
  };

  /**
   * It takes the value of the input field and filters the results based on the value of the input
   * field.
   * @param e - the event object
   */
  const searchDataRef = useRef(
    debounce(async (eventVal) => {
      if (eventVal.trim() === "") {
        return;
      }
      if (hasUsers) {
        const usersResult = await searchUsersAPI(eventVal);
        //if (!usersResult?.data) return;
        if (usersResult?.data) {
          // Check if usersResult and its data property exist
          const users = usersResult.data || [];
          usersList(users);
        }
      }
      if (hasUserGroups) {
        const userGResult = await searchUserGroupsAPI(eventVal);
        if (userGResult?.data) {
          // Check if userGResult and its data property exist
          const userGroups = userGResult?.data || [];
          userGroupsList(userGroups);
        }
      }
    }, 500)
  );

  const doSearch = (e) => {
    const val = e.target.value;
    setSearchString(val);

    if (val === "") {
      // Reset results if search input is empty
      setResultsVT([...resultsV]);
      setResultsUT([...resultsU]);
      setResultsGT([...resultsG]);
      return;
    }

    // Filter results based on the search input
    const vv = [...resultsV].filter((v) =>
      v?.name?.toLowerCase().includes(val.toLowerCase())
    );
    const uu = [...resultsU].filter((u) =>
      u.name?.toLowerCase().includes(val.toLowerCase())
    );
    const gg = [...resultsG].filter((g) =>
      g.name?.toLowerCase().includes(val.toLowerCase())
    );
    setResultsVT(vv);
    setResultsUT(uu);
    setResultsGT(gg);
    searchDataRef.current(val);
  };

  /**
   * When the user clicks outside of the search bar, the search bar will clear itself after 500
   * milliseconds.
   * @param e - the event object
   */
  const stopSearch = (e) => {
    setTimeout(() => {
      setSearchString("");
      setOnFocus(false);
    }, 500);
  };

  /**
   * When the control is clicked, set the onFocus state to true, and then focus on the input.
   */
  const controlClicked = () => {
    setOnFocus(true);

    setTimeout(() => {
      refInput?.current?.focus && refInput?.current?.focus();
      refInput?.current?.setFocus && refInput?.current?.setFocus(true);
    }, 0);
  };

  const handleOnFocus = () => {
    setOnDateOpen(true);
    setPlaceholderD("Select a date or Enter a variable");
  };
  const handleInputChange = (data) => {
    const sel = {
      id: data,
      //name: data,
      [`${source}Type`]: "Custom",
    };
    if (data === null) {
      setStartDate(new Date());
    }

    if (data?.type === "change") {
      const parseDate = new Date(Date.parse(data?.target?.value));
      if (parseDate !== "Invalid Date") {
        if (!isNaN(parseDate.getTime())) {
          const saveDate = debounce((dateVal) => {
            setStartDate(dateVal);
            sel.name = dateVal;
            saveSelection(sel);
          }, 300);
          saveDate(parseDate);
        } else {
          setStartDate(new Date());
        }
      }
    } else {
      if (data instanceof Date) {
        setStartDate(data);
        sel.name = data;
        saveSelection(sel);
      }
    }
    if (isNaN(data) && isNaN(Date.parse(data))) {
    }
  };
  useEffect(() => {
    if (new Date(Date.parse(value)) !== "Invalid Date") {
      const parseDate = new Date(Date.parse(value));
      handleOnFocus();
      if (!isNaN(parseDate.getTime())) {
        setStartDate(new Date(parseDate));
      }
    }
  }, [value]);

  const DropdownList = ({ children }) =>
    mode === "div" ? (
      <div className={classes.selectResults}>{children}</div>
    ) : (
      <Paper sx={{ maxWidth: "100%" }}>
        <MenuList>{children}</MenuList>
      </Paper>
    );

  const DropdownItem = ({ children, ...props }) =>
    mode === "div" ? (
      <div {...props}>{children}</div>
    ) : (
      <MenuItem {...props}>{children}</MenuItem>
    );

  return (
    <ClickAwayListener onClickAway={() => setOnFocus(false)}>
      <div
        className={classes.select}
        // style={{ ...style, height: onFocus ? "unset" : 36.5 }}
        style={{
          ...style,
          height: onFocus
            ? "unset"
            : mode !== "div" && !multiple
            ? 36.5
            : "unset",
          ...(readOnly
            ? {
                backgroundColor: "#ffffed",
              }
            : {}),
        }}
        title="selectDropDown"
        onClick={!disabled ? () => controlClicked() : () => {}}
        id="select-on-steroid-main-container"
      >
        {anchorIcon && (
          <div style={{ position: "absolute", right: 3, top: 8 }}>
            {anchorIcon}
          </div>
        )}

        <div
          className={classes.selectSelectedSearch}
          id="select-on-steroid-sub-container"
          style={
            multiple
              ? { flexWrap: "wrap" }
              : { width: "100%", flexWrap: "nowrap" }
          }
        >
          {(multiple || (!multiple && !onFocus)) &&
            selected?.map((sel, i) => (
              <div
                key={i}
                id={`select-on-steroid-selected-id-${i}`}
                className={classes.selectSelected}
                style={{
                  fontSize: style?.fontSize,
                  fontWeight: style?.fontWeight,
                  InputtextAlign: style?.InputtextAlign,

                  ...(multiple
                    ? {
                        display: "flex",
                        ...(sel.userType === "User" ||
                        sel.emailTargetType === "User"
                          ? { backgroundColor: "#cfeaff" }
                          : sel.userType === "UserGroup" ||
                            sel.emailTargetType === "UserGroup"
                          ? { backgroundColor: "#e1ddff" }
                          : {}),
                      }
                    : {}),
                  ...(readOnly
                    ? {
                        color: "#560202",
                        opacity: 1,
                        fontWeight: 300,
                      }
                    : {}),
                }}
                title="selectedItem"
              >
                {`${sel?.[Object.keys(sel || {})[2]] === "Custom" ? '"' : ""}${
                  sel?.name || ""
                }${sel?.[Object.keys(sel || {})[2]] === "Custom" ? '"' : ""}`}
                {multiple && (
                  <Cancel
                    style={{
                      fontSize: 14,
                      marginLeft: 5,
                      cursor: "pointer",
                      color: "#666",
                    }}
                    onClick={() => !!sel && removeSelection(sel)}
                    title="cancelSelected"
                  />
                )}
              </div>
            ))}
          {onFocus && type !== "dateType" && (
            <input
              name={name || `selectOnSteroid-${source}`}
              ref={refInput}
              type="text"
              disabled={disabled}
              className={classes.searchInput}
              onChange={doSearch}
              onFocus={() => setOnFocus(true)}
              onBlur={stopSearch}
              value={searchString}
              placeholder={
                multiple ||
                (!multiple && onFocus) ||
                (!multiple && !selected.length)
                  ? placeholderText
                  : ""
              }
            />
          )}
          {onDateOpen && type === "dateType" && (
            <DatePicker
              dateFormat={[
                "d/M/yyyy h:mm aa",
                "ddMMyyyy h:mm aa",
                "dd-MM-yyyy h:mm aa",
              ]}
              selected={startDate}
              onFocus={() => handleOnFocus()}
              ref={(elem) => (refInput.current = elem)}
              className={"date-timePicker"}
              popperClassName={"dateTimePopper"}
              onChange={(date) => handleInputChange(date)}
              placeholderText={placeholderD}
              onChangeRaw={(event) => handleInputChange(event)}
              showPopperArrow={false}
              onBlur={() => setPlaceholderD("")}
              showYearDropdown
              showTimeSelect
              scrollableYearDropdown
              //showMonthDropdown
            />
          )}
        </div>
        {!!onFocus && type !== "dateType" && (
          <DropdownList>
            {!!searchString && !validateEntry(searchString) && (
              <DropdownItem className={classes.completeString} disabled>
                {hasCustom
                  ? `complete ${type} to add: "${searchString}"`
                  : `${searchString}`}
              </DropdownItem>
            )}
            {!!validateEntry(searchString) && !hideVariableSelect && (
              <DropdownItem
                onClick={addCustomSelection}
                className={classes.customSelection}
              >
                <b>Click</b> {` here to add this ${type}: "${searchString}"`}
              </DropdownItem>
            )}
            {hasVariables && (
              <DropdownItem
                // className={classes.sectionLabel}
                disabled
                className={classes.sectionLabel}
              >
                <Divider>
                  <span
                    style={{
                      padding: "0 10px",
                      color: "#464D72",
                    }}
                  >
                    Variables
                  </span>
                </Divider>
              </DropdownItem>
            )}
            {resultsVT.map((opt, i) => (
              <DropdownItem
                key={i}
                id={`select-on-steroid-result-vt-id-${i}`}
                className={classes.selectResult}
                classes={{
                  root: classes.selectResult,
                }}
                onClick={() => saveSelection(opt)}
              >
                {opt.name}
                {!!opt.info && (
                  <div
                    style={{
                      fontStyle: "italic",
                      fontSize: 9,
                      color: "#0c7b93",
                      lineHeight: 1.2,
                      fontWeight: 300,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ArrowRight fontSize="small" size="small" />
                    {opt.info}
                  </div>
                )}
              </DropdownItem>
            ))}
            {!resultsVT.length && hasVariables && (
              <DropdownItem
                disabled
                style={{
                  padding: 10,
                  fontSize: 12,
                  fontWeight: 200,
                  color: "#444",
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                No variables. Ensure nodes are properly linked.
              </DropdownItem>
            )}
            {hasUsers && (
              <>
                <DropdownItem className={classes.sectionLabel} disabled>
                  <Divider>
                    <span
                      style={{
                        padding: "0 10px",
                        color: "#464D72",
                      }}
                    >
                      Users
                    </span>
                  </Divider>
                </DropdownItem>
                {resultsUT.map((opt, i) => (
                  <DropdownItem
                    key={i}
                    id={`select-on-steroid-result-ut-id-${i}`}
                    title="userItem"
                    data-testid={`line-manager-selector-${i}`}
                    className={classes.selectResult}
                    classes={{
                      root: classes.selectResult,
                    }}
                    onClick={() => saveSelection(opt)}
                  >
                    {opt.name}
                  </DropdownItem>
                ))}
              </>
            )}

            {hasUserGroups && (
              <>
                <DropdownItem className={classes.sectionLabel} disabled>
                  <Divider>
                    <span
                      style={{
                        padding: "0 10px",
                        color: "#464D72",
                      }}
                    >
                      User groups
                    </span>
                  </Divider>
                </DropdownItem>
                {resultsGT.map((opt, i) => (
                  <DropdownItem
                    key={i}
                    id={`select-on-steroid-result-gt-id-${i}`}
                    title="userGroupItem"
                    className={classes.selectResult}
                    data-testid={`user-groups-selector-${i}`}
                    onClick={() => saveSelection(opt)}
                  >
                    {opt.name}
                  </DropdownItem>
                ))}
              </>
            )}

            {/* { !results.length && !validateEntry(searchString) && <div className={classes.noResult}>...no matching results. You can type out email.</div >} */}
          </DropdownList>
        )}

        {/* Infinite scroll loader for users */}
        {!!onFocus && !!hasUsers && (
          <div ref={observerElem} style={{ height: "10px", width: "100%" }}>
            {!!isFetchingNextUserPage && !!hasNextUserPage && "Loading more..."}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default SelectOnSteroids;
