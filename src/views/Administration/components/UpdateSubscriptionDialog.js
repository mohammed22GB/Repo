import { useEffect, useState } from "react";
import {
  Typography,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  List,
  Box,
  Badge,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";
import useStyles from "./style";
import DatePicker from "react-datepicker";
import { debounce } from "lodash";
import moment from "moment";
//import { integrationsData } from "./FakeData";

const init = [
  {
    metricName: "Users",
    usedUnits: 0,
    totalUnits: 0,
  },
  {
    metricName: "Apps",
    usedUnits: 0,
    totalUnits: 0,
  },
  {
    metricName: "Tasks",
    usedUnits: 0,
    totalUnits: 0,
    unit: "",
    durationMeasure: "month",
    durationLength: 1,
  },
  {
    metricName: "Data Storage",
    usedUnits: 0,
    totalUnits: 0,
    unit: "GB",
  },
  {
    metricName: "Standard Integrations",
    usedUnits: 0,
    totalUnits: 0,
    unit: "",
  },
  {
    metricName: "Custom API Integrations",
    usedUnits: 0,
    totalUnits: 0,
    unit: "",
  },
  {
    metricName: "Dashboards",
    usedUnits: 0,
    totalUnits: 0,
  },
  {
    metricName: "Single Sign-On",
    usedUnits: 0,
    totalUnits: 0,
    unit: "",
    isBoolean: true,
  },
  {
    metricName: "Data Import",
    usedUnits: 0,
    totalUnits: 0,
    unit: "",
    isBoolean: true,
  },
  {
    metricName: "Audit Log",
    usedUnits: 0,
    totalUnits: 0,
    unit: "",
    isBoolean: true,
  },
  {
    metricName: "PDF Creator",
    usedUnits: 0,
    totalUnits: 0,
    unit: "",
    isBoolean: true,
  },
];

const UpdateSubscriptionDialog = ({
  closeModal,
  subscriptionData,
  saveData,
  holdData,
}) => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(
    moment(subscriptionData.expiryDate).toDate() //Year-month-day && Offset
  );
  const [activeTab, setActiveTab] = useState("subscriptionPlan");
  const [formState, setFormState] = useState(subscriptionData?.metrics || init);
  const [formStateSub, setFormStateSub] = useState({
    tier: subscriptionData.tier,
    amount: subscriptionData.amount,
    invoice: subscriptionData.invoice,
    expiryDate: subscriptionData.expiryDate,
  });
  const timezoneOffset = new Date().getTimezoneOffset();

  const handleChangeTab = (event, newValue) => {
    const updatedData = {
      ...subscriptionData,
      ...formStateSub,
      metrics: formState,
    };
    holdData(updatedData);
    setActiveTab(newValue);
  };

  const _setFormState = (v, index) => {
    const vals = [...formState];
    vals[index] = {
      ...vals[index],
      // metricName: vals[index].metricName,
      totalUnits: Number(v.target.value),
    };

    setFormState(vals);
  };
  const _setFormStateSub = (v) => {
    setFormStateSub({
      ...formStateSub,
      [v.target.name]: v.target.value,
    });
  };

  const _saveData = () => {
    saveData({ ...formStateSub, metrics: formState });
  };

  const handleDateInputChange = (data) => {
    if (data === null) {
      setStartDate(new Date());
    }

    if (data?.type === "change") {
      const parseDate = new Date(Date.parse(data?.target?.value));
      if (parseDate !== "Invalid Date") {
        if (!isNaN(parseDate.getTime())) {
          const saveDate = debounce((dateVal) => {
            setStartDate(dateVal);
            _setFormStateSub({
              target: {
                name: "expiryDate",
                value: moment(dateVal).format("YYYY-MM-DD"),
              },
            });
          }, 300);
          saveDate(parseDate);
        } else {
          setStartDate(new Date());
        }
      }
    } else {
      if (data instanceof Date) {
        setStartDate(data);
        //sel.name = data;
        //saveSelection(sel);
        console.log(data, "Date Data");
        _setFormStateSub({
          target: {
            name: "expiryDate",
            value: moment(data).format("YYYY-MM-DD"),
          },
        });
      }
    }
    if (isNaN(data) && isNaN(Date.parse(data))) {
      setStartDate(new Date());
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
      <div className={classes.modal1}>
        <div>
          <div className="modalHead _tabbed" style={{ paddingBottom: 0 }}>
            <Box
              sx={{ width: "100%" }}
              className={classes.tabsWrapper}
              style={{ marginBottom: -1 }}
            >
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                aria-label="Apps tab wrapper"
              >
                <Tab
                  value="subscriptionPlan"
                  label="Subscription plan"
                  style={{
                    textTransform: "capitalize",
                    borderBottom: "solid 4px #ddd",
                  }}
                  className={classes.tabsBorder}
                />
                <Tab
                  value="services"
                  label="Services"
                  style={{
                    textTransform: "capitalize",
                    borderBottom: "solid 4px #ddd",
                  }}
                  className={classes.tabsBorder}
                />
              </Tabs>
            </Box>
            <IconButton
              aria-label="cancel"
              color="inherit"
              onClick={closeModal}
            >
              <Cancel fontSize="small" />
            </IconButton>
          </div>

          <div className={classes.sideDialogMain}>
            {activeTab === "subscriptionPlan" && (
              <div>
                <Typography
                  className={classes.formLabels}
                  gutterBottom
                  style={{ paddingTop: 0 }}
                >
                  Plan
                </Typography>
                <Select
                  size="small"
                  name="tier"
                  onChange={_setFormStateSub}
                  fullWidth
                  defaultValue={formStateSub?.tier || ""}
                  placeholder={`Select plan`}
                  variant="outlined"
                  classes={{
                    root: classes.selectPadding,
                  }}
                >
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="premier">Premier</MenuItem>
                  <MenuItem value="platinum">Platinum</MenuItem>
                </Select>

                <Typography className={classes.formLabels} gutterBottom>
                  Price
                </Typography>
                <TextField
                  className={classes.FormTextField}
                  size="small"
                  name="amount"
                  onChange={_setFormStateSub}
                  fullWidth
                  defaultValue={formStateSub?.amount || ""}
                  placeholder={`Enter amount here`}
                  type="text"
                  inputMode="text"
                  variant="outlined"
                  InputProps={{
                    className: classes.inputColor,
                  }}
                />

                <Typography className={classes.formLabels} gutterBottom>
                  Invoice no.
                </Typography>
                <TextField
                  className={classes.FormTextField}
                  size="small"
                  name="invoice"
                  onChange={_setFormStateSub}
                  fullWidth
                  defaultValue={formStateSub?.invoice || ""}
                  placeholder={`Enter invoice no. here`}
                  type="text"
                  inputMode="text"
                  variant="outlined"
                  InputProps={{
                    className: classes.inputColor,
                  }}
                />

                <Typography className={classes.formLabels} gutterBottom>
                  Expiry date
                </Typography>
                {/* <TextField
                  className={classes.FormTextField}
                  size="small"
                  name="expiryDate"
                  onChange={_setFormStateSub}
                  fullWidth
                  defaultValue={formStateSub?.expiryDate || ""}
                  placeholder={`Enter invoice no. here`}
                  type="text"
                  inputMode="text"
                  variant="outlined"
                  InputProps={{
                    className: classes.inputColor,
                  }}
                /> */}
                <DatePicker
                  //closeOnScroll={true}
                  className={"dateTimeInput"}
                  wrapperClassName={"date-timePicker no-padding-left"}
                  selected={startDate}
                  name={"startDate"}
                  onChange={(date) => handleDateInputChange(date)}
                  onChangeRaw={(event) => handleDateInputChange(event)}
                  placeholderText="Select an expiry date"
                  showYearDropdown
                  minDate={new Date()}
                  //scrollableYearDropdown
                  showPopperArrow={false}
                  dropdownMode="scroll"
                  popperClassName={"dateTimePopper2"}
                  dateFormat={["d/M/yyyy", "ddMMyyyy", "dd-MM-yyyy"]}
                />
              </div>
            )}

            {activeTab === "services" && (
              <div>
                {subscriptionData?.metrics?.map((item, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", gap: 10, marginBottom: 15 }}
                  >
                    <Typography
                      className={[classes.formLabels, classes.rowLabel]}
                      gutterBottom
                    >
                      {item.metricName}
                    </Typography>
                    {!!item.isBoolean ? (
                      <Select
                        size="small"
                        name={item.metricName}
                        onChange={(v) => _setFormState(v, index)}
                        fullWidth
                        defaultValue={item.totalUnits || ""}
                        placeholder={`Enter name here`}
                        variant="outlined"
                        classes={{
                          root: classes.selectPadding,
                        }}
                        style={{ flex: 1 }}
                      >
                        <MenuItem value="1">On</MenuItem>
                        <MenuItem value="0">Off</MenuItem>
                      </Select>
                    ) : (
                      <TextField
                        className={classes.FormTextField}
                        size="small"
                        name={item.metricName}
                        onChange={(v) => _setFormState(v, index)}
                        fullWidth
                        defaultValue={item.totalUnits || ""}
                        placeholder={`Enter value here${
                          !!item.units ? ` in ${item.units}` : ``
                        }`}
                        type="number"
                        inputMode="number"
                        variant="outlined"
                        InputProps={{
                          className: classes.inputColor,
                        }}
                        style={{ flex: 1 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={classes.modalBase}>
            <FormControl>
              <Button
                variant="outlined"
                // color="primary"
                classes={{
                  // root: classes.customButton,
                  label: classes.customButtonLabel,
                }}
                onClick={() =>
                  activeTab === "subscriptionPlan"
                    ? closeModal()
                    : handleChangeTab(null, "subscriptionPlan")
                }
              >
                {activeTab === "subscriptionPlan" ? "Cancel" : "Back"}
              </Button>
            </FormControl>
            <FormControl size="small" style={{ marginLeft: 10 }}>
              <Button
                variant="contained"
                color="primary"
                classes={{
                  root: classes.customButton,
                  label: classes.customButtonLabel,
                }}
                onClick={() =>
                  activeTab === "subscriptionPlan"
                    ? handleChangeTab(null, "services")
                    : _saveData()
                }
              >
                {activeTab === "subscriptionPlan" ? "Next" : "Save"}
              </Button>
            </FormControl>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateSubscriptionDialog;
