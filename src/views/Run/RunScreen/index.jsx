import { useParams, useLocation, useHistory } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Document, Page, pdfjs } from "react-pdf";
import { jsPDF } from "jspdf";
import { makeStyles } from "@material-ui/core/styles";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { DragDropContext } from "react-beautiful-dnd";

import Error from "../Error";
import LoadingScreen from "../LoadingScreen";
import SignatureModal from "../SignatureModal";
import PageWrapper from "../../EditorLayout/Pages/UIEditor/components/PageWrapper";
import ScreenButtons from "../../EditorLayout/Pages/UIEditor/components/actualObjects/ScreenButtons";
import { APP_RUN_MAX_WIDTH } from "../../EditorLayout/Pages/Workflow/components/utils/constants";
import { WORKFLOWS_TASK_SCREEN } from "../../EditorLayout/Pages/Workflow/components/utils/taskTypes";
import {
  getLiveData,
  runCurrentTask,
  setRunFirstScreen,
  uploadFile,
} from "../../common/helpers/LiveData";
import {
  APP_DESIGN_MODES,
  LAST_MAJOR_APP_BE_VERSION,
  SCREEN_REUSE_ATTRIBUTES,
} from "../../common/utils/constants";
import UIEditorCanvas from "../../EditorLayout/Pages/UIEditor/components/UIEditorCanvas";
import { updateUieCanvas } from "../../EditorLayout/Pages/UIEditor/utils/uieditorHelpers";
import {
  rUieSetDragStart,
  rUieSetCanvasMode,
} from "../../../store/actions/properties";
import { compareAppVersions } from "../../common/helpers/helperFunctions";
import { getLookupItems } from "../../EditorLayout/Pages/UIEditor/utils/screenAPIs";
import CustomConfirmBox from "../../common/components/CustomConfirmBox/CustomConfirmBox";
import PdfViewer from "../PdfViewer";
import LoadingScreen2 from "../LoadingScreen2";
import { InterFonts } from "../myFont";
import { manageLogicalOperators } from "../comparison";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const myStyle = {
  root: {
    display: "flex",
    backgroundColor: "#F4F6F8",
    minHeight: "100vh",

    flexDirection: "column",
    alignItems: "center",
  },
  app: {
    margin: "10px auto 72px auto",
    border: "solid 0.5px #e8e8e8",
    borderRadius: 4,
    // padding: 5,
    // height: "100%",

    backgroundSize: "25px 25px",
    // backgroundColor: "#F4F6F8",
    // backgroundColor: "#FAFBFC",
    minHeight: "calc(100vh - 128px)",

    width: "100%",
    maxWidth: APP_RUN_MAX_WIDTH,
    minWidth: APP_RUN_MAX_WIDTH,
    // position: "absolute",
  },
  drop: {
    paddingBottom: 0,
    // marginBottom: 50,
  },
  container: {
    // margingTop: 50,
    // paddingBottom: 76,
    position: "relative",
    // padding: 15,
    backgroundColor: "transparent",
  },
  documentBtn: {
    minWidth: "8rem",
    height: "36px",
    textTransform: "none",
    //marginRight: "4px",
    fontSize: "0.9rem",
    borderRadius: "0.5rem",
  },
};
const useStyles = makeStyles((theme) => ({
  ...myStyle,
}));

const DEFAULT_LOOKUP_RETURN_TYPE = "list";

const RunScreen = () => {
  const {
    screen,
    runFirstScreen,
    screenLoading,
    screenError,
    error,
    workflowInstance,
    taskRunning,
    task,
    screensInfo,
    app,
    filesUploaded,
  } = useSelector(({ liveData }) => liveData);
  const { activeScreen } = useSelector(({ screens }) => screens);
  const { screensItems } = useSelector(({ uieditor }) => uieditor);

  const { style: screenStyles } = screen;

  const SIGNATURE_FILE_NAME = "my_signature.png";
  const myRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const query = new URLSearchParams(useLocation().search);
  const { appSlug, screenSlug, accountSlug } = useParams();

  const [capturedData, setCapturedData] = useState({});
  const [noBack, setNoBack] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureComponentID, setSignatureComponentID] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [uploadPDF, setUploadPDF] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerRef, setContainerRef] = useState(null);
  const [returnedLookup, setReturnedLookup] = useState(null);
  const [returnedLookupObj, setReturnedLookupObj] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showUpgradeAppPrompt, setShowUpgradeAppPrompt] = useState(false);
  const [itemsValidationSetting, setItemsValidationSetting] = useState({});
  const holdItemsValidationSettingRef = useRef({});
  const [itemsValidationFailed, setItemsValidationFailed] = useState({});
  const [pageValidationError, setPageValidationError] = useState(false);
  const [numPages, setNumPages] = useState(1);

  const taskId = query.get("taskId");
  const workflowInstanceId = query.get("workflowInstanceId");
  const loopingId = query.get("loopingId");
  const isApproval = query.get("isApproval");
  const trackAndComparePreviousLookupValue = useRef(null);

  /* CHECK APP UPGRADE STATUS */
  useEffect(() => {
    if (
      app?.active &&
      (!app?.beVersion ||
        compareAppVersions(app?.beVersion, LAST_MAJOR_APP_BE_VERSION) < 0)
    ) {
      setShowUpgradeAppPrompt(true);
    }
  }, [app]);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const loopingIdString = loopingId ? `&loopingId=${loopingId}` : "";

      const resp = await dispatch(
        getLiveData({
          appSlug,
          ...(taskId && workflowInstanceId
            ? {
                queryParam: `taskId=${taskId}&workflowInstanceId=${workflowInstanceId}${loopingIdString}`,
              }
            : {}),
          relaunch: taskId && workflowInstanceId,
          accountSlug,
        })
      );
      setIsFetching(false);

      if (resp?.type === "GET_LIVE_DATA_ERROR") {
        return;
      }

      //  checks state for first screen
      if (resp?.payload?.task?.type === WORKFLOWS_TASK_SCREEN) {
        dispatch(setRunFirstScreen(resp.payload.screensInfo.id));
      }
      if (!runFirstScreen) {
        setNoBack(true);
      } else if (resp?.payload?.screensInfo?.id !== runFirstScreen) {
        setNoBack(false);
      }

      if (!isApproval) {
        // dispatch(getLiveScreen(screenSlug, appId, accountSlug));
        // dispatch(getAllScreens(appId, true, null, screenSlug));
      }
    };

    if (!workflowInstance._id && !workflowInstance.id) {
      fetchData();
    }

    dispatch(rUieSetCanvasMode(APP_DESIGN_MODES.LIVE));
  }, [screenSlug, taskId, workflowInstanceId, dispatch]);

  useEffect(() => {
    if (screenLoading) {
      setLoadingMessage("Loading screen...");
    } else if (taskRunning) {
      setLoadingMessage("Processing...");
    } else if (isFetching) {
      setLoadingMessage("Setting environment...");
    } else {
      setLoadingMessage("");
    }
  }, [screenLoading, taskRunning, isFetching]);

  useEffect(() => {
    getEachItemDetailsAndVisibility();
  }, [capturedData]);

  useEffect(() => {
    /**This syncs itemsValidationSetting with holdItemsValidationSettingRef.current */
    if (itemsValidationSetting !== holdItemsValidationSettingRef.current) {
      setItemsValidationSetting(holdItemsValidationSettingRef.current);
    }
  }, [holdItemsValidationSettingRef.current]);

  const getConditionalItemVisibility = ({ itemId, itemDetails }) => {
    const screenItems = Object?.values(screensItems?.[activeScreen?.id] || {});

    if (itemId) {
      itemDetails = screenItems?.find((screenItem) => {
        return screenItem?._id === itemId;
      });
    }
    const conditionningElement = itemDetails?.values?.conditionalElement;

    let isConditionallyVisible = true;

    if (itemDetails?.values?.conditionals && conditionningElement) {
      const conditionningItem = screenItems?.find((screenItem) => {
        return screenItem?.itemRef === conditionningElement;
      });

      isConditionallyVisible = manageLogicalOperators(
        itemDetails?.values?.conditionalOperator,
        capturedData?.[conditionningItem?.id],
        itemDetails?.values?.conditionalValue,
        itemDetails?.values?.conditionals,
        itemDetails?.type
      );
    }

    return isConditionallyVisible;
  };

  const getEachItemDetailsAndVisibility = (structChildId) => {
    const screenItems = Object?.values(screensItems?.[activeScreen?.id] || {});

    let newItemsValidationSetting = {
      ...holdItemsValidationSettingRef.current,
    };

    const doElementVisibility = (itemDetails) => {
      let condition_1 = getConditionalItemVisibility({ itemDetails });

      const condition_2 =
        screenReuseAttributes?.[itemDetails?.id]?.attribute !==
        SCREEN_REUSE_ATTRIBUTES.HIDDEN;

      const isItemVisible = condition_1 && condition_2;

      return { itemDetails, isItemVisible };
    };

    if (structChildId) {
      const itemDetails = screenItems?.find(
        (screenItem) => screenItem?.itemRef === structChildId
      );

      return doElementVisibility(itemDetails);
    }

    for (let item of screenItems) {
      if (item.values?.required) {
        const { isItemVisible } = doElementVisibility(item);

        newItemsValidationSetting = {
          ...newItemsValidationSetting,
          [item.id]: {
            ...newItemsValidationSetting[item.id],
            required: isItemVisible,
          },
        };
      }
    }

    setItemsValidationSetting(newItemsValidationSetting);
  };

  const goBack = () => {
    history.goBack();
  };

  const getScreenReuseAttributes = () => {
    if (
      !task?.properties?.screenReuse?.isReusableScreen &&
      !task?.properties?.screenReuse?.isReusingScreen
    ) {
      return {};
    }

    let fieldsAttributes = task?.properties?.screenReuse?.fieldsAttributes?.[0];

    if (!fieldsAttributes) {
      return {};
    }

    const elementIds = Object.keys(fieldsAttributes);

    const screenId = task.properties?.screen;
    const screenTaskIdsReuseOrder = workflowInstance.screenReuse?.[
      screenId
    ]?.reuseOrder?.map((reuse) => reuse.taskId);

    elementIds.forEach((elementId) => {
      for (let iter = 0; iter < screenTaskIdsReuseOrder?.length; iter++) {
        const taskId = screenTaskIdsReuseOrder[iter];

        const variableId = task.variables?.find((variable) => {
          return (
            variable.matching?.valueSourceId === taskId &&
            variable.matching?.valueSourceInput === elementId
          );
        })?.id;

        const fieldValue = workflowInstance.metadata?.[variableId];

        if (![null, undefined].includes(typeof fieldValue)) {
          fieldsAttributes = {
            ...fieldsAttributes,
            [elementId]: {
              ...fieldsAttributes?.[elementId],
              value: fieldValue,
            },
          };
          break;
        }
      }
    });

    return fieldsAttributes;
  };

  const screenReuseAttributes = getScreenReuseAttributes();

  const runCustomValidation = () => {
    let validationFailed = false;
    const validationStatus = {};

    const checkInData = (value) => {
      if (Array.isArray(value)) {
        return !value.some((element) => !element);
      }
      return !!value;
    };

    for (const itemId in itemsValidationSetting) {
      if (itemsValidationSetting?.[itemId]?.sub) {
        const subItems = itemsValidationSetting?.[itemId]?.sub;
        let subFailure = false;
        for (const subItemId in subItems) {
          if (
            subItems?.[subItemId]?.required &&
            screenReuseAttributes?.[subItemId]?.attribute !== "hidden" &&
            !checkInData(capturedData?.[subItemId])
          ) {
            subFailure = true;
          }
        }

        if (subFailure) {
          validationStatus[itemId] = true;
          validationFailed = true;
        } else {
          delete validationStatus[itemId];
        }
      } else if (
        itemsValidationSetting?.[itemId]?.required &&
        screenReuseAttributes?.[itemId]?.attribute !== "hidden" &&
        getConditionalItemVisibility({ itemId }) &&
        !checkInData(capturedData?.[itemId])
      ) {
        validationStatus[itemId] = true;
        validationFailed = true;
      } else {
        delete validationStatus[itemId];
      }
    }

    setItemsValidationFailed(validationStatus);

    return !validationFailed;
  };

  const goNext = async (e) => {
    e?.preventDefault();

    const dataIsValid = runCustomValidation();

    if (!dataIsValid) {
      setPageValidationError(true);
      return;
    } else {
      setPageValidationError(false);
    }

    const prepareData = {
      taskId: taskId || workflowInstance?.task,
      workflowInstanceId: workflowInstanceId || workflowInstance?._id,
      data: capturedData || {},
      loopingId,
    };

    dispatch(runCurrentTask({ payload: prepareData, history, accountSlug }));
  };

  const captureData = (value, input, isGrouped = false) => {
    if ((!input && !isGrouped) || !value) {
      return;
    }

    if (!isGrouped) {
      const isLookupTrigger = task?.properties?.lookupContents?.some(
        (contentObj) => {
          return !!input && contentObj?.lookupField === input;
        }
      );
      if (isLookupTrigger) {
        if (
          trackAndComparePreviousLookupValue.current === value?.toLowerCase()
        ) {
          return;
        }

        setReturnedLookup(async () => {
          if (input?.toLowerCase()?.includes("checkbox")) {
            value = value?.[value?.length - 1];
          }
          if (input?.toLowerCase()?.includes("userpicker")) {
            value = value?.[value?.length - 1]?.name;
          }

          trackAndComparePreviousLookupValue.current = value?.toLowerCase();

          const response = await getLookupItems({
            taskId: task.id,
            workflowInstanceId: workflowInstance.id,
            input,
            value,
            lookupType: DEFAULT_LOOKUP_RETURN_TYPE,
          });

          return response || "";
        });
      }
    }

    setCapturedData((prev) => ({
      ...prev,
      ...(isGrouped ? { ...value } : { [input]: value }),
    }));
  };

  useEffect(() => {
    const logger = async () => {
      const gottenVal = await returnedLookup;

      setReturnedLookupObj(gottenVal?.data?.data);
    };
    logger();
  }, [returnedLookup]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const processPDF = async (content, type) => {
    const forDownload = type === "download";
    const pdfID = `${Math.floor(Date.now() * Math.random())}PDF`;
    const bodyFormData = new FormData();

    const getPageSize = (node) => {
      const newDiv = document.createElement("div");
      newDiv.appendChild(content);

      return {
        width: 200 * 2, // Convert px to pt (1px = 0.75pt)
        height: 200 * 2,
      };
    };

    const { width: contentWidth, height: contentHeight } = getPageSize(content);
    const pdfWidth = Math.max(contentWidth, forDownload ? 900 : 890);
    const pdfHeight = Math.max(contentHeight, forDownload ? 950.28 : 5000);

    const doc = new jsPDF("p", "pt", [pdfWidth, pdfHeight], true);

    doc.addFileToVFS("Inter-Black-normal.ttf", InterFonts.black);
    doc.addFont("Inter-Black-normal.ttf", "Inter", "normal", 900);
    doc.addFileToVFS("Inter-ExtraBold-normal.ttf", InterFonts.extraBold);
    doc.addFont("Inter-ExtraBold-normal.ttf", "Inter", "normal", 800);
    doc.addFileToVFS("Inter-Bold-normal.ttf", InterFonts.bold);
    doc.addFont("Inter-Bold-normal.ttf", "Inter", "normal", 700);
    doc.addFileToVFS("Inter-SemiBold-normal.ttf", InterFonts.semiBold);
    doc.addFont("Inter-SemiBold-normal.ttf", "Inter", "normal", 600);
    doc.addFileToVFS("Inter-Medium-normal.ttf", InterFonts.medium);
    doc.addFont("Inter-Medium-normal.ttf", "Inter", "normal", 500);
    doc.addFileToVFS("Inter-Regular-normal.ttf", InterFonts.regular);
    doc.addFont("Inter-Regular-normal.ttf", "Inter", "normal", 400);
    doc.addFileToVFS("Inter-Light-normal.ttf", InterFonts.light);
    doc.addFont("Inter-Light-normal.ttf", "Inter", "normal", 300);
    doc.addFileToVFS("Inter-ExtraLight-normal.ttf", InterFonts.extraLight);
    doc.addFont("Inter-ExtraLight-normal.ttf", "Inter", "normal", 200);
    doc.addFileToVFS("Inter-Thin-normal.ttf", InterFonts.thin);
    doc.addFont("Inter-Thin-normal.ttf", "Inter", "normal", 100);

    // Modify the html2canvas properties for optimized output
    const properties = {
      pagesplit: true,
      margin: forDownload ? [30, 0, 30, 0] : [0, 0, 0, 0],
      html2canvas: {
        scale: 1,
        unit: "pt",
        dpi: 150,
        useCORS: true,
      }, // Reduce scale and DPI to lower size
    };

    const optimizeImage = (img) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Resize the image to reduce resolution and lower quality
      const width = img.width; // Reduce resolution to half
      const height = img.height;

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#FCFCFC";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, width, height);

      // Compress to JPEG format with 70% quality
      return canvas.toDataURL("image/jpeg", 0.7);
    };

    // Compressing images before adding to the document
    const compressImagesInNode = (node) => {
      const images = node.querySelectorAll("img");
      images.forEach((img) => {
        const optimizedImage = optimizeImage(img);
        img.src = optimizedImage;
      });
    };

    // Optimize the images within the content node
    compressImagesInNode(content);

    const preview = () =>
      doc.html(content, {
        callback: async function (doc) {
          const base64 = await doc.output("datauristring");
          setPdfUrl(base64);
          uploadPDF && upload(doc);
        },
        ...properties,
      });

    // create a file name with app name, node name and the current date and time
    const fileName = `${app?.name?.replace(/ /g, "-")}-${
      task?.name
    }-${Date.now()}`;

    const download = () =>
      doc.html(content, {
        callback: async function (doc) {
          await doc.save(fileName);
          uploadPDF && upload(doc);
        },
        ...properties,
      });

    const upload = async (doc) => {
      const results = await doc.output("blob");
      const type = results.type;
      const resultsFile = await new File([results], fileName, {
        lastModified: new Date().getTime(),
        type,
      });
      bodyFormData.append("file", resultsFile);
      bodyFormData.append("taskId", taskId);
      bodyFormData.append("fileType", "pdf");
      bodyFormData.append("workflowInstanceId", workflowInstanceId);
      bodyFormData.append("fileName", fileName);

      // File upload logic
      !filesUploaded.componentId &&
        taskId &&
        (await dispatch(uploadFile(pdfID, bodyFormData, null)));
    };

    if (forDownload) {
      download();
    } else {
      preview();
    }
  };

  const pdfContainerRef = useCallback((node) => {
    const runPromise = async () => {
      new Promise((resolve, reject) => {
        setTimeout(async () => {
          node && processPDF(node, "preview");
          node && setContainerRef(node);
          setUploadPDF(false);
          resolve();
        }, 5000);
      });
    };
    runPromise();
  }, []);

  const getStatusStructure = (statuses, item) => {
    switch (item.type) {
      case "inputTable":
        statuses[item.id] = { sub: {} };
        const columns = item.values?.columns;
        for (const column of columns) {
          statuses[item.id].sub[column.id] = {
            required: column.required,
          };
        }
        break;

      case "dateTime":
        if (item.values?.setRange) {
          statuses[item.id] = {
            sub: {
              [item.values?.rangeStartId]: {
                required: item.values?.required,
              },
              [item.values?.rangeEndId]: {
                required: item.values?.required,
              },
              ...(item.values?.hasDuration
                ? {
                    [item.values.rangeDurationId]: {
                      required: item.values.required,
                    },
                  }
                : {}),
            },
          };
          statuses[item.id].required = item.values?.required;
        } else {
          statuses[item.id] = { required: item.values?.required };
        }
        break;

      default:
        break;
    }
  };

  const initiateCustomValidationSetup = (items) => {
    const statuses = {};
    for (const item of items) {
      if (["inputTable", "dateTime"].includes(item.type)) {
        getStatusStructure(statuses, item);
      } else {
        statuses[item.id] = {
          required: item.values?.required,
        };
      }
    }

    holdItemsValidationSettingRef.current = statuses;
  };

  const RunUIEditorCanvas = () => {
    return (
      <UIEditorCanvas
        uieCanvasMode={APP_DESIGN_MODES.LIVE}
        onChange={captureData}
        capturedData={capturedData}
        // onFormSubmit={onFormSubmit}
        metadata={workflowInstance.metadata}
        uploadFile={uploadFile}
        screenId={activeScreen?.id}
        isDocument={screensInfo?.type === "document"}
        taskId={task.id}
        workflowInstanceId={workflowInstance.id}
        dynamicData={workflowInstance?.dynamicContents}
        dispatch={dispatch}
        appSequence={screensInfo?.screenSequence}
        screenStyles={screenStyles}
        screenReuseAttributes={
          workflowInstance?.reusableFields ?? screenReuseAttributes
        }
        appDesignMode={APP_DESIGN_MODES.LIVE}
        setShowSignatureModal={setShowSignatureModal}
        setSignatureComponentID={setSignatureComponentID}
        returnedLookup={returnedLookup}
        returnedLookupObj={returnedLookupObj}
        initiateCustomValidationSetup={initiateCustomValidationSetup}
        getEachItemDetailsAndVisibility={getEachItemDetailsAndVisibility}
        itemsValidationFailed={itemsValidationFailed}
        hideScreenButton1={noBack}
        screenButton1={goBack}
        screenButton2={goNext}
        pageValidationError={pageValidationError}
        screenButton2Name={task?.properties?.customNextButtonLabel}
      />
    );
  };

  const onDragStart = (result) => {
    const { source, destination } = result;

    dispatch(rUieSetDragStart(source));
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    dispatch(updateUieCanvas({ action: "move", destination }));
  };

  const closePage = () => {
    window.top.close();
  };

  return (
    <PageWrapper
      margin="54px auto 70px auto"
      minHeight="100vh"
      zoomLevel={100}
      myStyle={myStyle}
      screenStyles={activeScreen?.style}
      screenValues={activeScreen?.values}
    >
      <LoadingScreen
        loading={screenLoading || taskRunning || isFetching}
        message={loadingMessage}
      />
      {/* <ErrorRunningApp />
            <img src="../../assets/disconnected_app.svg" alt="Plug" /> */}
      {activeScreen?.type !== "document" && !loadingMessage && !error && (
        <form onSubmit={goNext}>
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            {RunUIEditorCanvas()}
          </DragDropContext>
        </form>
      )}
      {activeScreen?.type === "document" && !loadingMessage && !error && (
        <div style={{ position: "relative" }}>
          <div>
            <Document
              style={{ height: "100vh" }}
              file={pdfUrl}
              loading={"Loading..."}
              noData={
                <div style={{ marginTop: 200 }}>
                  <LoadingScreen2
                    message={`Generating PDF... please wait...`}
                  />
                </div>
              }
              onLoadSuccess={onDocumentLoadSuccess}
              //onLoadError={onLoadError}
              //onSourceError={onSourceError}
              height={"100"}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            >
              <Page pageNumber={currentPage} />
            </Document>
            {/* <p>
              Page {currentPage} of {numPages}
            </p> */}
          </div>
          <div style={{ display: "none" }}>
            <div ref={pdfContainerRef}>
              <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <PdfViewer>
                  <div ref={myRef}>{RunUIEditorCanvas()}</div>
                </PdfViewer>
              </DragDropContext>
            </div>
          </div>
          <ScreenButtons
            appDesignMode={APP_DESIGN_MODES.LIVE}
            hideScreenButton1={noBack}
            screenButton1={goBack}
            screenButton2={goNext}
            isDocument
            values={{
              button1Type: "back",
              button1Text: "Back",
              button2Type: "next",
              button2Text: `${
                task?.properties?.customNextButtonLabel || "Next"
              }`,
            }}
            previewDownload={
              screensInfo?.type === "document" &&
              task?.properties?.previewDownload
            }
            processPDF={() => processPDF(containerRef, "download")}
          />
        </div>
      )}
      {showSignatureModal && (
        <SignatureModal
          fileName={SIGNATURE_FILE_NAME}
          workflowInstanceID={workflowInstance?.id}
          signatureComponentID={signatureComponentID}
          setShowSignatureModal={setShowSignatureModal}
        />
      )}
      {showUpgradeAppPrompt && (
        <CustomConfirmBox
          open={showUpgradeAppPrompt}
          type="warning"
          trueText="OK"
          showCloseIcon={false}
          closeConfirmBox={() => {}}
          confirmAction={closePage}
          isCompulsoryPrompt
          text={`App is outdated. Please contact Administrator to upgrade to current version.`}
        />
      )}

      <Error
        status={screenError?.code || error?.code}
        message={screenError?.message || error?.message}
      />
    </PageWrapper>
  );
};

export default RunScreen;
