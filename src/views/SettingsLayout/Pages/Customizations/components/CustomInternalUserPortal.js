import useStyles from "./style";
import Divider from "@material-ui/core/Divider";
import Accordion from "@material-ui/core/Accordion";
import { Typography, Button } from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ColorPicker from "../../../../common/components/ColorPicker";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import CustomToggleSwitch from "./CustomToggleSwitch";
import { useEffect, useState } from "react";
import CustomInternalDetails from "./CustomInternalDetails";
import CustomizationModal from "./CustomizationModal";
import { v4 } from "uuid";
import CustomQuickAccessApp from "./CustomQuickAccessApp";
import {
  DEFAULT,
  defaultBrandColor,
  DetailsMode,
  hexToRgba,
  ModalMode,
} from "../utils/customizationutils";

const CustomInternalUserPortal = ({
  handleUpdate,
  theme,
  internalUserPortal,
  quickAccessApps,
  menuItems,
}) => {
  const classes = useStyles();

  const [isEnabled, setIsEnabled] = useState(false);
  const [internalOrgTheme, setInternalOrgTheme] = useState(DEFAULT.COLOR);

  const [personalDetails, setPersonalDetails] = useState([]);
  const [organizationDetails, setOrganizationDetails] = useState([]);

  const [menuSettingItems, setMenuSettingItems] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("");

  const [hideMenuItem, setHideMenuItem] = useState(false);

  useEffect(() => {
    setIsEnabled(internalUserPortal?.isEnabled);
    setInternalOrgTheme(
      internalUserPortal?.theme?.primaryColor ?? DEFAULT.COLOR
    );
    setPersonalDetails(internalUserPortal?.personalDetails);
    setOrganizationDetails(internalUserPortal?.organizationDetails);

    setMenuSettingItems(menuItems);
  }, [internalUserPortal, theme, menuItems]);

  const handleClickOpenModal = (mode) => {
    setModalMode(mode);

    setOpenModal(true);
  };

  const handleClickCloseModal = () => {
    setOpenModal(false);
  };

  const handleInternalPageUpdate = (data) => {
    handleUpdate({ internalPage: data });
  };

  const updatePersonalAndOrganizationalDetails = (
    detailsMode,
    id,
    contentUpdatedData
  ) => {
    const detailsMapping = {
      personalDetails,
      organizationDetails,
    };

    const updatedData = [...detailsMapping[detailsMode]];

    const editIndex = updatedData.findIndex((item) => item?._id === id);

    if (editIndex !== -1) {
      // Update the specific field dynamically
      updatedData[editIndex] = {
        ...contentUpdatedData,
      };

      handleInternalPageUpdate({
        [detailsMode]: updatedData,
      });
    }
  };

  const handleQuickAccessAndMenuSettings = (mode, id, contentUpdatedData) => {
    if (mode === ModalMode.MenuSettings) {
      const addedMenuItems = [...menuSettingItems, contentUpdatedData];

      handleUpdate({ menuItems: addedMenuItems });
    } else if (mode === DetailsMode.MenuItemDetails) {
      const updatedMenuItems = menuSettingItems.map((item) => {
        if (item?._id === id) {
          return {
            ...contentUpdatedData,
          };
        }

        return item;
      });

      handleUpdate({ menuItems: updatedMenuItems });
    } else if (mode === ModalMode.QuickAccess) {
      handleUpdate({ quickAccessApps: contentUpdatedData });
    }

    handleClickCloseModal();
  };

  const handleMenuItemDelete = (mode, id) => {
    if (mode === DetailsMode.MenuItemDetails) {
      const updateItem = menuSettingItems.filter((item) => item?._id !== id);

      handleUpdate({ menuItems: updateItem });
    }
  };

  return (
    <>
      <Accordion
        style={{ borderRadius: "10px" }}
        data-testid="customise-internal-userportal-appearance"
      >
        <AccordionSummary
          expandIcon={
            <ArrowDropDownRoundedIcon fontSize="large" htmlColor="#000000" />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: 0,
            }}
          >
            <Typography className={classes.heading}>
              Internal User Portal
            </Typography>
            <FormControlLabel
              aria-label="Acknowledge"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onFocus={(event) => event.stopPropagation()}
              control={
                <CustomToggleSwitch
                  checked={!!isEnabled}
                  onChange={() => {
                    setIsEnabled(!isEnabled);
                    handleInternalPageUpdate({ isEnabled: !isEnabled });
                  }}
                  name="internalUserPortalSwitch"
                />
              }
            />
            <Typography
              style={{
                backgroundColor: "#2457C129",
                color: "#2457C1",
                borderRadius: "30px",
                padding: "0 10px",
                fontWeight: 500,
                fontSize: "9px",
              }}
            >
              {isEnabled ? "Enable" : "Disable"}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <Typography className={classes.subHeading}>
            Customise the company internal user portal
          </Typography>
          <Divider />
          {/* internal page */}
          <div>
            <div>
              <Typography className={classes.internalMaintext} gutterBottom>
                Add portal colour theme
              </Typography>
              <Typography className={classes.subText} gutterBottom>
                Select and edit what colour theme displays on the user portal
              </Typography>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {defaultBrandColor.map((item, index) => {
                    return (
                      <ColorPicker
                        key={index}
                        color={item.color}
                        identity={`${item?.color}-${index}-customise-internalPage-color`}
                        borderRadius={18}
                        showPopOver={false}
                        border={"none"}
                        showSelectedColorCode={false}
                        colorCallback={(e) => {
                          setInternalOrgTheme(e);
                          handleInternalPageUpdate({
                            theme: {
                              usePlugDefault: false,
                              primaryColor: e,
                            },
                          });
                        }}
                        style={{
                          width: "26px",
                          height: "26px",
                        }}
                      />
                    );
                  })}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <Typography className={classes.subTextOff}>
                    Customise colour:
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid #D2DEFF",
                        backgroundColor: "#F9FAFE",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "15px",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        className={classes.subTextOff}
                        style={{
                          textTransform: "uppercase",
                          color: "#464D72",
                        }}
                      >
                        {internalOrgTheme}
                      </Typography>
                    </div>
                    <div
                      style={{
                        backgroundColor: hexToRgba(
                          internalOrgTheme ?? DEFAULT.COLOR
                        ),
                        padding: "5px",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "50%",
                      }}
                    >
                      <ColorPicker
                        key={v4()}
                        color={internalOrgTheme}
                        identity="customColor-InternalUserPortal"
                        showSelectedColorCode={false}
                        borderRadius={18}
                        border={"none"}
                        colorCallback={(e) => {
                          setInternalOrgTheme(e);
                          handleInternalPageUpdate({
                            theme: {
                              usePlugDefault: false,
                              primaryColor: e,
                            },
                          });
                        }}
                        style={{
                          width: "26px",
                          height: "26px",
                        }}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        setInternalOrgTheme(theme?.primaryColor);
                        handleInternalPageUpdate({
                          theme: {
                            usePlugDefault: true,
                            primaryColor: theme?.primaryColor,
                          },
                        });
                      }}
                      variant="contained"
                      style={{
                        borderRadius: "5px",
                        textTransform: "none",
                        fontSize: "14px",
                        padding: "5px 25px",
                        backgroundColor: "#2457C1",
                        color: "#FFFFFF",
                      }}
                      // className={classes.saveButton}
                      disabled={false}
                      disableElevation
                    >
                      Use default
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Personal organisation details */}
          <div>
            <div>
              <Typography className={classes.internalMaintext} gutterBottom>
                Personal and Organizational Details
              </Typography>
              <Typography className={classes.subText} gutterBottom>
                Select and edit what organisational details displays
              </Typography>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
                gap: "100px",
                width: "100%",
              }}
            >
              <div style={{ width: "50%" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    paddingBottom: "10px",
                  }}
                >
                  <div>
                    <Typography className={classes.offSubText}>
                      Personal
                    </Typography>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#B7B7B7",
                      height: "1.5px",
                      width: "100%",
                      padding: "0.3px",
                    }}
                  ></div>
                </div>

                {/* personal settings */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {personalDetails?.map((personalDetail, index) => (
                    <div key={index} style={{ width: "100%" }}>
                      <CustomInternalDetails
                        detailsMode={DetailsMode.PersonalDetails}
                        details={personalDetail}
                        onModalSave={updatePersonalAndOrganizationalDetails}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* organisational settings */}
              <div style={{ width: "50%" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    paddingBottom: "10px",
                  }}
                >
                  <div>
                    <Typography className={classes.offSubText}>
                      Organisational
                    </Typography>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#B7B7B7",
                      height: "1.5px",
                      width: "100%",
                      padding: "0.3px",
                    }}
                  ></div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {organizationDetails?.map((organizationDetail, index) => (
                    <div key={index} style={{ width: "100%" }}>
                      <CustomInternalDetails
                        detailsMode={DetailsMode.OrganizationDetails}
                        details={organizationDetail}
                        onModalSave={updatePersonalAndOrganizationalDetails}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Quick Access */}
          <div>
            <div>
              <Typography className={classes.internalMaintext} gutterBottom>
                Quick Access
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "20px",
                  gap: "5px",
                }}
              >
                <Typography className={classes.subText}>
                  {!quickAccessApps?.length
                    ? "Select top 5 apps to show in the quick access panel on users' dashboard"
                    : "Select all default quick access apps (must be 5 in numbers)"}
                </Typography>

                <Typography
                  className={classes.subText}
                  style={{
                    color: "#2457C1",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleClickOpenModal(ModalMode.QuickAccess);
                  }}
                >
                  {!quickAccessApps?.length
                    ? "Select apps"
                    : "Adjust selection"}
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {!!quickAccessApps?.length &&
                  quickAccessApps?.map((app, index) => (
                    <CustomQuickAccessApp
                      index={index}
                      app={app}
                      apps={quickAccessApps}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* <Divider /> */}

          {/* menu settings */}
          {!!hideMenuItem && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <Typography className={classes.internalMaintext} gutterBottom>
                  Menu Settings
                </Typography>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleClickOpenModal(ModalMode.MenuSettings);
                  }}
                >
                  <AddRoundedIcon fontSize="large" htmlColor="#535353" />
                </div>
              </div>

              <Typography className={classes.subText} gutterBottom>
                Add more features needed by your organisation to the menu bar
              </Typography>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  justifyContent: "space-between",
                  columnGap: "100px",
                  rowGap: "10px",
                }}
              >
                {menuSettingItems?.map((menuItem, index) => (
                  <div key={index} style={{ width: "100%" }}>
                    <CustomInternalDetails
                      detailsMode={DetailsMode.MenuItemDetails}
                      details={menuItem}
                      onModalSave={handleQuickAccessAndMenuSettings}
                      onDelete={handleMenuItemDelete}
                    />
                  </div>
                ))}

                <div
                  style={{
                    backgroundColor: "rgba(36, 87, 193, 0.08)",
                    border: "1px dashed #2457C1",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleClickOpenModal(ModalMode.MenuSettings);
                  }}
                >
                  <AddRoundedIcon fontSize="large" htmlColor="#2457C1" />
                </div>
              </div>
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      {!!openModal && (
        <CustomizationModal
          modalMode={modalMode}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          menuSettingItems={menuSettingItems}
          onModalSave={handleQuickAccessAndMenuSettings}
        />
      )}
    </>
  );
};

export default CustomInternalUserPortal;
