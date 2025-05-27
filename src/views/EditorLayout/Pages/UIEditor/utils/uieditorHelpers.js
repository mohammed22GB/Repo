import { v4 } from "uuid";
import {
  rToggleUIEditorFullScreen,
  rUieSetCanvasStructure,
  rUieActivateItem,
  rUieSetScreensItems,
  rUpdateScreensList,
  rSaveActiveScreen,
  rUieSetSearchedElements,
  rHideRightSideBar,
  rShouldRefetchWorkflow,
} from "../../../../../store/actions/properties";
import { getDefaultValues } from "./defaultScreenStyles";
import { allElements } from "./elementsList";
import {
  clearScreenItemsAPI,
  createScreen,
  deleteScreen,
  duplicateScreen,
  updateScreen,
  updateScreenItem,
} from "./screenAPIs";
import { wrapAPI } from "../../../../common/helpers/helperFunctions";
import {
  COMPONENT_CONTAINER_ADJUSTER,
  workflowScreenUnitTextTypes,
  workflowScreenVariableFieldTypes,
} from "../../../../common/utils/constants";
import { getAllScreens } from "./screenUtilities";

export const toggleUIEditorFullScreen = () => (dispatch, getState) => {
  const { uiEditorFullScreen } = getState().uieditor;
  dispatch(rToggleUIEditorFullScreen(!uiEditorFullScreen));
};

export const updateUieCanvas =
  ({ action, destination, breadcrumb, index, type, value, property }) =>
  async (dispatch, getState) => {
    const {
      dragStart: { source },
      canvasStructure,
      screensItems,
      storedSearchedElements,
      activeItem,
    } = getState().uieditor;
    const { activeScreen } = getState().screens;

    const extractedIds = [];
    const duplicatedIds = [];
    let isNewItem = false;
    let newItemData = null;
    let payload = null;

    const doBreakdown = (breadcrumb) => {
      const arr = breadcrumb
        ?.split("-")
        .filter((item, index) => index > (["move"].includes(action) ? 1 : 0))
        .map((item) => Number(item));
      return arr;
    };

    /* const checkPlaceHolderCell = (children) => {
      if (!children?.length) {
        children?.push({
          cellType: "placeholder",
        });
      } else if (children?.length > 1) {
        const placeholderExists = children?.findIndex(
          (child) => child?.cellType === "placeholder"
        );

        if (placeholderExists > -1) {
          children?.splice(placeholderExists, 1);
        }
      }
    }; */

    /* recreate ids for item or all sub-items in duplicated section */
    const drillInForIds = (duplicatedObject, mode) => {
      if (duplicatedObject?.children) {
        for (let iter = 0; iter < duplicatedObject?.children?.length; iter++) {
          const itemObject = duplicatedObject?.children?.[iter];
          if (itemObject.children) {
            drillInForIds(itemObject, mode);
          } else {
            extractedIds.push(itemObject.id);
            if (mode === "duplicate") {
              itemObject.id = v4();
              itemObject.name = `${itemObject.name}-copy`;
              duplicatedIds.push(itemObject.id);
            }
          }
        }
      } else {
        extractedIds.push(duplicatedObject.id);
        if (mode === "duplicate") {
          duplicatedObject.id = v4();
          duplicatedIds.push(duplicatedObject.id);
        }
      }
    };

    const drillInAndUpdate = (
      crumbsFrom,
      crumbsTo,
      indexFrom,
      indexTo,
      isSameSection,
      isNewItem
    ) => {
      const drillStructure = { ...canvasStructure };
      let toMove = crumbsFrom; //  particularly for new item
      let currentA = drillStructure;

      for (
        let level = 0;
        Array.isArray(crumbsFrom) && level < crumbsFrom?.length;
        level++
      ) {
        currentA = currentA?.children?.[crumbsFrom?.[level]];

        /* 
          Removing section requires action to be taken
          on the top level, not the active level 
        */
        if (
          level === crumbsFrom?.length - 2 &&
          ["duplicate", "remove", "makeSingleCell"].includes(action) &&
          type === "section"
        ) {
          if (["duplicate"].includes(action)) {
            toMove = { ...currentA?.children[indexFrom] };
            const objectString = JSON.parse(JSON.stringify(toMove));
            drillInForIds(objectString, "duplicate");
            currentA?.children?.splice(indexFrom + 1, 0, { ...objectString });
          } else {
            [toMove] = currentA?.children?.splice(indexFrom, 1);

            if (["remove"].includes(action)) {
              const objectString = JSON.parse(JSON.stringify(toMove));
              drillInForIds(objectString, "remove");
            } else if (["makeSingleCell"].includes(action)) {
              currentA?.children?.splice(indexFrom, 0, toMove?.children?.[0]);
            }
            // checkPlaceHolderCell(currentA?.children);
          }
          break;
        }

        /* 
          Every other action is taken on active level 
        */
        if (level === crumbsFrom?.length - 1) {
          if (
            [
              "move",
              "remove",
              "makeVerticalGroup",
              "makeHorizantalGroup",
              "makeSingleCell",
            ].includes(action)
          ) {
            [toMove] = currentA?.children?.splice(indexFrom, 1);
          }
          if (["remove"].includes(action)) {
            extractedIds.push(toMove.id);
          }
          if (["duplicate"].includes(action)) {
            toMove = { ...currentA?.children[indexFrom] };
            const objectString = JSON.parse(JSON.stringify(toMove));

            drillInForIds(objectString, "duplicate");
            currentA?.children?.splice(indexFrom + 1, 0, { ...objectString });
          }
          if (["move"].includes(action) && isSameSection) {
            currentA?.children?.splice(indexTo, 0, toMove);
          }
          if (["switchOrientation"].includes(action)) {
            currentA.orientation =
              currentA.orientation === "horizontal" ? "vertical" : "horizontal";
          }
          if (["expandWidth"].includes(action)) {
            currentA.expandWidthCellIndex =
              currentA.expandWidthCellIndex === index ? -1 : index;
          }
          if (["makeVerticalGroup"].includes(action)) {
            currentA?.children?.splice(indexFrom, 0, {
              orientation: "vertical",
              children: [toMove],
            });
          }
          if (["makeHorizantalGroup"].includes(action)) {
            currentA?.children?.splice(indexFrom, 0, {
              orientation: "horizontal",
              children: [toMove],
            });
          }
          if (["updateSectionStyles"].includes(action)) {
            currentA.style = {
              ...currentA.style,
              [property]: parseValue(value),
            };

            dispatch(
              rUieActivateItem({
                ...activeItem,
                sectionStyle: currentA.style,
              })
            );
          }

          // checkPlaceHolderCell(currentA.children);
        }
      }

      if (["move"].includes(action) && !isSameSection) {
        let currentB = drillStructure;
        for (let level = 0; level < crumbsTo?.length; level++) {
          currentB = currentB?.children?.[crumbsTo?.[level]];
          if (level === crumbsTo?.length - 1) {
            currentB?.children?.splice(indexTo, 0, toMove);
            // checkPlaceHolderCell(currentB?.children);
          }
        }
      }

      return { ...drillStructure };
    };

    let workingCanvasStructure = { ...canvasStructure };
    if (["move"].includes(action)) {
      const isSameSection = source?.droppableId === destination?.droppableId;
      const isMasterShift =
        isSameSection && source?.droppableId === "app-container";

      const startIndex = source?.index;
      const endIndex = destination?.index;

      if (isMasterShift) {
        const masterArray = workingCanvasStructure?.children;
        const [removed] = masterArray?.splice(startIndex, 1);
        masterArray?.splice(endIndex, 0, removed);

        workingCanvasStructure.children = masterArray;
      } else {
        let sourceBreakdown;
        let element;

        if (source?.droppableId?.includes("Elements")) {
          isNewItem = true;

          if (source?.droppableId === "searchedElements") {
            element = { ...storedSearchedElements[source.index] };
          } else {
            const sectionElements = [...allElements[source.droppableId]];
            element = sectionElements[source.index];
          }

          sourceBreakdown = {
            id: v4(), //element.name, // ,
            // stored: false,
            itemType: element.type,
          };

          const defaultValues = getDefaultValues(element.type);

          const initValues = defaultValues?.init ? defaultValues : {};

          const newElementName = `${element.type}-${new Date().getTime()}`;
          newItemData = {
            itemRef: sourceBreakdown.id,
            ...element,
            id: null,
            name: newElementName,
            values: initValues,
          };

          payload = {
            action: "add",
            itemRef: sourceBreakdown.id,
            itemName: newElementName,
            itemType: element.type,
            placementBreadcrumb: doBreakdown(destination?.droppableId),
            placementIndex: destination?.index,
            itemValuesInit: {
              toVariable: workflowScreenVariableFieldTypes.includes(
                element.type
              ),
              ...initValues,
            },
          };
          delete payload.itemValuesInit?.init;
        } else {
          sourceBreakdown = doBreakdown(source?.droppableId);
        }

        const destinationBreakdown = doBreakdown(destination?.droppableId);

        workingCanvasStructure = drillInAndUpdate(
          sourceBreakdown,
          destinationBreakdown,
          source.index,
          destination.index,
          isSameSection,
          isNewItem
        );
      }
    } else if (
      [
        "duplicate",
        "remove",
        "switchOrientation",
        "makeVerticalGroup",
        "makeHorizantalGroup",
        "makeSingleCell",
        "expandWidth",
        "updateSectionStyles",
      ].includes(action)
    ) {
      const crumbBreakdown = doBreakdown(breadcrumb);

      workingCanvasStructure = drillInAndUpdate(
        crumbBreakdown,
        null,
        index,
        null,
        null
      );
    }

    dispatch(rUieSetCanvasStructure(workingCanvasStructure));

    let displayMsg,
      affectsWorkflow = true;

    if (isNewItem) {
      //  UPDATE ITEMS STATE
      const currentScreensItems = { ...(screensItems || {}) };
      const currentScreenItems = currentScreensItems?.[activeScreen?.id] || {};
      currentScreenItems[newItemData?.itemRef] = newItemData;
      currentScreensItems[activeScreen?.id] = currentScreenItems;
      dispatch(rUieSetScreensItems(currentScreensItems));

      if (!workflowScreenVariableFieldTypes.includes(newItemData.type)) {
        affectsWorkflow = false;
      }

      displayMsg = "Item added. Screen updated";
    } else if (action === "duplicate") {
      //  UPDATE ITEMS STATE
      const currentScreensItems = { ...(screensItems || {}) };
      const currentScreenItems = currentScreensItems?.[activeScreen?.id] || {};
      duplicatedIds.forEach((id, index) => {
        currentScreenItems[id] = {
          ...currentScreenItems?.[extractedIds?.[index]],
          itemRef: id,
          name: `${currentScreenItems?.[extractedIds?.[index]]?.name} copy`,
        };
      });
      currentScreensItems[activeScreen?.id] = currentScreenItems;
      dispatch(rUieSetScreensItems(currentScreensItems));

      //  SAVE TO DB
      if (type === "cell") {
        payload = {
          action,
          placementBreadcrumb: doBreakdown(breadcrumb),
          placementIndex: index + 1,
          extractedIds,
          duplicatedIds,
        };

        displayMsg = "Item duplicated. Screen updated";
      } else {
        payload = {
          action,
          workingCanvasStructure,
          extractedIds,
          duplicatedIds,
        };

        displayMsg = "Section duplicated. Screen updated";
      }
    } else if (action === "remove") {
      //  UPDATE ITEMS STATE
      const currentScreensItems = { ...(screensItems || {}) };
      const currentScreenItems = currentScreensItems?.[activeScreen?.id] || {};
      extractedIds.forEach((id) => {
        delete currentScreenItems[id];
      });
      currentScreensItems[activeScreen?.id] = currentScreenItems;
      dispatch(rUieSetScreensItems(currentScreensItems));

      //  SAVE TO DB
      if (type === "cell") {
        payload = {
          action,
          placementBreadcrumb: doBreakdown(breadcrumb),
          placementIndex: index,
          extractedIds,
        };

        displayMsg = "Item removed. Screen updated";
      } else {
        payload = {
          action,
          workingCanvasStructure,
          extractedIds,
        };

        displayMsg = "Section removed. Screen updated";
      }
    } else {
      affectsWorkflow = false;
      //  SAVE TO DB
      payload = {
        action,
        workingCanvasStructure,
      };

      displayMsg = "Screen updated";
    }

    //  SAVE TO DB
    const response = await dispatch(
      wrapAPI(updateScreen, displayMsg, {
        id: activeScreen.id,
        ...payload,
        targetType: type || "cell",
        requestSource: "UI Editor",
        category: "Designer",
      })
    );

    /* if action is duplicate, this may involve items with sub-ids
     * update global state with returned new items structures
     */

    if (action === "duplicate") {
      /* if items list is returned from response, update global state */
      const returnedItemsList = response?.data?.data?.items;
      if (returnedItemsList?.length) {
        const newItemsForState = returnedItemsList.reduce((acc, current) => {
          acc[current.itemRef] = current;
          return acc;
        }, {});

        const currentScreensItems = { ...(screensItems || {}) };
        const currentScreenItems = {
          ...(currentScreensItems?.[activeScreen?.id] || {}),
          ...newItemsForState,
        };
        currentScreensItems[activeScreen?.id] = currentScreenItems;

        /* update global state */
        dispatch(rUieSetScreensItems(currentScreensItems));
      }
    }

    if (affectsWorkflow) {
      dispatch(rShouldRefetchWorkflow(true));
    }
  };

export const setActiveItem =
  ({ itemRef, type, sectionStyle, clear = false }) =>
  (dispatch) => {
    if (clear) {
      dispatch(rUieActivateItem({}));
    } else {
      dispatch(rUieActivateItem({ itemRef, type, sectionStyle }));
    }
  };

export const getSearchedElements =
  (searchText) => async (dispatch, getState) => {
    let results = [];

    Object.keys(allElements).forEach((catg) => {
      const catgResults = allElements[catg].filter((element) =>
        element.title.toLowerCase().includes(searchText)
      );
      results.push(...catgResults);
    });

    dispatch(rUieSetSearchedElements(results));
  };

const preWrapUpdateScreenAndItemsAPIs =
  ({
    itemRef,
    value,
    property,
    isGrouped,
    isPage,
    notAffectVariables = true,
  }) =>
  async (dispatch) => {
    dispatch(
      wrapAPI(
        isPage ? updateScreen : updateScreenItem,
        `${isPage ? "Screen" : "Item"} property updated`,
        {
          ...(isPage ? { id: itemRef } : { itemRef }),
          ...(isGrouped ? value : { [property]: value }),
          ...(!notAffectVariables ? { notAffectVariables: false } : {}),
          requestSource: "UI Editor",
          category: "Designer",
          showNotification: { dispatch },
        }
      )
    );
  };

export const updateScreenItemPropertyValues =
  ({
    value,
    property,
    itemRef,
    root,
    type,
    isRootValue,
    isPage,
    notAffectVariables = true,
  }) =>
  (dispatch, getState) => {
    const { screensItems } = getState().uieditor;
    const {
      activeScreen: { id: activeScreenId },
      screensList,
    } = getState().screens;

    if (isPage) {
      let updatedActiveScreen;
      const currentScreensList = [...screensList].map((screen) => {
        // let currentScreen = screen;
        if (screen.id === activeScreenId) {
          screen.values = {
            ...screen.values,
            ...(root
              ? {
                  [root]: {
                    ...screen.values?.[root],
                    [property]: parseValue(value),
                  },
                }
              : { [property]: parseValue(value) }),
          };
          updatedActiveScreen = { ...screen };
        }

        return screen;
      });

      dispatch(rSaveActiveScreen(updatedActiveScreen));
      dispatch(rUpdateScreensList(currentScreensList));
    } else {
      let currentItem = screensItems?.[activeScreenId]?.[itemRef];
      currentItem = {
        ...currentItem,
        ...(isRootValue
          ? { [property]: value }
          : {
              values: {
                ...currentItem?.values,
                [property]: value,
              },
            }),
      };
      screensItems[activeScreenId][itemRef] = currentItem;
      dispatch(rUieSetScreensItems(screensItems));
    }

    //  SAVE TO DB (no-waiting)
    property = `${
      root
        ? `values.${root}.${property}`
        : !isRootValue
        ? `values.${property}`
        : property
    }`;
    // property = `style.${root ? `${root}.` : ""}${property}`;
    dispatch(
      preWrapUpdateScreenAndItemsAPIs({
        itemRef,
        value,
        property,
        isPage,
        notAffectVariables,
      })
    );

    if (
      property === "values.value" &&
      workflowScreenUnitTextTypes.includes(type)
    ) {
      // using regex check if value has a word that starts with @,
      const regex = /(?<!\S)@[a-zA-Z0-9_-]+/;
      const match = value.match(regex);
      if (match) {
        notAffectVariables = false;
      }
    }

    if (["name", "dataType"].includes(property) || !notAffectVariables) {
      dispatch(rShouldRefetchWorkflow(true));
    }
  };

export const updateScreenItemStyles =
  ({ itemRef, value, root, property, itemType, isPage }) =>
  (dispatch, getState) => {
    const { screensItems } = getState().uieditor;
    const {
      activeScreen: { id: activeScreenId },
      screensList,
    } = getState().screens;

    if (isPage) {
      let updatedActiveScreen;
      const currentScreensList = [...screensList].map((screen) => {
        // let currentScreen = { ...screen };
        if (screen.id === activeScreenId) {
          screen = {
            ...screen,
            style: {
              ...screen?.style,
              page: {
                ...screen?.style?.page,
                ...(root
                  ? {
                      [root]: {
                        ...screen.style?.page?.[root],
                        [property]: parseValue(value),
                      },
                    }
                  : { [property]: parseValue(value) }),
              },
            },
          };
          updatedActiveScreen = { ...screen };
        }

        return screen;
      });

      dispatch(rSaveActiveScreen(updatedActiveScreen));
      dispatch(rUpdateScreensList(currentScreensList));
    } else {
      let currentItem = screensItems?.[activeScreenId]?.[itemRef];
      currentItem = {
        ...currentItem,
        style: {
          ...currentItem?.style,
          ...(root
            ? {
                [root]: {
                  ...currentItem.style?.[root],
                  [property]: parseValue(value),
                },
              }
            : { [property]: parseValue(value) }),
        },
      };

      screensItems[activeScreenId][itemRef] = currentItem;
      dispatch(rUieSetScreensItems(screensItems));
    }

    //  SAVE TO DB (no-waiting)
    value = parseValue(value);
    property = `style.${isPage ? `page.` : ""}${
      root ? `${root}.` : ""
    }${property}`;

    dispatch(
      preWrapUpdateScreenAndItemsAPIs({ itemRef, value, property, isPage })
    );
  };

export const copyScreenStyles =
  (fromScreen, toScreen) => (dispatch, getState) => {
    const { activeScreen, screensList } = getState().screens;

    const sourceStyles = screensList.find(
      (screen) => screen.id === fromScreen
    )?.style;

    const newScreensList = screensList.map((screen) => {
      if (screen.id === toScreen) {
        screen.style = { ...sourceStyles };
      }

      return screen;
    });

    const newActiveScreen = { ...activeScreen, style: { ...sourceStyles } };

    dispatch(rSaveActiveScreen(newActiveScreen));
    dispatch(rUpdateScreensList(newScreensList));

    //  SAVE TO DB (no-waiting)
    dispatch(
      preWrapUpdateScreenAndItemsAPIs({
        itemRef: toScreen,
        value: sourceStyles,
        property: "style",
        isPage: true,
      })
    );
  };

export const createAndAddScreen =
  (screenType) => async (dispatch, getState) => {
    const { selectedApp } = getState().appsReducer;
    const { screensList } = getState().screens;

    const prefix = screenType === "app" ? "Screen" : "Document";
    let counter = 0,
      newName,
      foundName = false;

    do {
      counter++;
      newName = `${prefix} ${counter}`;
      for (let intr = 0; intr < screensList.length; intr++) {
        const screen = screensList[intr];
        foundName =
          screen.name?.toLowerCase().trim() === newName?.toLowerCase().trim();
        if (foundName) {
          break;
        }
      }
    } while (foundName);

    const { success, data } = await dispatch(
      wrapAPI(createScreen, `New ${screenType} screen created`, {
        app: selectedApp?.id || selectedApp?._id,
        type: screenType,
        name: newName,
      })
    );

    if (success) {
      screensList.unshift(data?.data);
      dispatch(rUpdateScreensList(screensList));
    }
  };

export const duplicateAndAddScreen =
  (screenId) => async (dispatch, getState) => {
    const { success, data } = await dispatch(
      wrapAPI(duplicateScreen, "Screen duplication complete", { id: screenId })
    );

    if (success) {
      dispatch(rUpdateScreensList(data?.data));
    }
  };

export const deleteScreenAndUpdate =
  (screenId) => async (dispatch, getState) => {
    const { success, data } = await dispatch(
      wrapAPI(deleteScreen, "Screen delete complete", { id: screenId })
    );

    if (success) {
      dispatch(rUpdateScreensList(data?.data));
    }
  };

export const clearUIEditorCanvas = () => async (dispatch, getState) => {
  const { screensItems, canvasStructure } = getState().uieditor;
  const { activeScreen, screensList } = getState().screens;

  screensItems[activeScreen.id] = [];
  canvasStructure.children = [
    {
      orientation: "vertical",
      children: [],
    },
  ];
  activeScreen.layout.children = [
    {
      orientation: "vertical",
      children: [],
    },
  ];
  const newScreensList = screensList.map((screen) => {
    if (screen.id === activeScreen.id) {
      screen.layout.children = [
        {
          orientation: "vertical",
          children: [],
        },
      ];
    }
    return screen;
  });

  // dispatch(rSaveActiveScreen(screensItems));
  dispatch(rUieSetCanvasStructure(canvasStructure));
  dispatch(rSaveActiveScreen(activeScreen));
  dispatch(rUpdateScreensList(newScreensList));
  dispatch(rHideRightSideBar(true));
  dispatch(rShouldRefetchWorkflow(true));

  //  SAVE TO DB (no-waiting)
  dispatch(
    wrapAPI(clearScreenItemsAPI, `Screen canvas cleared`, {
      id: activeScreen.id,
      requestSource: "UI Editor",
      category: "Designer",
    })
  );
};

export const reloadScreen =
  (appId, syncItems) => async (dispatch, getState) => {
    dispatch(rUieSetCanvasStructure({}));
    dispatch(getAllScreens(appId, true, null, null, syncItems));
    // dispatch(getAllScreens(appId, true));
  };

const parseValue = (value) => {
  return isNotNumber(value) ? value : parseFloat(value, 10);
};

const isNotNumber = (value) => {
  if (typeof value === "boolean") {
    return true;
  }
  if (!value) {
    return 1;
  }
  return isNaN(value);
};

const imageIconWidthResize = (defaultValue, containerSize) => {
  if (isNotNumber(containerSize)) {
    return defaultValue;
  }
  if (containerSize / COMPONENT_CONTAINER_ADJUSTER > defaultValue) {
    return defaultValue;
  }
  return containerSize / 1.2;
};
