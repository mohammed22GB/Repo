import React, { useState } from "react";
import { Collapse } from "@material-ui/core";
import { useDispatch } from "react-redux";
import InputItemStyles from "./InputItemStyles";
import PageItemStyles from "./PageItemStyles";
import HeaderItemStyles from "./HeaderItemStyles";
import FormItemStyles from "./FormItemStyles";
import HeadingTextItemStyles from "./HeadingTextItemStyles";
import TextItemStyles from "./TextItemStyles";
import LabelItemStyles from "./LabelItemStyles";
import ButtonItemStyles from "./ButtonItemStyles";
import Switch from "../PlainToggleSwitch";
import {
  updateScreenItemStyles,
  updateUieCanvas,
} from "../../../../utils/uieditorHelpers";
import { v4 } from "uuid";
import ItemSectionStyles from "./ItemSectionStyles";
import Selector from "../Selector";

const CustomStyleSection = React.memo(
  ({
    activeSelection,
    items = [],
    itemRef,
    itemType,
    styles,
    isPage,
    isSection,
    copyScreensList,
    copyPageStyle,
  }) => {
    const effectiveStyles = isPage ? styles?.page : styles;
    const dispatch = useDispatch();
    const [copyScreen, setCopyScreen] = useState("");

    const onItemStyleChange = ({ value, root, property }) => {
      if (isSection) {
        dispatch(
          updateUieCanvas({
            action: "updateSectionStyles",
            breadcrumb: itemRef,
            value,
            property,
          })
        );
      } else {
        dispatch(
          updateScreenItemStyles({
            itemRef,
            value,
            root,
            property,
            itemType,
            isPage,
          })
        );
      }
    };

    return (
      <>
        <div className="sidebar-section _header" style={{ padding: "0 10px" }}>
          Appearance: override screen defaults
          <Switch
            key={v4()}
            itemType="togglehide"
            value={effectiveStyles?.overrideDefault}
            checked={effectiveStyles?.overrideDefault}
            toggleHide={(v) =>
              onItemStyleChange({ value: v, property: "overrideDefault" })
            }
          />
        </div>

        {!!effectiveStyles?.overrideDefault &&
          !!isPage &&
          !!copyScreensList?.length && (
            <div
              className="sidebar-section"
              style={{ backgroundColor: "#f4f4f4" }}
            >
              <div>Copy screen styles from:</div>
              <div
                className="sidebar-section-item _full"
                style={{ paddingRight: 0, paddingLeft: 0, gap: 10 }}
              >
                <div style={{ flex: 1 }}>
                  <Selector
                    width="100%"
                    items={copyScreensList}
                    onChange={setCopyScreen}
                    selectedValue={copyScreen}
                  />
                </div>
                <div
                  style={{
                    width: 40,
                    backgroundColor: "#333",
                    color: "#ffffff",
                    borderRadius: 4,
                    padding: 3,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => {
                    copyPageStyle(copyScreen);
                    setCopyScreen("");
                  }}
                >
                  OK
                </div>
              </div>
            </div>
          )}

        <Collapse in={effectiveStyles?.overrideDefault}>
          {items.includes("page") && (
            <PageItemStyles
              activeSelection={activeSelection}
              screenStyles={effectiveStyles}
              onStyleChange={onItemStyleChange}
            />
          )}

          {items.includes("header") && (
            <HeaderItemStyles
              activeSelection={activeSelection}
              screenStyles={effectiveStyles}
              onStyleChange={onItemStyleChange}
            />
          )}

          {items.includes("form") && (
            <FormItemStyles
              activeSelection={activeSelection}
              screenStyles={effectiveStyles}
              onStyleChange={onItemStyleChange}
            />
          )}

          {items.includes("heading") && (
            <HeadingTextItemStyles
              activeSelection={activeSelection}
              screenStyles={effectiveStyles}
              onStyleChange={onItemStyleChange}
            />
          )}

          {items.includes("text") && (
            <TextItemStyles
              activeSelection={activeSelection}
              screenStyles={effectiveStyles}
              onStyleChange={onItemStyleChange}
            />
          )}

          {items.includes("input") && (
            <InputItemStyles
              activeSelection={activeSelection}
              screenStyles={effectiveStyles}
              onStyleChange={onItemStyleChange}
            />
          )}

          {items.includes("button") && (
            <ButtonItemStyles
              activeSelection={activeSelection}
              screenStyles={effectiveStyles}
              onStyleChange={onItemStyleChange}
            />
          )}

          {items.includes("label") && (
            <LabelItemStyles
              activeSelection={activeSelection}
              screenStyles={effectiveStyles}
              onStyleChange={onItemStyleChange}
            />
          )}

          <ItemSectionStyles
            activeSelection={activeSelection}
            screenStyles={effectiveStyles}
            onStyleChange={onItemStyleChange}
          />
        </Collapse>
      </>
    );
  }
);
export default CustomStyleSection;
