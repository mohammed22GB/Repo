import _ from "lodash";
import {
  setDropZone,
  registerElements,
  setCanvasItems,
  activateElement,
  onChangeStyles,
  rToggleUIEditorFullScreen,
  loadScreenStyle,
  loadCustomElements,
  loadCanvasItems,
} from "../../../../../store/actions/properties";
import {
  defaultData,
  defaultStyles,
  getDefaultValues,
} from "./defaultScreenStyles";
import { allElements } from "./elementsList";
import {
  createItem,
  deleteItem,
  updateItem,
  handleExplicitUpdate,
  reorderElementsOnCanvas,
} from "./CanvasAPIs";
import {
  clearScreenItemsAPI,
  updateScreen,
} from "../../../Pages/Screens/screenAPIs";
import { defaultFormStyles } from "./defaultFormStyles";
import { SetAppStatus } from "../../../../../helpers/helperFunctions";
import { loadScreenProperties } from "../../Screens/utils/screenLoadProperties";
import { v4 } from "uuid";
import { COMPONENT_CONTAINER_ADJUSTER } from "../../../../common/utils/constants";

export const toggleUIEditorFullScreen = () => (dispatch, getState) => {
  console.log(`2 - - T O G G L I N G  F U L L  S C R E E N`);
  const { uiEditorFullScreen } = getState().uieditor;
  dispatch(rToggleUIEditorFullScreen(!uiEditorFullScreen));
  console.log(`4 - - T O G G L I N G  F U L L  S C R E E N`);
};

export const setDroppableZone = (data) => (dispatch) => {
  //  set drop zone for dragged elements
  dispatch(setDropZone(data));
};

const hasForm = (array) => {
  return array?.find((value) => value?.type?.toLowerCase() === "form");
};

const hasInputTable = (array) => {
  return array.find((value) => value?.type === "inputTable");
};

const dropElementOnUICanvas =
  ({ type, source, destination }) =>
  async (dispatch, getState) => {
    if (type !== "drop") {
      return;
    }

    const {
      appsReducer: { selectedApp },
      screens: { activeScreen },
      uieditor: { canvasItems },
    } = getState();

    const sectionElements = [...allElements([source.droppableId], {})];
    const element = sectionElements[source.index];

    const style = { overrideDefault: false };
    element.style = style;

    const defaultValues = getDefaultValues(element.type);
    if (!!defaultValues) {
      const values = { ...defaultValues };
      element.values = values;
    }

    let componentsSelection;

    const component = dispatch(
      copyElement({
        source: sectionElements,
        destination: canvasItems,
        droppableSource: source,
        droppableDestination: destination,
      })
    );

    const arrangedComponents = arrangeComponentsIndex(component);

    if (element.type === "header") {
      const componentIndex = arrangedComponents.findIndex(
        (v) => v.type === "header"
      );
      componentsSelection = {
        activeComponents: {
          index: componentIndex,
          type: element.type,
          // id: component[componentIndex]?.id,
          parent: destination.droppableId,
        },
        mode: "single",
      };
    } else {
      componentsSelection = {
        activeComponents: {
          type: element.type,
          parent: destination.droppableId,
          index: arrangedComponents.findIndex((v) => v.id === element.id),
          // id: element.id,
        },
        mode: "single",
      };
    }
    dispatch(setCanvasItems([...arrangedComponents]));
    dispatch(activateElement({ componentsSelection }));
    const { data, success } = await preAPIs(
      dispatch,
      createItem,
      "Item created",
      {
        app: selectedApp.id || selectedApp._id,
        screen: activeScreen.id,
        items: arrangedComponents,
      }
    );

    // This codeblock checks waits patiently for the item to be created successfully
    // before updating the respective id to allow updates later on.
    // This was done to improve user experience, users won't necessarily wait till
    // item is created before interacting with them.

    if (success) {
      const createdItemIndex = arrangedComponents.findIndex(
        (v) => v.id === element.id
      );
      arrangedComponents[createdItemIndex] = data?.data;
      dispatch(setCanvasItems([...arrangedComponents]));
    } else {
      return;
    }

    let hasForm_;

    if (hasForm(arrangedComponents) || hasInputTable(arrangedComponents)) {
      const screenButtonIndex = arrangedComponents.findIndex(
        (v) => v.type === "ScreenButtons"
      );
      if (
        screenButtonIndex !== -1 &&
        arrangedComponents[screenButtonIndex]?.values?.button2Text === "Next"
      ) {
        const { success, data } = await preAPIs(
          dispatch,
          handleExplicitUpdate,
          "Item updated",
          {
            // ...arrangedComponents[screenButtonIndex],
            id: arrangedComponents[screenButtonIndex]?.id,
            values: {
              ...arrangedComponents[screenButtonIndex].values,
              button2Text: "Submit",
              button2Type: "submit",
            },
            // itemsOrder: arrangedComponents.map((v) => v.id),
            // dispatch,
          }
        );

        if (success) {
          hasForm_ = true;
          arrangedComponents[screenButtonIndex] = data?.data;
          dispatch(setCanvasItems([...arrangedComponents]));
        }
      }
    } else {
      if (
        arrangedComponents?.[arrangedComponents.length - 1]?.values
          ?.button2Text === "Submit"
      ) {
        const { success, data } = await preAPIs(
          dispatch,
          handleExplicitUpdate,
          "Item updated",
          {
            // ...arrangedComponents[arrangedComponents.length - 1],
            values: {
              ...arrangedComponents[arrangedComponents.length - 1].values,
              button2Text: "Next",
              button2Type: "button",
            },
            // itemsOrder: arrangedComponents.map((v) => v.id),
            // dispatch,
          }
        );

        if (success) {
          hasForm_ = false;
          arrangedComponents[arrangedComponents.length - 1] = data?.data;
          dispatch(setCanvasItems([...arrangedComponents]));
        }
      }
    }
  };

const arrangeComponentsIndex = (components) =>
  components.map((component, index) => {
    component.index = index;
    return component;
  });

const reorderElementsOnUICanvas =
  ({ type, source, destination }) =>
  async (dispatch, getState) => {
    if (type !== "reorder") {
      return null;
    }

    const {
      appsReducer: { selectedApp },
      screens: { activeScreen },
      uieditor: { canvasItems },
    } = getState();

    const component = reorderElements({
      list: canvasItems,
      startIndex: source?.index,
      endIndex: destination?.index,
    });

    const arrangedComponents = arrangeComponentsIndex(component);

    const componentIndex = destination?.index;

    const componentsSelection = {
      activeComponents: {
        type: arrangedComponents[componentIndex]?.type,
        parent: source.droppableId,
        index: componentIndex,
        id: arrangedComponents[componentIndex]?.id,
      },
      mode: "single",
    };

    dispatch(setCanvasItems([...arrangedComponents]));
    dispatch(activateElement({ componentsSelection }));
    preAPIs(dispatch, reorderElementsOnCanvas, "Items updated", {
      body: {
        index: componentIndex,
        id: canvasItems[source?.index]?.id,
        screen: activeScreen.id,
      },
    });
  };

export const canvasRegisterElement =
  ({ source, destination, type }) =>
  (dispatch) => {
    dispatch(dropElementOnUICanvas({ type, source, destination }));
    dispatch(reorderElementsOnUICanvas({ type, source, destination }));
  };
export const canvasDeRegisterElement =
  ({ container, parent, id, index }) =>
  async (dispatch, getState) => {
    const state = getState().uieditor;
    const { canvasItems } = { ...state };
    let editingContainer;
    let componentsSelection = {};
    let deletingElement;
    if (parent) {
      editingContainer = canvasItems[container].filter(
        (value) => value.id !== id
      );
      deletingElement = canvasItems[container][index];
      if (canvasItems[container][index + 1]) {
        componentsSelection = generateActiveComponent({
          type: canvasItems[container][index + 1].type,
          parent: container,
          index,
          id: canvasItems[container][index + 1].id,
        });
      } else if (canvasItems[container][index - 1]) {
        componentsSelection = generateActiveComponent({
          type: canvasItems[container][index - 1].type,
          parent: container,
          index,
          id: canvasItems[container][index - 1].id,
        });
      } else {
        componentsSelection = generateActiveComponent();
      }
    } else {
      editingContainer = canvasItems.filter((value) => value.id !== id);
      deletingElement = canvasItems[index];
      if (canvasItems[index + 1]) {
        componentsSelection = generateActiveComponent({
          type: canvasItems[index + 1].type,
          parent: container,
          index,
          id: canvasItems[index + 1].id,
        });
      } else if (canvasItems[index - 1]) {
        componentsSelection = generateActiveComponent({
          type: canvasItems[index - 1].type,
          parent: container,
          index,
          id: canvasItems[index - 1].id,
        });
      } else {
        componentsSelection = generateActiveComponent({});
      }
    }

    function generateActiveComponent({
      type = "info",
      parent = null,
      index = null,
      id = "info",
      mode = "single",
    }) {
      return {
        componentsSelection: {
          activeComponents: { type, parent, index, id },
          mode,
        },
      };
    }
    const canvasItemToSave = [...editingContainer];
    dispatch(setCanvasItems(canvasItemToSave, {}));

    let hasForm_;

    if (hasForm(editingContainer) || hasInputTable(editingContainer)) {
      if (
        editingContainer?.[editingContainer.length - 1]?.values?.button2Text ===
        "Next"
      ) {
        const { success, data } = await preAPIs(
          dispatch,
          handleExplicitUpdate,
          "Item updated",
          {
            ...editingContainer[editingContainer.length - 1],
            values: {
              ...editingContainer[editingContainer.length - 1].values,
              button2Text: "Submit",
              button2Type: "submit",
            },
            itemsOrder: editingContainer.map((v) => v.id),
            dispatch,
          }
        );

        if (success) {
          hasForm_ = true;
          editingContainer[editingContainer.length - 1] = data?.data;
          dispatch(setCanvasItems([...editingContainer]));
        }
      }
    } else {
      if (
        editingContainer?.[editingContainer.length - 1]?.values?.button2Text ===
        "Submit"
      ) {
        const { success, data } = await preAPIs(
          dispatch,
          handleExplicitUpdate,
          "Item updated",
          {
            ...editingContainer[editingContainer.length - 1],
            values: {
              ...editingContainer[editingContainer.length - 1].values,
              button2Text: "Next",
              button2Type: "button",
            },
            itemsOrder: editingContainer.map((v) => v.id),
            dispatch,
          }
        );

        if (success) {
          hasForm_ = false;
          editingContainer[editingContainer.length - 1] = data?.data;
          dispatch(setCanvasItems([...editingContainer]));
        }
      }
    }

    //  save constructed canvas to db
    const response = await preAPIs(
      dispatch,
      deleteItem,
      "Item deleted",
      deletingElement?.id
    );

    if (response.success) {
      // Set the next or previous element as active after removing
      dispatch(activateElement({ componentsSelection }));
    }
    return;
  };

export const duplicateCanvasItem =
  ({ container, id, index }) =>
  (dispatch, getState) => {
    const state = getState().uieditor;

    const { canvasItems } = state;

    const duplicateComponent = _.cloneDeep(canvasItems[index]);
    duplicateComponent.id = `${
      duplicateComponent.type
    }-${new Date().getTime()}`;
    duplicateComponent.name = `${duplicateComponent.name}-copy`;
    duplicateComponent.index = index + 1;
    delete duplicateComponent._id;

    if (duplicateComponent.type === "inputTable") {
      /* regenerate column n cell ids */
      duplicateComponent.values.columns =
        duplicateComponent?.values?.columns?.map((column) => {
          column.id = v4();
          return column;
        });
      duplicateComponent.values.aggregateCells =
        duplicateComponent?.values?.aggregateCells?.map((cell) => {
          cell.id = v4();
          return cell;
        });
    }

    canvasItems.splice(index + 1, 0, { ...duplicateComponent });
    dispatch(onChangeStyles([...canvasItems]));

    //  save constructed canvas to db
    preAPIs(dispatch, createItem, "Item duplicated", {
      app: duplicateComponent.app,
      screen: duplicateComponent.screen,
      items: canvasItems,
    });
  };

export const setActiveItem =
  ({
    item,
    parent,
    index,
    containerType,
    containingChildIndex,
    isInsideContainer,
  }) =>
  (dispatch) => {
    dispatch(
      activateElement({
        componentsSelection: {
          activeComponents: {
            type: item?.type,
            parent,
            index,
            id: item?.id,
            containerType,
            containingChildIndex,
            isInsideContainer,
          },
          mode: "single",
        },
      })
    );
  };

export const reorderContainerContent =
  ({ index, source, destination }) =>
  (dispatch, getState) => {
    const state = getState().uieditor;
    const { canvasItems } = { ...state };
    const list = canvasItems?.[index].children;

    if (!(list && list.length)) {
      return null;
    }
    const component = reorderElementsInContainer({
      list,
      startIndex: source.index,
      endIndex: destination.index,
    });
    canvasItems[index].children = component;
    dispatch(onChangeStyles([...canvasItems]));

    //  save constructed canvas to db
    preAPIs(dispatch, updateItem, "Item updated", {
      ...canvasItems[index],
      itemsOrder: canvasItems.map((v) => v.id),
      dispatch,
    });
  };

export const deleteContainerElement =
  ({ containerIndex, parent, containingChildId, containingChildIndex }) =>
  (dispatch, getState) => {
    const state = getState().uieditor;
    const { canvasItems } = { ...state };
    const container = canvasItems?.[containerIndex];
    // const deletingChild = container?.children?.[containingChildIndex]
    container.children = [
      ...container.children.filter((t) => t.id !== containingChildId),
    ];
    canvasItems[containerIndex] = container;

    dispatch(onChangeStyles([...canvasItems]));

    //  save constructed canvas to db
    preAPIs(dispatch, updateItem, "Item updated", {
      ...container,
      itemsOrder: canvasItems.map((v) => v.id),
      dispatch,
    });

    // Set the next or previous element as active after removing
    if (container?.children?.[containingChildIndex]) {
      return dispatch(
        activateElement({
          componentsSelection: {
            activeComponents: {
              type: container?.children?.[containingChildIndex]?.type,
              parent,
              index: containerIndex,
              id: container?.children?.[containingChildIndex].id,
              containerType: container.type,
              containingChildIndex,
              isInsideContainer: true,
            },
            mode: "single",
          },
        })
      );
    }
    if (container?.children?.[containingChildIndex + 1]) {
      return dispatch(
        activateElement({
          componentsSelection: {
            activeComponents: {
              type: container?.children?.[containingChildIndex + 1]?.type,
              parent,
              index: containerIndex,
              id: container?.children?.[containingChildIndex + 1].id,
              containerType: container.type,
              containingChildIndex,
              isInsideContainer: true,
            },
            mode: "single",
          },
        })
      );
    }
    if (container?.children?.[containingChildIndex - 1]) {
      return dispatch(
        activateElement({
          componentsSelection: {
            activeComponents: {
              type: container?.children?.[containingChildIndex - 1]?.type,
              parent,
              index: containerIndex,
              id: container?.children?.[containingChildIndex - 1].id,
              containerType: container.type,
              containingChildIndex,
              isInsideContainer: true,
            },
            mode: "single",
          },
        })
      );
    }
    return dispatch(
      activateElement({
        componentsSelection: {
          activeComponents: {
            type: container.type,
            parent,
            index: containerIndex,
            id: container.id,
            containerType: container.type,
            containingChildIndex: null,
            isInsideContainer: false,
          },
          mode: "single",
        },
      })
    );
  };
export const duplicateContainerElement =
  ({ containerIndex, parent, containingChildIndex }) =>
  (dispatch, getState) => {
    const state = getState().uieditor;
    const { canvasItems } = { ...state };
    const container = canvasItems?.[containerIndex];

    const duplicateComponent = _.cloneDeep(
      container?.children?.[containingChildIndex]
    );
    duplicateComponent.id = `${
      duplicateComponent.type
    }-${new Date().getTime()}`;
    duplicateComponent.name = `${duplicateComponent.name}-copy`;
    container.children.splice(containingChildIndex + 1, 0, duplicateComponent);
    canvasItems[containerIndex] = container;
    dispatch(onChangeStyles([...canvasItems]));

    //  save constructed canvas to db
    preAPIs(dispatch, updateItem, "Item updated", {
      ...container,
      itemsOrder: canvasItems.map((v) => v.id),
      dispatch,
    });
  };

export const selectElements = (type, id, ctrlKey) => (dispatch, getState) => {
  const state = getState().uieditor;
  const { componentsSelection } = state;
  let slctn = { ...componentsSelection.activeComponents },
    mode = "none";

  if (ctrlKey) {
    if (slctn[id]) {
      delete slctn[id];
    } else {
      slctn[id] = type;
    }

    if (Object.keys(slctn).length > 1) {
      mode = "multi";
    } else if (Object.keys(slctn).length) {
      mode = "single";
    }
  } else {
    if (id) {
      slctn = { [id]: type };
      mode = "single";
    } else {
      slctn = {};
      mode = "none";
    }
  }
};

export const canvasActivityUndoRedo = (direction) => (dispatch, getState) => {
  const state = getState().uieditor;
  const { canvasItems, canvasActivity, activityHistory, undoCursor } = state;

  const curr = undoCursor + direction;
  const newState = activityHistory[curr] || [];

  //  save canvas items to memory
  dispatch(
    registerElements({
      undoMode: true,
      undoCursor: curr,
      canvasActivity,
      activityHistory,
    })
  );

  // sets canvas items on canvas
  dispatch(setCanvasItems(newState, null));

  //  save constructed canvas to db
  saveCanvas(newState);
};

export const clearUIEditorCanvas = () => async (dispatch, getState) => {
  const {
    activeScreen: { id: screenId },
  } = getState().screens;

  const saved = await preAPIs(
    dispatch,
    clearScreenItemsAPI,
    "Canvas cleared successfully",
    { id: screenId }
  );

  if (!saved) {
    return;
  }

  dispatch(setCanvasItems([]));
  dispatch(
    activateElement({
      componentsSelection: { activeComponents: {}, mode: "none" },
    })
  );

  await dispatch(loadScreenProperties());
};

export const liveClearCanvas = () => (dispatch) => {
  const canvasItems = {};

  // sets canvas items on canvas
  dispatch(setCanvasItems(canvasItems, null));
};
export const liveLoadCanvas = (nowCanvasItems) => (dispatch) => {
  const canvasItems = nowCanvasItems;

  // sets canvas items on canvas
  dispatch(setCanvasItems(canvasItems, null));
};

export const updateContainerChildren =
  ({ type, elementsCategory, index }) =>
  (dispatch, getState) => {
    const canvasItems = [...getState().uieditor.canvasItems];
    let component = {
      ...allElements(elementsCategory).find((t) => t.type === type),
    };
    if (!component) {
      return;
    }
    const style = { overrideDefault: false };

    component.style = style;
    component.values = { ...getDefaultValues(type) };
    component.data = [...defaultData[type]];
    canvasItems[index].children = [...canvasItems[index]?.children, component];
    const payloadUpdateObject = {
      id: canvasItems?.[index]?.id,
      children: canvasItems[index].children,
    };

    let style_ = {};

    if (!canvasItems?.[index]?.style) {
      style_ = {
        ...defaultFormStyles,
      };
      canvasItems[index] = {
        ...canvasItems[index],
        style: style_,
      };
    } else if (!canvasItems?.[index]?.style?.form) {
      style_ = {
        ...canvasItems[index].style,
        ...defaultFormStyles,
      };
      canvasItems[index].style = style_;
    }

    payloadUpdateObject.style = style_;

    dispatch(onChangeStyles(canvasItems));

    preAPIs(dispatch, updateItem, "Item updated", {
      // ...canvasItems[index],
      ...payloadUpdateObject,
      itemsOrder: canvasItems.map((v) => v.id),
      dispatch,
    });
  };
export const updateFormsComponents =
  ({ type, container, containerIndex, elementsCategory }) =>
  (dispatch, getState) => {
    const canvasItems = { ...getState().uieditor.canvasItems };
    let component = allElements(elementsCategory).find((t) => t.type === type);
    if (!component) {
      return;
    }

    dispatch(onChangeStyles(canvasItems));

    preAPIs(dispatch, updateItem, "Item updated", {
      ...canvasItems[container],
      itemsOrder: canvasItems.map((v) => v.id),
      dispatch,
    });
  };
export const updateStylesAndValues =
  ({
    value,
    parent,
    property,
    id,
    type,
    changeType,
    container,
    index,
    isInsideContainer,
    containingChildIndex,
  }) =>
  (dispatch, getState) => {
    const canvasItems = [...getState().uieditor.canvasItems];
    let editingComponent;
    if (isInsideContainer) {
      editingComponent = {
        ...canvasItems?.[index]?.children?.[containingChildIndex],
      };
    } else {
      editingComponent = { ...canvasItems[index] };
    }

    let style = editingComponent.style;
    let valu = editingComponent.value;

    if (type === "video" && (property === "width" || property === "height")) {
      style.imageIcon = {
        ...style.imageIcon,
        width: imageIconWidthResize(80, value),
      };
    }
    if (type === "image" && (property === "width" || property === "height")) {
      style.imageIcon = {
        ...style.imageIcon,
        width: imageIconWidthResize(159, value),
      };
    }
    if (parent === "switch_base") {
      style[parent] = {
        ...style[parent],
        "&.Mui-disabled": parseValue(value),
      };
      style[parent] = {
        ...style[parent],
        "&.Mui-checked": parseValue(value),
      };
      style[parent] = {
        ...style[parent],
        "&.Mui-checked + .MuiSwitch-track": parseValue(value),
      };
      style.switch_track = {
        ...style.switch_track,
        backgroundColor: parseValue(value),
      };
    }

    // ChangeType allows you to add custom changes
    if (["dropdown", "checkbox", "radio"].includes(type) && !!changeType) {
      if (parent === "values" && property === "options") {
        switch (changeType) {
          case "add":
            valu.options = [...valu.options, value];
            break;

          case "remove":
            [...valu.options].splice(
              [...valu.options].findIndex((f) => f.id === value.id),
              1
            );
            break;

          case "change":
            valu.options = [...valu.options].map((f) =>
              f.id === value.id ? value : f
            );
            break;

          default:
            break;
        }

        if (isInsideContainer) {
          canvasItems[container][index].style.values.children[
            containingChildIndex
          ].values = valu;
        } else {
          canvasItems[container][index].values = valu;
        }
      } else {
        if (changeType === "add") {
          style[parent] = {
            ...style[parent],
            [property]: [...style[parent][property], value],
          };
        }
        if (changeType === "remove") {
          style[parent] = {
            ...style[parent],
            [property]: style[parent][property].filter(
              ({ id }) => id !== value
            ),
          };
        }
        if (changeType === "change") {
          style[parent][property][value.index].value = value.value;
        }
        if (isInsideContainer) {
          canvasItems[container][index].style.values.children[
            containingChildIndex
          ].style = style;
        } else {
          canvasItems[container][index].style = style;
        }
      }
    }
  };

export const updateData =
  ({
    value,
    action,
    index,
    isInsideContainer,
    containingChildIndex,
    component,
  }) =>
  (dispatch, getState) => {
    const canvasItems = [...getState().uieditor.canvasItems];
    if (isInsideContainer) {
      if (component === "currency") {
        if (action === "add") {
          console.log(canvasItems[index].children[containingChildIndex].data);
          canvasItems[index].children[containingChildIndex].data = value;
        }
        if (action === "remove") {
          const data = canvasItems?.[index]?.children?.[
            containingChildIndex
          ]?.data?.filter((v) => v !== value);
          canvasItems[index].children[containingChildIndex].data = data;
        }
      } else {
        switch (action) {
          case "onChange":
            canvasItems[index].children[containingChildIndex].data[
              value.index
            ].value = value.value;
            break;
          case "add":
            canvasItems?.[index]?.children?.[containingChildIndex]?.data?.push(
              value
            );
            break;
          case "remove":
            canvasItems?.[index]?.children?.[
              containingChildIndex
            ]?.data?.splice(value.index, 1);
            break;
          default:
            break;
        }
      }

      dispatch(onChangeStyles([...canvasItems]));
      //  save constructed canvas to db
      saveCanvas([...canvasItems]);
      //console.log(`6========`);
      preAPIs(dispatch, updateItem, "Item updated", {
        ...canvasItems[index],
        itemsOrder: canvasItems.map((v) => v.id),
        dispatch,
      });
    }
  };
export const updateStyles =
  ({
    value,
    root,
    property,
    index,
    isInsideContainer,
    containingChildIndex,
    type,
    isGeneral,
  }) =>
  (dispatch, getState) => {
    const canvasItems = [...getState().uieditor.canvasItems];
    if (isInsideContainer) {
      if (type === "video" && (property === "width" || property === "height")) {
        canvasItems[index].children[containingChildIndex].style.imageIcon[
          "width"
        ] = imageIconWidthResize(80, value);
      }
      if (type === "image" && (property === "width" || property === "height")) {
        canvasItems[index].children[containingChildIndex].style.imageIcon[
          "width"
        ] = imageIconWidthResize(159, value);
      }
      if (root === "switch_base") {
        canvasItems[index].children[containingChildIndex].style[root] = {
          ...canvasItems[index].children[containingChildIndex].style[root],
          "&.Mui-disabled": parseValue(value),
          "&.Mui-checked": parseValue(value),
          "&.Mui-checked + .MuiSwitch-track": parseValue(value),
        };
        canvasItems[index].children[containingChildIndex].style[
          "switch_track"
        ] = {
          ...canvasItems[index].children[containingChildIndex].style[
            "switch_track"
          ],
          backgroundColor: parseValue(value),
        };
      }
      canvasItems[index].children[containingChildIndex].style[root][property] =
        parseValue(value);
    } else {
      if (type === "video" && (property === "width" || property === "height")) {
        canvasItems[index].style.imageIcon.width = imageIconWidthResize(
          80,
          value
        );
      }
      if (type === "image" && (property === "width" || property === "height")) {
        canvasItems[index].style.imageIcon.width = imageIconWidthResize(
          159,
          value
        );
      }
      if (root === "switch_base") {
        canvasItems[index].style[root] = {
          ...canvasItems[index].style[root],
          "&.Mui-disabled": parseValue(value),
          "&.Mui-checked": parseValue(value),
          "&.Mui-checked + .MuiSwitch-track": parseValue(value),
        };
        canvasItems[index].style.switch_track = {
          ...canvasItems[index].style.switch_track,
          backgroundColor: parseValue(value),
        };
      }

      if (!!isGeneral) {
        /* from sidebarstyles: apply style to all screen items */
        canvasItems.forEach((canvasItem) => {
          if (!canvasItem.style?.[root]) {
            canvasItem.style = {
              ...canvasItem.style,
              ...defaultFormStyles,
              [root]: {
                [property]: parseValue(value),
              },
            };
          } else if (!canvasItem.style?.[root]?.[property]) {
            canvasItem.style[root] = {
              ...canvasItem.style?.[root],
              [property]: parseValue(value),
            };
          } else {
            canvasItem.style[root][property] = parseValue(value);
          }

          preAPIs(dispatch, updateItem, "Item updated", {
            ...canvasItem,
            itemsOrder: canvasItems.map((v) => v.id),
            dispatch,
          });
        });
      } else {
        if (!canvasItems?.[index]?.style?.[root]) {
          canvasItems[index].style = {
            ...canvasItems?.[index]?.style,
            ...defaultFormStyles,
            [root]: {
              [property]: parseValue(value),
            },
          };
        } else if (!canvasItems?.[index]?.style?.[root]?.[property]) {
          canvasItems[index].style[root] = {
            ...canvasItems?.[index]?.style?.[root],
            [property]: parseValue(value),
          };
        } else {
          canvasItems[index].style[root][property] = parseValue(value);
        }

        //console.log(`8========`);
        preAPIs(dispatch, updateItem, "Item updated", {
          ...canvasItems[index],
          itemsOrder: canvasItems.map((v) => v.id),
          dispatch,
        });
      }
    }
    dispatch(onChangeStyles([...canvasItems]));
    //  save constructed canvas to db
    saveCanvas([...canvasItems]);
  };

export const updateDocStyles =
  ({ value, root, property }) =>
  async (dispatch, getState) => {
    const { screenStyles } = getState().uieditor;
    const { activeScreen } = getState().screens;

    const newScreenStyle = {
      ...screenStyles,
      ...(root === "screen"
        ? { [property]: parseValue(value) }
        : {
            [root]: {
              ...screenStyles[root],
              [property]: parseValue(value),
            },
          }),
    };

    dispatch(loadScreenStyle(newScreenStyle));
    //  save constructed canvas to db
    const { success } = await preAPIs(
      dispatch,
      updateScreen,
      "Document updated",
      {
        id: activeScreen.id,
        style: newScreenStyle,
      }
    );
  };

export const updateScreenStyles =
  ({ value, root, property, type }) =>
  async (dispatch, getState) => {
    const { screenStyles } = getState().uieditor;
    const { activeScreen } = getState().screens;

    let newScreenStyle;

    if (type === "reset_defaults") {
      newScreenStyle = defaultStyles(activeScreen.type);
    } else {
      newScreenStyle = {
        [root]: {
          ...screenStyles[root],
          [property]: parseValue(value),
        },
      };
    }
    const allStyle = {
      ...screenStyles,
      ...newScreenStyle,
    };

    dispatch(loadScreenStyle(allStyle));

    //  save constructed canvas to db
    const { success } = await preAPIs(
      dispatch,
      updateScreen,
      "Screen appearance updated",
      {
        id: activeScreen.id,
        style: newScreenStyle,
      }
    );
  };

export const updateItemStyles =
  ({
    value,
    root,
    property,
    index,
    isInsideContainer,
    containingChildIndex,
    type,
  }) =>
  (dispatch, getState) => {
    const canvasItems = [...getState().uieditor.canvasItems];
    const screenStyles = { ...getState().uieditor.screenStyles };
    let currComponent = { ...canvasItems?.[index] };

    const payloadUpdateObject = {
      id: canvasItems?.[index]?.id,
    };

    if (isInsideContainer) {
      let childrenComponentStyle =
        currComponent?.children?.[containingChildIndex]?.style;

      if (property === "overrideDefault") {
        if (!childrenComponentStyle) {
          childrenComponentStyle = {
            overrideDefault: value,
          };
        } else {
          childrenComponentStyle.overrideDefault = value;
        }

        if (value === true) {
          childrenComponentStyle = {
            ...childrenComponentStyle,
            ...screenStyles,
          };
        }
      } else {
        if (!childrenComponentStyle?.[root]) {
          childrenComponentStyle[root] = {};
        }

        if (!childrenComponentStyle?.[root][property]) {
          childrenComponentStyle[root][property] = {};
        }

        childrenComponentStyle[root][property] = parseValue(value);
      }

      currComponent.children[containingChildIndex].style =
        childrenComponentStyle;
      payloadUpdateObject.children = currComponent.children;
    } else {
      const componentStyle = currComponent.style;

      if (root) {
        if (componentStyle[root]) {
          componentStyle[root][property] = parseValue(value);
        } else {
          componentStyle[root] = {
            [property]: parseValue(value),
          };
        }
      } else {
        componentStyle[property] = parseValue(value);
      }

      currComponent.style = componentStyle;
      payloadUpdateObject.style = componentStyle;
    }

    canvasItems[index] = { ...currComponent };
    dispatch(loadCanvasItems([...canvasItems]));
    //  save constructed canvas to db
    saveCanvas([...canvasItems]);

    console.log(`. . O N   C H A N G E   S T Y L E S . .`);

    dispatch(onChangeStyles([...canvasItems]));

    //  save constructed canvas to db
    preAPIs(dispatch, updateItem, "Item updated", {
      // ...currComponent,
      ...payloadUpdateObject,
      itemsOrder: canvasItems.map((v) => v.id),
      dispatch,
    });
  };

export const updateValues =
  ({ value, property, index, isInsideContainer, containingChildIndex, type }) =>
  (dispatch, getState) => {
    const canvasItems = [...getState().uieditor.canvasItems];
    let currComponent = { ...canvasItems[index] };

    const payloadUpdateObject = {
      id: currComponent.id,
      [`values.${property}`]: value,
    };

    if (isInsideContainer) {
      const children_ = [...currComponent.children];
      const currSubComponent = {
        ...children_[containingChildIndex],
      };

      if (currSubComponent.values === undefined) {
        currSubComponent.values = {};
      }
      currSubComponent.values[property] = value;

      children_[containingChildIndex] = { ...currSubComponent };
      currComponent.children = [...children_];
      payloadUpdateObject.children = currComponent.children;
    } else {
      if (currComponent.values) {
        currComponent.values[property] = value;
      } else {
        currComponent.values = {
          [property]: value,
        };
      }
      payloadUpdateObject[`values.${property}`] = value;
    }

    canvasItems[index] = { ...currComponent };

    dispatch(onChangeStyles([...canvasItems]));

    //  save constructed canvas to db
    preAPIs(dispatch, updateItem, "Item updated", {
      // ...currComponent,
      ...payloadUpdateObject,
      itemsOrder: canvasItems.map((v) => v?.id),
      dispatch,
    });
  };

const preAPIs = async (dispatch, func, msg, ...args) => {
  const resp = await func(...args);

  if (!resp) {
    return null;
  }
  if (resp?.success) {
    dispatch(SetAppStatus({ type: "info", msg: msg }));
  } else {
    dispatch(SetAppStatus({ type: "error", msg: `${resp?.data}` }));
  }
  return resp;
};

const updateComponentName =
  ({ value, index, isInsideContainer, containingChildIndex }) =>
  (dispatch, getState) => {
    const canvasItems = [...getState().uieditor.canvasItems];
    const itemNames = [];
    canvasItems.forEach((canvasItem) => {
      if (canvasItem.children.length) {
        canvasItem.children.forEach(
          (child) => child.name && itemNames.push(child.name.trim())
        );
      }
      canvasItem.name && itemNames.push(canvasItem.name.trim());
    });

    const payloadUpdateObject = {
      id: canvasItems?.[index]?.id,
    };

    if (isInsideContainer) {
      if (!canvasItems?.[index]?.children?.[containingChildIndex]) {
        return;
      }
      canvasItems[index].children[containingChildIndex].name = value;
      payloadUpdateObject.children = canvasItems[index].children;
    } else {
      if (!canvasItems[index]) {
        return;
      }
      canvasItems[index].name = value;
      payloadUpdateObject.name = value;
      //else console.log(`ERROR ON CANVAS 1217`);
    }

    dispatch(onChangeStyles([...canvasItems]));

    if (itemNames.includes(value.trim())) {
      dispatch(
        SetAppStatus({
          type: "error",
          msg: `item with name ${value} already exists`,
        })
      );
      return;
    }
    //  save constructed canvas to db
    preAPIs(dispatch, updateItem, "Item updated", {
      ...payloadUpdateObject,
      itemsOrder: canvasItems.map((v) => v.id),
      dispatch,
    });
  };

export const updateComponentAttribute =
  ({ attrib, value, index, isInsideContainer, containingChildIndex }) =>
  (dispatch, getState) => {
    if (attrib === "name") {
      return dispatch(
        updateComponentName({
          name: attrib,
          value,
          index,
          isInsideContainer,
          containingChildIndex,
        })
      );
    }

    const canvasItems = [...getState().uieditor.canvasItems];
    const payloadUpdateObject = {
      id: canvasItems?.[index]?.id,
    };

    if (isInsideContainer) {
      canvasItems[index].children[containingChildIndex][attrib] = value;
      payloadUpdateObject.children = canvasItems[index].children;
    } else {
      canvasItems[index][attrib] = value;
      payloadUpdateObject[attrib] = value;
    }

    dispatch(onChangeStyles([...canvasItems]));

    //  save constructed canvas to db
    preAPIs(dispatch, updateItem, "Item updated", {
      // ...canvasItems[index],
      ...payloadUpdateObject,
      itemsOrder: canvasItems.map((v) => v.id),
      dispatch,
    });
  };

export const updateAddressPreferences =
  ({ value, name, id, type, changeType, extra }) =>
  (dispatch, getState) => {};

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

export const fetchCustomElements = () => async (dispatch, getState) => {
  const {
    selectedApp: { id: appId },
  } = getState().appsReducer;
  const orgId = localStorage.getItem("orgId");

  try {
    const cElements__ = await customElements
      .where("orgId", "==", orgId)
      .where("appId", "==", appId)
      .get();

    const cElements = {};
    cElements__.forEach((d) => (cElements[d.id] = d.data()));
    return cElements;
  } catch (err) {
    return err;
  }
};

export const saveCanvas = (canvasItem) => {
  //console.log("🚀 ~ file: utils.js ~ line 112 ~ saveCanvas ~ canvasItem", canvasItem)
};

export const saveCustomElement =
  (groupDetails) => async (dispatch, getState) => {
    const {
      selectedApp: { id: appId },
    } = getState().appsReducer;
    const orgId = localStorage.getItem("orgId");
    const userId = localStorage.getItem("userId");

    if (!userId || !orgId || !appId) {
      alert("ERROR!");
      return;
    }

    //  first confirm name is unique in org
    const chkElement = await customElements
      .where("name", "==", groupDetails.name)
      .where("orgId", "==", orgId)
      .get();

    if (chkElement.exists) {
      return { error: "name-exists" };
    }

    const newCustomElement = customElements.doc();
    await newCustomElement.set({
      id: newCustomElement.id,
      orgId,
      userId,
      appId,
      ...groupDetails,
    });

    const ce = await dispatch(fetchCustomElements());
    dispatch(loadCustomElements(ce));

    return "awaniyen";
    //  replace existing pieces with new group
  };

export const deleteCustomElement = (id) => async (dispatch) => {
  await customElements.doc(id).delete();

  const ce = await fetchCustomElements();
  dispatch(loadCustomElements(ce));

  return "awaniyen";
  //  replace existing pieces with new group
};

const reorderElements = ({ list, startIndex, endIndex }) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  if (
    (endIndex === 0 || startIndex === 0) &&
    result.find((value) => value.type === "header")
  ) {
    result.splice(endIndex + 1, 0, removed);
    return result;
  }
  if (removed.type === "header") {
    result.splice(0, 0, removed);
    return result;
  }
  if (endIndex >= list.length - 1) {
    result.splice(endIndex ? endIndex - 1 : 0, 0, removed);
    return result;
  }
  result.splice(endIndex, 0, removed);
  return result;
};
const reorderElementsInContainer = ({ list, startIndex, endIndex }) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
/**
 * Moves an item from one list to another list.
 */
const copyElement =
  ({ source, destination, droppableSource, droppableDestination }) =>
  (dispatch, getState) => {
    const {
      appsReducer: {
        selectedApp: { id: appId },
      },
      screens: {
        activeScreen: { id: screenId },
      },
    } = getState();

    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];
    if (
      item?.type === "header" &&
      destClone.find((item) => item?.type === "header")
    ) {
      return destClone;
    }
    if (item?.type === "header") {
      destClone.splice(0, 0, {
        ...item,
        parent: droppableDestination.droppableId,
        app: appId,
        screen: screenId,
        index: droppableDestination.index,
        name: item?.id,
      });
      return destClone;
    }
    if (
      droppableDestination.index === 0 &&
      destination.find((value) => value.type === "header")
    ) {
      destClone.splice(droppableDestination.index + 1, 0, {
        ...item,
        parent: droppableDestination.droppableId,
        app: appId,
        screen: screenId,
        index: droppableDestination.index,
        name: item?.id,
      });
      return destClone;
    }
    destClone.splice(droppableDestination.index, 0, {
      ...item,
      parent: droppableDestination.droppableId,
      app: appId,
      screen: screenId,
      index: droppableDestination.index,
      name: item?.id,
    });
    return destClone;
  };

export const move = (
  source,
  destination,
  droppableSource,
  droppableDestination
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export const sortByIndexPpty = (array) =>
  array.sort((a, b) => a.index - b.index);
