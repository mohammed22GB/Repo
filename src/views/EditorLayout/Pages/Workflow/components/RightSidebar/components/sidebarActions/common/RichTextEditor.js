/**
 * Rich Text Editor - Expand Toolbar Sample
 */
import * as React from "react";
import { useSelector } from "react-redux";
import { TextField } from "@material-ui/core";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  NodeSelection,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";
import "@syncfusion/ej2-react-buttons/styles/material.css";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-icons/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-richtexteditor/styles/material.css";

import { infoToastify } from "../../../../../../../../common/utils/Toastify";
import { unrenderableVariables } from "../../../../utils/constants";
import NodeIcons from "../../../../NodeIcons";
import { WORKFLOWS_TASK_START } from "../../../../utils/taskTypes";

let items = [
  {
    template: `<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">
                            <div class="e-tbar-btn-text" style="background-color: #3e9aad; color: white; padding: 0 5px; border-radius: 4px; font-size: 0.9em">
                                Variables
                            </div>
                        </button>`,
    undo: true,
    tooltipText: "Insert Symbol",
  },
  "Bold",
  "Italic",
  "Underline",
  "|",
  "Formats",
  "Alignments",
  "OrderedList",
  "UnorderedList",
  "|",
  "CreateLink",
  "Image",
  "|",
  "SourceCode",
  "|",
  "Undo",
  "Redo",
];

function RichTextEditor(props) {
  const { workflowTasks: allTasks, workflowCanvas } = useSelector(
    ({ workflows }) => workflows
  );

  const dialogObj = React.useRef(null);
  const rteObj = React.useRef(null);
  const selection = new NodeSelection();
  const [showRTE, setShowRTE] = React.useState(false);
  const [filteredVariables, setFilteredVariables] = React.useState(null);

  //  this is to solve the lingered erractic appearance issue
  React.useEffect(() => {
    setTimeout(() => {
      setShowRTE(true);
    }, 0);
  }, []);

  const variables = props.variables?.filter(
    (variable) => !unrenderableVariables.includes(variable.info?.group)
  );
  const [template, setTemplate] = React.useState(props?.emailBody || "");
  // console.log("propas", props);

  React.useEffect(() => {
    setTemplate(props?.emailBody || "");
  }, [props?.emailBody]);

  const onClick = () => {
    rteObj.current.ranges = selection.getRange(document);
    dialogObj.current.width = rteObj.current.element.offsetWidth * 0.5;
    dialogObj.current.content = document.getElementById("rteSpecial_char");
    dialogObj.current.dataBind();
    dialogObj.current.show();
  };
  const onInsert = () => {
    const activeEle = dialogObj?.current?.element?.querySelector(
      ".char_block.e-active"
    );
    dialogOverlay();
    if (activeEle) {
      const newEl = document.createElement("span");
      newEl.id = activeEle.id;
      newEl.style.display = "inline";
      newEl.style.borderRadius = "3px";
      newEl.style.backgroundColor = "lightgrey";
      newEl.style.padding = "3px 5px";
      newEl.style.fontSize = "0.85em";
      newEl.innerHTML = activeEle.innerHTML;
      newEl.contentEditable = false;
      newEl.setAttribute("data-is-variable", true);
      rteObj.current.ranges.insertNode(newEl);

      // this.ranges.insertNode(document.createTextNode(activeEle.textContent));
    }
  };
  const onCancel = (e) => {
    const activeEle = dialogObj?.current?.element?.querySelector(
      ".char_block.e-active"
    );
    if (activeEle) {
      activeEle.classList.remove("e-active");
    }
    dialogObj.current.hide();
  };

  const onClickToCopy = (variable) => {
    if (variable) {
      const variableTocopy = `{{${variable?.info?.name}-${variable?.id?.slice(
        -6
      )}}}`;
      navigator.clipboard.writeText(variableTocopy);
    }
    dialogOverlay();
    infoToastify("Variable name copied");
  };

  items = [
    {
      template: `<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">
                              <div class="e-tbar-btn-text" style="background-color: #3e9aad; color: white; padding: 0 5px; border-radius: 4px; font-size: 0.9em">
                                  Variables
                              </div>
                          </button>`,
      undo: true,
      click: onClick.bind(this),
      tooltipText: "Insert Symbol",
    },
    "Bold",
    "Italic",
    "Underline",
    "|",
    "Formats",
    "Alignments",
    "OrderedList",
    "UnorderedList",
    "|",
    "CreateLink",
    "Image",
    "|",
    "SourceCode",
    "|",
    "Undo",
    "Redo",
  ];
  let toolbarSettings = {
    items,
    // type: "Expand",
  };

  const dialogCreate = () => {
    const dialogCtn = document.getElementById("rteSpecial_char");
    dialogCtn.onclick = (e) => {
      const target = e.target;
      const activeEle = dialogObj?.current?.element?.querySelector(
        ".char_block.e-active"
      );
      if (target.classList.contains("char_block")) {
        target.classList.add("e-active");
        if (activeEle) {
          activeEle.classList.remove("e-active");
        }
      }
    };
    // this.rteObj.value = "<p></p>";
  };

  const header = "Insert Variable";

  let dlgButtons = [
    // {
    //   buttonModel: { content: "Insert", isPrimary: true },
    //   click: onInsert.bind(this),
    // },
    { buttonModel: { content: "Cancel" }, click: onCancel },
  ];

  const dialogOverlay = () => {
    const activeEle = dialogObj?.current?.element?.querySelector(
      ".char_block.e-active"
    );
    if (activeEle) {
      activeEle.classList.remove("e-active");
    }
    dialogObj.current.hide();
  };

  const searchVariables = (searchText) => {
    if (!searchText) {
      setFilteredVariables(null);
    }
    const filtered = variables?.filter((variable) =>
      variable?.info?.name?.toLowerCase().includes(searchText?.toLowerCase())
    );
    setFilteredVariables(filtered);
  };

  const VariableSubText = (variable) => {
    const varSourceId = variable?.info?.parent;
    const varSource =
      allTasks?.[varSourceId] ||
      workflowCanvas.find((c) => c.id === varSourceId);

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <NodeIcons style={{ fontSize: 12 }} nodeType={varSource?.type} />{" "}
        {varSource?.name ||
          `{ ${varSource?.type === WORKFLOWS_TASK_START ? "" : "unnamed"} ${
            varSource?.type
          } node }`}
      </div>
    );
  };

  return showRTE ? (
    <div className="control-pane">
      <div
        className="control-section e-rte-custom-tbar-section"
        id="rteCustomTool"
      >
        <div className="rte-control-section" id="rteSection">
          <RichTextEditorComponent
            blur={() => {
              props.holdBody(rteObj.current.value);
            }}
            height={250}
            id="defaultRTE"
            ref={(scope) => (rteObj.current = scope)}
            valueTemplate={template}
            toolbarSettings={toolbarSettings}
          >
            <Inject
              services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]}
            />
          </RichTextEditorComponent>
          <DialogComponent
            id="customTbarDlg"
            ref={(scope) => (dialogObj.current = scope)}
            buttons={dlgButtons}
            overlayClick={dialogOverlay.bind(this)}
            header={header}
            visible={false}
            showCloseIcon={false}
            target={"#rteSection"}
            // height={this.height}
            // maxHeight={this.maxHeight}
            created={dialogCreate.bind(this)}
            isModal={true}
          />
          <div id="customTbarDialog" style={{ display: "none" }}>
            <div id="rteSpecial_char" style={{ paddingTop: 40 }}>
              <div
                style={{
                  marginTop: -40,
                  position: "absolute",
                  backgroundColor: "#fff",
                  right: 10,
                  left: 3,
                }}
              >
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  placeholder="Search variables"
                  onChange={(e) => searchVariables(e.target.value)}
                />
              </div>
              {(filteredVariables || variables)?.map((variable, indexKey) => (
                <div
                  key={indexKey}
                  className="char_block"
                  id={variable.id}
                  role="menuitem"
                  style={{
                    padding: "5px",
                    borderRadius: 5,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#EEE",
                    },
                  }}
                  title={`${variable?.info?.nodeType}: ${variable?.info?.parent}`}
                  onClick={() => onClickToCopy(variable)}
                >
                  <div>{variable.info?.name || "unnamed variable"}</div>
                  <div
                    style={{
                      fontSize: 10,
                      borderTop: "solid 0.5px #eee",
                      paddingTop: 3,
                      marginTop: 3,
                      color: "#888",
                    }}
                    title={`${variable.nodeType}: ${variable.parent}`}
                    //onClick={() => onClickToCopy(variable)}
                  >
                    {VariableSubText(variable)}
                  </div>
                </div>
              ))}
              {!variables?.length && (
                <em style={{ color: "#aaa" }}>No variables</em>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default RichTextEditor;
