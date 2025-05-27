import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  makeStyles,
  Typography,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  Paper,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { infoToastify } from "../../utils/Toastify";
import CustomDropDown from "../DropDown/CustomDropDown";

const useStyles = makeStyles((theme) => ({
  MainContainer: {
    width: "100%",
    // overflow: "scroll",
    // minHeight: "10em",
  },

  textWrapper: {
    maxWidth: "80%",
    // height: "36.12px",
    marginBottom: "1rem",
    padding: 10,
    margin: 10,
    backgroundColor: "#f5f5f5",
    border: "outset 1px #eee",
    "& > p": {
      fontStyle: "normal",
      fontWeight: 375,
      fontSize: "10px",
      lineHeight: "130%",
      textAlign: "center",
      color: "#424874",
    },

    "& > :last-child": {
      color: "red",
    },
  },

  dropDown: {
    width: "200px",
  },
}));

const VerifyUploadView = ({
  matchedData,
  fieldValue,
  updatedFileData,
  setIsVerifed,
}) => {
  // setting default states
  const classes = useStyles(makeStyles);
  const [values, setValues] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRow] = useState([]);
  const [plugList, setPlugList] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [duplicateValue, setDuplicateValue] = useState("");
  const listRef = useRef();

  /* It's setting the current value of the listRef to the values array. */
  listRef.current = values;

  /* It's getting the file data from the redux store. */
  const {
    upLoadFileReducer: { fileData },
  } = useSelector((state) => state);

  const handleChange = (e, label, idx) => {
    if (e.target.value === "") return;

    if (e.target.value in matchedData.current) {
      return infoToastify(`Duplicate match found`);
    }

    setSelectedValue(() => [...selectedValue, e.target.value]);

    for (const key in matchedData.current) {
      if (key !== e.target.value && matchedData.current[key] === label) {
        delete matchedData.current[key];
        setDuplicateValue(() => key);
      }
    }

    matchedData.current[e.target.value] = label;

    let newFieldValues = values.map((val, i) => {
      if (i === idx) {
        val.id = label;

        if (
          matchedData.current["firstName"] !== undefined &&
          matchedData.current["lastName"] !== undefined &&
          matchedData.current["email"] !== undefined
        ) {
          setIsVerifed(() => false);
        }
      }

      return val;
    });

    fieldValue.current = newFieldValues;
  };

  useEffect(() => {
    let newUserData = [];
    let checkDuplicate = fileData;

    updatedFileData.current = checkDuplicate.length > 0 && checkDuplicate;

    const handleRows = (row, input) => {
      newUserData.push({ label: row, input });
      setRow(() => newUserData);
    };

    const addToState = () => {
      const plugLists = [
        ["", "match headers"],
        ["firstName", "First name *"],
        ["lastName", "Last name *"],
        ["email", "Email *"],
        ["mobile", "Phone"],
        ["employeeId", "Employee ID"],
        ["lineManager", "Line manager ID"],
        ["userGroups", "Group"],
      ];

      /* It's adding a new column to the table. */
      setColumns(() => [
        { label: "Your CSV column header", id: "label" },
        { label: "Match field", id: "input" },
      ]);

      /* It's getting the keys of the first object in the fileData array. */
      let fileDataKeys =
        checkDuplicate.length > 0 && Object.keys(checkDuplicate[0]);

      /* It's adding a new column to the table. */
      fileDataKeys.length > 0 &&
        fileDataKeys.forEach((data) => {
          handleRows(data, "input");
          if (listRef.current.length <= checkDuplicate.length) {
            setValues((prev) => [...prev, { id: "" }]);
          }
        });

      /* It's setting the input lists to the state. */
      setPlugList(() => plugLists);
    };
    addToState();
  }, [fileData, updatedFileData]);

  return (
    <Grid
      container
      className={classes.MainContainer}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Grid className={classes.textWrapper}>
        <Typography variant="h3" component="p">
          Pair the column headers on your CSV file with the map fields on Plug
          on the right side before uploading.
        </Typography>
      </Grid>
      <Grid item>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.length > 0 &&
                    columns.map((column, idx) => (
                      <TableCell key={idx} style={{ width: 200 }}>
                        {column.label}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 &&
                  rows.map((row, idx) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                        {columns.length > 0 &&
                          columns.map((column, indx) => {
                            const value = row[column.id];
                            return column.id !== "input" ? (
                              <TableCell key={idx}>{value}</TableCell>
                            ) : (
                              <CustomDropDown
                                onChange={(e) =>
                                  handleChange(e, row.label, idx)
                                }
                                data={plugList}
                                name={value}
                                key={idx + 1}
                                selectedValue={selectedValue}
                                duplicateValue={duplicateValue}
                              />
                            );
                          })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default VerifyUploadView;
