import { useState } from "react";
import { Checkbox, Collapse, FormControlLabel } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import PropTypes from "prop-types";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdRadioButtonUnchecked } from "react-icons/md";

import { AppendageUseStyles } from "./AppendageStyle";
import { APP_DESIGN_MODES } from "../../utils/constants";
import Header from "../../../EditorLayout/Pages/UIEditor/components/actualObjects/Header";
import {
  defaultStyles,
  getDefaultValues,
} from "../../../EditorLayout/Pages/UIEditor/utils/defaultScreenStyles";
import { convertValidUrlToClickableLink } from "../../utils/dynamicContentReplace";
import { mapValues } from "lodash";

const Appendage = ({
  app,
  taskName,
  history,
  onSubmit,
  onChange,
  decisions,
  taskRunning,
  userInputs,
  error,
  detachMode,
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isTableOpen, setIsTableOpen] = useState(true);
  const [comment, setComment] = useState("");
  const classes = AppendageUseStyles(makeStyles);
  const {
    mappedValues,
    tableProp: { tableRows, tableHead, tableAggregates },
  } = userInputs;

  const handleChange = ({ value }) => {
    setSelectedValue(value?._id);
    onChange({ value: value.label, name: "decision" });
    onChange({ value: value?.nextTask, name: "nextTask" });
  };

  const onTextAreaChange = ({ target: { value, name } }) => {
    setComment(value);
    onChange({ value, name });
  };

  const reconstructAggregateValues = (input, colsCount) => {
    const rowsCount = input.length;
    const newAggrTable = new Array(rowsCount).fill(null);
    newAggrTable.forEach((row, index, thisTable) => {
      thisTable[index] = new Array(colsCount).fill(null);
      thisTable[index][colsCount - 2] = input[index].name;
      thisTable[index][colsCount - 1] = input[index].value;
    });
    return newAggrTable;
  };

  if (error) return <div>Error: {`${error}`}</div>;
  return (
    <>
      <>
        {!detachMode && (
          <Header
            style={defaultStyles().header}
            values={{
              ...getDefaultValues("header"),
              label: app?.name,
              value: `${app?.name || ". . ."} (Approval Overview)`,
              rightIconVisible: false,
              leftIconVisible: false,
            }}
            appDesignMode={APP_DESIGN_MODES.LIVE}
          />
        )}
        <div className="app-page-root">
          {!!Object.keys(mappedValues)?.length || !!tableRows?.length ? (
            <div className={classes.info}>
              <div className={classes.tableContainer}>
                {Object.keys(mappedValues)?.map((valKey, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        border: "1px solid darkgray",
                      }}
                    >
                      <div className="headerArea">
                        {valKey !== "Initiator" && (
                          <div className="titles">
                            <h2> {valKey}</h2>
                          </div>
                        )}

                        {mappedValues?.[valKey]?.map((content, index2) => (
                          <div key={index2} className="table height">
                            <div className="content">
                              {" "}
                              <div className="left">
                                {content?.approval?.metaDataTitle}:
                              </div>
                              <ul className="right" style={{ padding: 0 }}>
                                {convertValidUrlToClickableLink(
                                  content?.approvalValue
                                )?.map((text, index) => (
                                  <li style={{ listStyle: "none" }} key={index}>
                                    {text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {!!tableRows.length && (
                  <div className="tableBox">
                    <div className="tableWrapper">
                      <div
                        style={{
                          fontWeight: 800,
                          textTransform: "capitalize",
                          margin: "14px 2px",
                          cursor: "pointer",
                        }}
                        onClick={() => setIsTableOpen(!isTableOpen)}
                      >
                        {tableHead}
                        <span style={{ float: "right" }}>
                          {isTableOpen ? "[-]" : "[+]"}
                        </span>
                      </div>
                      <Collapse in={isTableOpen}>
                        <>
                          <div className="table">
                            {tableRows
                              ?.filter((row, index) =>
                                Array.isArray(row?.values)
                              )
                              .map((row, index) => (
                                <div
                                  key={index}
                                  className="tableColBox"
                                  style={{ borderLeft: "2px solid gray" }}
                                >
                                  <div className="tableColumn _title">
                                    {row?.name}
                                  </div>
                                  {row?.values.map((value, index) => (
                                    <div key={index} className="tableRow">
                                      {value}
                                    </div>
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="aggregateBox">
                            {reconstructAggregateValues(
                              tableAggregates,
                              tableRows?.filter((row, index) =>
                                Array.isArray(row?.values)
                              ).length
                            ).map((aggregateRow, index) => (
                              <div className="aggregateRow" key={index}>
                                {aggregateRow.map((aggregateCol, index) => (
                                  <div
                                    key={index}
                                    className={`tableRow aggregateCell ${
                                      !aggregateCol ? "_empty" : ""
                                    } ${
                                      index === aggregateRow.length - 2
                                        ? "_title"
                                        : ""
                                    }`}
                                  >
                                    {aggregateCol}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </>
                      </Collapse>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className={classes.noInfo}>No information to display</div>
            </>
          )}
          {history
            .filter((value) => (detachMode ? true : value.commentBy === "User"))
            .map((value) => (
              <div key={value.updatedAt} className={classes.approval}>
                <div className="approver">
                  <div style={{ display: "flex" }}>
                    <div className="left">Approver:</div>
                    <div className="right">
                      <p className="name">
                        {value?.user?.firstName} {value?.user?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="moment">
                    <span className="date">
                      {moment(value.updatedAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}{" "}
                      <span className="time">
                        {`(${moment(value.updatedAt)
                          .startOf("minute")
                          .fromNow()})`}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="decision taken">
                  <div className="left">
                    Approval:<span>*</span>
                  </div>
                  <div className="right">
                    <div
                      className="check"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {/* <Checkbox
                        checked
                        disabled
                        // checkedIcon={<BsFillCheckCircleFill color={"green"} />}
                        icon={<MdRadioButtonUnchecked />}
                        inputProps={{ 'aria-label': 'decorative checkbox' }}
                      />  */}
                      {value.decision}
                    </div>
                  </div>
                </div>
                <div className="comment">
                  <div className="left">Comment:</div>
                  <div className="right">{value.comment}</div>
                </div>
              </div>
            ))}
          {/* {!history.length && (
            <div className={classes.empty}>
              {" "}
              {`${!detachMode ? "No approval history" : ""}`}
            </div>
          )} */}
          {!detachMode && (
            <div className={classes.approval}>
              <div
                style={{
                  backgroundColor: "#eaeced",
                  borderBottom: "solid 0.5px #c6c7c8",
                  padding: "10px 20px",
                  marginBottom: 10,
                  fontWeight: 500,
                }}
              >
                {taskName}
              </div>
              <form onSubmit={onSubmit}>
                <div className="decision">
                  <div className="left">
                    Approval:<span>*</span>
                  </div>

                  <div className="right">
                    {decisions
                      .filter((value) => !!value.nextTask)
                      .map((value, index) => (
                        <div
                          key={value?.nextTask}
                          className="check"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                required={!selectedValue?.trim()}
                                checked={value?._id === selectedValue}
                                onChange={(e) => handleChange({ value })}
                                value={value}
                                checkedIcon={
                                  <BsFillCheckCircleFill color={"green"} />
                                }
                                icon={<MdRadioButtonUnchecked />}
                                inputProps={{
                                  "aria-label": "decorative checkbox",
                                }}
                                name="decision"
                                disabled={taskRunning}
                              />
                            }
                            label={
                              <span style={{ fontSize: 12 }}>
                                {value.label}
                              </span>
                            }
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="comment">
                  <div className="left">Comment:</div>
                  <div className="right">
                    <div>
                      <textarea
                        disabled={taskRunning}
                        value={comment}
                        name="comment"
                        onChange={onTextAreaChange}
                        className="appendage-textarea"
                        rows="5"
                        placeholder="Enter your comments here..."
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={taskRunning || !selectedValue}
                      className="button"
                    >
                      {taskRunning ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </>
    </>
  );
};

Appendage.propTypes = {
  accepted: PropTypes.bool,
  box: PropTypes.array,
  date: PropTypes.string,
  name: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  updated: PropTypes.bool,
};

Appendage.defaultProps = {
  accepted: false,
  date: new Date(),
  updated: false,
  data: [],
  // name: "princewill"
};

export default Appendage;
