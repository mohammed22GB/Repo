import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { CircularProgress, Divider } from "@material-ui/core";
import {
  ContentTypes,
  ModalContentTypeOptions,
  documentOptions,
  userDetailsOptions,
  ModalMode,
  DetailsMode,
  DEFAULT,
  NUMBER_OF_SELECTED_APPS,
} from "../utils/customizationutils";
import CustomQuickAccessApp from "./CustomQuickAccessApp";
import { useModalStyles } from "./modalStyles";
import FileUpload from "../../../../EditorLayout/Pages/UIEditor/components/actualObjects/FileUpload";
import { uploadFile } from "../../../../common/helpers/LiveData";
import { APP_DESIGN_MODES } from "../../../../common/utils/constants";
import { getAppsList } from "../../../../common/components/Query/AppsQuery/queryApp";
import CustomSingleAppOption from "./CustomSingleAppOption";
import LoadMoreButton from "./LoadMoreApps";

export default function CustomizationModal({
  id,
  detailsMode,
  modalDetails,
  modalMode,
  open,
  handleClose,
  menuSettingItems,
  onModalSave,
  onDelete,
}) {
  const classes = useModalStyles();
  const [scroll, setScroll] = useState("paper");

  const [title, setTitle] = useState(modalDetails?.title ?? "");
  const [contentType, setContentType] = useState(
    modalDetails?.contentType ?? ""
  );

  const [apps, setApps] = useState({
    content: {
      _id: modalDetails?.content?._id ?? "",
      name: modalDetails?.content?.name ?? "",
      description: modalDetails?.content?.description ?? "",
      slug: modalDetails?.content?.slug ?? "",
    },
  });
  const [appsListDropdown, setAppsListDropdown] = useState([]);
  const [loadingAppsList, setLoadingAppsList] = useState(false);

  const [externalLink, setExternalLink] = useState({
    linkText: modalDetails?.linkText ?? "",
    linkUrl: modalDetails?.linkUrl ?? "",
  });

  const [userDetails, setUserDetails] = useState({
    informationType: modalDetails?.informationType ?? "",
    userInformation: modalDetails?.userInformation ?? "",
  });

  const [document, setDocument] = useState({
    documentType: modalDetails?.documentType ?? "",
    fileType: modalDetails?.fileType ?? "",
    file: modalDetails?.file ?? "",
  });

  // for quick access apps
  const [selectedApps, setSelectedApps] = useState([]);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [fetchingNextPage, setFetchingNextPage] = useState(false);

  useEffect(() => {
    if (
      contentType === ContentTypes.APPS ||
      modalMode === ModalMode.QuickAccess
    ) {
      const getListOfApps = async () => {
        if (!fetchingNextPage) {
          setLoadingAppsList(true);
        }

        const data = await getAppsList(
          {
            queryKey: [
              {
                appSortParams: {
                  updatedAt: "desc",
                },
                selectedCategory: "All",
                page,
                perPage: 10,
              },
            ],
          },
          null
        );

        setAppsListDropdown([...appsListDropdown, ...data?.data?.data]);
        setLoadingAppsList(false);

        setHasNextPage(!!data?.data?._meta?.pagination?.next);
        setFetchingNextPage(false);
      };

      // // Call the async function
      getListOfApps();
    }
  }, [modalMode, contentType, page]);

  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleAppSelectionContent = (appId) => {
    const appContent = appsListDropdown.find((item) => item?._id === appId);

    setApps({
      content: {
        _id: appContent?._id,
        name: appContent?.name,
        description: appContent?.description,
        slug: appContent?.slug,
      },
    });
  };

  const handleMultipleAppSelection = (app) => {
    // Check if this app is already in the selection
    const alreadySelected = selectedApps.some((item) => item._id === app._id);

    if (alreadySelected) {
      // If it's already selected, remove it from the array
      const updatedSelection = selectedApps.filter(
        (item) => item._id !== app._id
      );

      setSelectedApps(updatedSelection);
    } else {
      // If the app is not selected, check if we already have 5
      if (selectedApps.length < NUMBER_OF_SELECTED_APPS) {
        const addedApps = [...selectedApps, app]?.map((item) => {
          return {
            _id: item?._id,
            name: item?.name,
            description: item?.description,
            slug: item?.slug,
          };
        });

        setSelectedApps(addedApps);
      }
    }
  };

  const getFieldsForContentType = (contentType) => {
    switch (contentType) {
      case ContentTypes.APPS:
        return {
          ...apps,
        };
      case ContentTypes.EXTERNAL_LINK:
        return {
          ...externalLink,
        };
      case ContentTypes.DOCUMENTS:
        return {
          ...document,
        };
      case ContentTypes.USER_DETAILS:
        return {
          ...userDetails,
        };
      default:
        return {};
    }
  };

  const disableSaveButtonBasedOnModalMode = (modalmode, contentType) => {
    if (
      modalmode === ModalMode.PersonalAndOrganizationDetails ||
      modalmode === ModalMode.MenuSettings
    ) {
      if (
        !title ||
        !contentType ||
        contentType === "" ||
        contentType === DEFAULT.NONE
      ) {
        return true;
      }

      if (
        contentType === ContentTypes.USER_DETAILS &&
        (!userDetails.informationType || !userDetails.userInformation)
      ) {
        return true;
      }

      if (
        contentType === ContentTypes.DOCUMENTS &&
        (!document.documentType || !document.fileType || !document.file)
      ) {
        return true;
      }

      if (
        contentType === ContentTypes.EXTERNAL_LINK &&
        (!externalLink.linkText || !externalLink.linkUrl)
      ) {
        return true;
      }

      if (contentType === ContentTypes.APPS && !apps.content?._id) {
        return true;
      }
    } else if (modalmode === ModalMode.QuickAccess) {
      if (!selectedApps.length) {
        return true;
      }
    }

    return false;
  };

  const handleModalSave = (modalmode, detailsmode, id, title, contenttype) => {
    if (modalmode === ModalMode.PersonalAndOrganizationDetails) {
      const content = getFieldsForContentType(contenttype);

      const updatedData = {
        title,
        contentType: contenttype,
        ...(content && content),
      };

      onModalSave(detailsmode, id, updatedData);
      handleClose();
    } else if (modalmode === ModalMode.MenuSettings) {
      // based on the menuSettingsItems know whether to edit or add
      const mode = menuSettingItems?.length >= 0 ? modalmode : detailsmode;

      const menuItemId = !!menuSettingItems?.length
        ? menuSettingItems?.length
        : id;

      const content = getFieldsForContentType(contenttype);

      const updatedData = {
        title,
        contentType: contenttype,
        ...(content && content),
      };

      onModalSave(mode, menuItemId, updatedData);
      if (mode === DetailsMode.MenuItemDetails) {
        handleClose();
      }
    } else if (modalmode === ModalMode.QuickAccess) {
      onModalSave(modalmode, null, selectedApps);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-label="customisation-modal"
        aria-labelledby="scroll-dialog-modal"
        classes={{ paper: classes.root }}
      >
        <div>
          <DialogTitle id="scroll-dialog-title">
            <Typography
              style={{
                color: "#000000",
                fontSize: "16px",
                fontWeight: 500,
                paddingBottom: `${
                  modalMode === ModalMode.QuickAccess ? "10px" : 0
                }`,
              }}
            >
              {modalMode === ModalMode.QuickAccess
                ? "Select for quick access"
                : "Edit"}
            </Typography>
            {modalMode === ModalMode.QuickAccess && (
              <Typography style={{ color: "#8A8A8A", fontSize: "12px" }}>
                Select all default quick access apps (must be maximum of 5)
              </Typography>
            )}
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon htmlColor="#FFFFFF" />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent dividers={false}>
            {(modalMode === ModalMode.PersonalAndOrganizationDetails ||
              modalMode === ModalMode.MenuSettings) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div>
                  <Typography gutterBottom>Rename title</Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    className={classes.textFieldRoot}
                    defaultValue={title ?? ""}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>

                <div>
                  <Typography gutterBottom>Select content type</Typography>
                  <Select
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    value={contentType || DEFAULT.NONE}
                    onChange={(e) => {
                      setContentType(e.target.value);
                    }}
                    className={classes.selectFieldRoot}
                  >
                    <MenuItem value={DEFAULT.NONE} selected disabled>
                      Select option
                    </MenuItem>
                    {ModalContentTypeOptions.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.title}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                {contentType === ContentTypes.APPS && (
                  <>
                    <div>
                      <Typography gutterBottom>Select apps</Typography>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateRows: "auto",
                          height: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {loadingAppsList ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <CircularProgress />
                          </div>
                        ) : (
                          <>
                            {appsListDropdown.map((appItem, index) => (
                              <CustomSingleAppOption
                                index={index}
                                appItem={appItem}
                                apps={apps}
                                onSelection={handleAppSelectionContent}
                              />
                            ))}

                            <LoadMoreButton
                              setNextPage={setPage}
                              hasNextPage={hasNextPage}
                              isFetchingNextPage={fetchingNextPage}
                              handleFetchNextPage={setFetchingNextPage}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {contentType === ContentTypes.EXTERNAL_LINK && (
                  <>
                    <div>
                      <Typography gutterBottom>Link text</Typography>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        className={classes.textFieldRoot}
                        defaultValue={externalLink.linkText ?? ""}
                        onChange={(e) => {
                          setExternalLink({
                            ...externalLink,
                            linkText: e.target.value,
                          });
                        }}
                      />
                    </div>

                    <div>
                      <Typography gutterBottom>Link URL</Typography>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        className={classes.textFieldRoot}
                        defaultValue={externalLink.linkUrl ?? ""}
                        onChange={(e) => {
                          setExternalLink({
                            ...externalLink,
                            linkUrl: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </>
                )}

                {contentType === ContentTypes.DOCUMENTS && (
                  <>
                    <div>
                      <Typography gutterBottom>Document title</Typography>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        className={classes.textFieldRoot}
                        defaultValue={document.documentType}
                        onChange={(e) => {
                          setDocument({
                            ...document,
                            documentType: e.target.value,
                          });
                        }}
                      />
                    </div>

                    <div>
                      <Typography gutterBottom>File type</Typography>
                      <Select
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        value={document.fileType || DEFAULT.NONE}
                        onChange={(e) => {
                          setDocument({
                            ...document,
                            fileType: e.target.value,
                          });
                        }}
                        className={classes.selectFieldRoot}
                      >
                        <MenuItem value={DEFAULT.NONE} selected disabled>
                          Select option
                        </MenuItem>
                        {documentOptions.map((option, index) => (
                          <MenuItem key={index} value={option.value}>
                            {option.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Typography gutterBottom>Upload document(s)</Typography>

                      <div className={classes.uploadDocument}>
                        <FileUpload
                          id={id}
                          showSvgIcon={false}
                          disabled={!document?.fileType}
                          values={{
                            fileType: document?.fileType,
                            required: false,
                            numOfFiles: 1,
                            maxFileSize: 2,
                            buttonText: "Click to upload file here",
                          }}
                          onChange={(e) => {
                            if (!e) {
                              return;
                            }

                            setDocument({
                              ...document,
                              file: e?.toString(),
                            });
                          }}
                          uploadFile={uploadFile}
                          style={{
                            button: {
                              color: "#FFFFFF",
                              textAlign: "center",
                              textTransform: "none",
                              borderWidth: 1,
                              borderRadius: 5,
                              font: "14px",
                              padding: "3px 5px",
                              borderColor: "#2457C1",
                              backgroundColor: "#2457C1",
                            },
                          }}
                          isAssetRoute={true}
                          appDesignMode={APP_DESIGN_MODES.LIVE}
                        />
                      </div>
                    </div>
                  </>
                )}

                {contentType === ContentTypes.USER_DETAILS && (
                  <>
                    <>
                      <div>
                        <Typography gutterBottom>Information type</Typography>
                        <Select
                          id="outlined-basic"
                          variant="outlined"
                          fullWidth
                          value={userDetails.informationType || DEFAULT.NONE}
                          onChange={(e) => {
                            setUserDetails({
                              ...userDetails,
                              informationType: e.target.value,
                            });
                          }}
                          className={classes.selectFieldRoot}
                        >
                          <MenuItem value={DEFAULT.NONE} selected disabled>
                            Select option
                          </MenuItem>
                          {userDetailsOptions.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <Typography gutterBottom>User information</Typography>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          fullWidth
                          className={classes.textFieldRoot}
                          defaultValue={userDetails.userInformation}
                          onChange={(e) => {
                            setUserDetails({
                              ...userDetails,
                              userInformation: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </>
                  </>
                )}
              </div>
            )}

            {modalMode === ModalMode.QuickAccess && (
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  height: "400px",
                  overflowY: "auto",
                }}
              >
                {loadingAppsList ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress color="secondary" />
                  </div>
                ) : (
                  <>
                    {appsListDropdown.map((appItem, index) => {
                      const isSelected = selectedApps.some(
                        (selectedApp) => selectedApp._id === appItem._id
                      );

                      const isDisabled =
                        !isSelected &&
                        selectedApps.length === NUMBER_OF_SELECTED_APPS;
                      return (
                        <CustomQuickAccessApp
                          index={index}
                          app={appItem}
                          apps={apps}
                          isSelected={isSelected}
                          isDisabled={isDisabled}
                          handleAppSeletion={handleMultipleAppSelection}
                          showSelectIcon={true}
                        />
                      );
                    })}

                    <LoadMoreButton
                      setNextPage={setPage}
                      hasNextPage={hasNextPage}
                      isFetchingNextPage={fetchingNextPage}
                      handleFetchNextPage={setFetchingNextPage}
                    />
                  </>
                )}
              </div>
            )}
          </DialogContent>

          <div
            style={{
              display: `${
                detailsMode === DetailsMode.MenuItemDetails ? "flex" : "block"
              }`,

              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px",
            }}
          >
            {/* delete section */}
            {detailsMode === DetailsMode.MenuItemDetails && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onDelete(DetailsMode.MenuItemDetails, modalDetails?._id);
                  handleClose();
                }}
              >
                <DeleteIcon htmlColor="#535353" fontSize="small" />
                <Typography
                  style={{
                    color: "#535353",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Delete
                </Typography>
              </div>
            )}

            <DialogActions>
              <Button
                onClick={handleClose}
                color="primary"
                variant="outlined"
                className={classes.cancelButton}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                className={classes.saveButton}
                disabled={disableSaveButtonBasedOnModalMode(
                  modalMode,
                  contentType
                )}
                onClick={() => {
                  handleModalSave(
                    modalMode,
                    detailsMode,
                    id,
                    title,
                    contentType
                  );
                }}
              >
                Save
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
