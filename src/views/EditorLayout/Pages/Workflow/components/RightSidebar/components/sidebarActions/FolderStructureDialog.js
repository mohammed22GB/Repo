import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Tooltip,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import folderIcon from "../../../../../../../../assets/images/folder-icon.svg";
import fileIcon from "../../../../../../../../assets/images/file-icon.svg";

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 5,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
  },
  sectionEntry: {
    marginBottom: 13,
  },
  matchingFields: {
    borderRadius: 5,
    border: "dashed 1.5px #999",
    padding: "10px 5px 10px 10px",
    backgroundColor: "#f8f8f8",
    marginTop: 7,
  },
  mappingTitle: {
    fontSize: 12,
    flex: 1,
    color: "#f7a712",
    display: "flex",
    justifyContent: "space-between",
  },
  addMatch: {
    fontSize: 20,
    boxShadow: "0px 2px 3px #aaa",
    borderRadius: "14%",
    marginTop: 10,
  },
  pair: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    "& > div": {
      "&:first-child": {
        marginRight: 5,
      },
    },
  },
  menuSubs: {
    fontSize: "0.8em",
    color: "#0c7b93",
    fontWeight: "normal",
    display: "flex",
    alignItems: "center",
    marginTop: 3,
  },
  selected: {
    "& span": {
      display: "none",
    },
  },
  actionButtons: {
    width: 36,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f8f8f8",
    },
  },
  eachFolder: {
    width: 80,
    // height: 93,
    border: "solid 1px transparent",
    borderRadius: 5,
    "&:hover": {
      borderColor: "#ccc",
    },
    "&.active": {
      backgroundColor: "red",
    },
  },
}));

const FolderStructureDialog = ({
  fileFolderType,
  isFolderDialogOpen,
  closeFolderDialog,
  saveFolderSelection,
  initialPath,
  initialFolders,
  initialFoldersIdList,
  setInitialFoldersIdList,
  documentPathArray,
  fetchFolderContents,
  isLoading,
}) => {
  const initialPath_ =
    initialPath !== "/" ? initialPath.split("/").filter((path) => !!path) : [];
  const classes = useStyles();
  const [foldersIdList, setFoldersIdList] = useState(initialFoldersIdList);
  const [displayedPath, setDisplayedPath] = useState(initialPath);
  const [displayFolders, setDisplayFolders] = useState(initialFolders);
  const [folderLevels, setFolderLevels] = useState(initialPath_.length);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [pathArray, setPathArray] = useState(initialPath_);
  const [disableGoOneLevelUp, setDisableGoOneLevelUp] = useState(false);
  const [disableAddNewFolder, setDisableAddNewFolder] = useState(false);
  const [disableSelectDone, setDisableSelectDone] = useState(false);

  useEffect(() => {
    if (!!documentPathArray?.length) {
      const currentId = documentPathArray[documentPathArray.length - 1];
      openFolder(currentId);
    }
  }, []);

  useEffect(() => {
    setDisplayFolders(initialFolders);
  }, [initialFolders]);

  useEffect(() => {
    const arr =
      initialPath !== "/"
        ? initialPath.split("/").filter((path) => !!path)
        : [];

    setPathArray(arr);
    setFolderLevels(arr.length);
    setSelectedFolder(null);
  }, [initialPath]);

  useEffect(() => {
    const initArray =
      initialPath !== "/"
        ? initialPath.split("/").filter((path) => !!path)
        : [];

    setDisplayedPath(getCurrentPath());
  }, [pathArray]);

  useEffect(() => {
    setFoldersIdList(initialFoldersIdList);

    setDisableGoOneLevelUp(isLoading || !initialFoldersIdList.length);
    setDisableAddNewFolder(isLoading || !!selectedFolder);
    setDisableSelectDone(isLoading);
  }, [isLoading, initialFoldersIdList, disableAddNewFolder, selectedFolder]);

  const idToName = (id) => {
    return displayFolders.find((folder) => folder.id === id)?.name;
  };

  const selectFolder = (id) => {
    const folderName = idToName(id);
    const newPathArr = [...pathArray];
    const newFoldersIdList = [...foldersIdList];

    if (selectedFolder === id) {
      newPathArr.pop();
      newFoldersIdList.pop();
      setSelectedFolder(null);
    } else {
      newPathArr[folderLevels] = folderName;
      newFoldersIdList[folderLevels] = id;
      setSelectedFolder(id);
    }

    setPathArray(newPathArr);
    setFoldersIdList(newFoldersIdList);
  };

  const goOneLevelUp = () => {
    const newPathArr = [...pathArray];
    newPathArr.pop();

    const newPath = `/${newPathArr.join("/")}/`;

    const newFoldersIdList = [...initialFoldersIdList];
    newFoldersIdList.pop();
    setInitialFoldersIdList(newFoldersIdList);

    fetchFolderContents(newFoldersIdList[newFoldersIdList.length - 1], newPath);
  };

  const openFolder = (id) => {
    const folderName = idToName(id);
    const newPathArr = [...pathArray];

    newPathArr[folderLevels] = folderName;

    const newPath = `/${newPathArr.join("/")}/`;

    const newFoldersIdList = [...initialFoldersIdList];
    newFoldersIdList.push(id);
    setInitialFoldersIdList(newFoldersIdList);
    fetchFolderContents(id, newPath);
  };

  const getCurrentPath = () => {
    return `/${pathArray.join("/")}${
      !!selectedFolder || !pathArray.length ? "" : "/"
    }`;
  };

  const FolderItem = ({ fileFolder, index, type }) => (
    <div
      key={fileFolder.id}
      // onClick={(e) => handleMenuOpen(e, i)}
      className={classes.eachFolder}
      style={{
        cursor: "default",
        backgroundColor:
          selectedFolder === fileFolder.id ? "#b5caf1" : "transparent",
        ...(selectedFolder === fileFolder.id ? { borderColor: "#7185aa" } : {}),
      }}
      onClick={() => selectFolder(fileFolder.id)}
      onDoubleClick={() => type === "folder" && openFolder(fileFolder.id)}
    >
      {type === "folder" ? (
        <img src={folderIcon} alt="folder" />
      ) : (
        <img
          src={fileIcon}
          alt="file"
          style={{
            minWidth: 63,
            filter: "opacity(0.5)",
            margin: "7px 0 8px 0",
          }}
        />
      )}
      <div
        style={{
          marginTop: -10,
          fontSize: 10,
          maxHeight: 80,
          overflow: "hidden",
        }}
      >
        {fileFolder.name}
      </div>
    </div>
  );

  return (
    <Dialog
      open={isFolderDialogOpen}
      onClose={closeFolderDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          title={"groupedIntegrations"}
        >
          {`Select ${fileFolderType} on Google Drive`}
          <IconButton size="small" onClick={closeFolderDialog}>
            <Cancel style={{ fontSize: 20 }} />
          </IconButton>
        </div>
      </DialogTitle>
      <div
        style={{
          border: "solid #ccc",
          borderWidth: "1px 0",
          letterSpacing: "0.2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start ",
          height: 36,
        }}
      >
        <Tooltip title="Go up one level">
          <div
            className={classes.actionButtons}
            style={{
              ...(disableGoOneLevelUp
                ? {
                    backgroundColor: "#f8f8f8",
                    cursor: "default",
                  }
                : {}),
            }}
            onClick={() => !disableGoOneLevelUp && goOneLevelUp()}
          >
            <ArrowBackIosNewRoundedIcon
              style={{
                ...(disableGoOneLevelUp
                  ? {
                      color: "#ccc",
                    }
                  : {}),
              }}
            />
          </div>
        </Tooltip>
        <div
          style={{
            backgroundColor: "#f8f8f8",
            flex: 1,
            padding: "8px 10px",
            border: "solid #ccc",
            borderWidth: "0 1px",
          }}
        >
          {displayedPath}
        </div>
        <Tooltip title="Add new folder here">
          <div
            className={classes.actionButtons}
            style={{
              borderRight: "solid 1px #ccc",
              ...(disableAddNewFolder
                ? {
                    backgroundColor: "#f8f8f8",
                    cursor: "default",
                  }
                : {}),
            }}
            onClick={() =>
              !disableAddNewFolder &&
              saveFolderSelection(displayedPath, foldersIdList, true)
            }
          >
            <CreateNewFolderOutlinedIcon
              style={{
                ...(disableAddNewFolder
                  ? {
                      color: "#ccc",
                    }
                  : {}),
              }}
            />
          </div>
        </Tooltip>
        <Tooltip title="Select current folder">
          <div
            className={classes.actionButtons}
            style={{
              ...(disableSelectDone
                ? {
                    backgroundColor: "#f8f8f8",
                    cursor: "default",
                  }
                : {}),
            }}
            onClick={() =>
              !disableSelectDone &&
              saveFolderSelection(displayedPath, foldersIdList)
            }
          >
            <DoneRoundedIcon
              style={{
                ...(disableSelectDone
                  ? {
                      color: "#ccc",
                    }
                  : {}),
              }}
            />
          </div>
        </Tooltip>
      </div>
      <DialogContent style={{ minHeight: 500 }}>
        <div
          style={{
            minWidth: 500,
            textAlign: "center",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {isLoading ? (
            <span
              style={{
                fontStyle: "italic",
                color: "#999",
              }}
            >
              {"[ loading... ]"}
            </span>
          ) : (
            <>
              {(displayFolders || [])
                .filter(
                  (fileFolder) =>
                    !fileFolder.mimeType ||
                    fileFolder.mimeType === "application/vnd.google-apps.folder"
                )
                .map((fileFolder, index) =>
                  FolderItem({
                    key: `folder-${index}`,
                    fileFolder,
                    index,
                    type: "folder",
                  })
                )}
              {(displayFolders || [])
                .filter(
                  (fileFolder) =>
                    !!fileFolder.mimeType &&
                    fileFolder.mimeType !== "application/vnd.google-apps.folder"
                )
                .map((fileFolder, index) =>
                  FolderItem({
                    key: `file-${index}`,
                    fileFolder,
                    index,
                    type: "file",
                  })
                )}
              {!displayFolders.length && (
                <span
                  style={{
                    fontStyle: "italic",
                    color: "#999",
                  }}
                >
                  {"[ no items to select ]"}
                </span>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderStructureDialog;
