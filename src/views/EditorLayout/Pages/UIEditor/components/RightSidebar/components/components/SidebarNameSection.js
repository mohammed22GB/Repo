import React, { useEffect, useRef } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputBase, Tooltip } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { updateScreenItemPropertyValues } from "../../../../utils/uieditorHelpers";
import { validateUIEInputs } from "../../../../../../../common/helpers/validation";
import { errorToastify } from "../../../../../../../common/utils/Toastify";

const SidebarNameSection = React.memo(
  ({
    itemId,
    itemRef,
    itemType,
    noName,
    title,
    name,
    setIsDynamic,
    isDynamic,
  }) => {
    const activeId = useRef();
    const evtRef = useRef();

    useEffect(() => {
      if (
        ["dropdown", "checkbox", "radio", "displayTable", "inputText"].includes(
          itemType
        )
      ) {
        if (activeId.current !== itemId) {
          activeId.current = itemId;
          return;
        }

        let newName;
        if (isDynamic) {
          newName = !name ? "" : name?.startsWith("@") ? name : "@" + name;
        } else {
          newName = !name
            ? ""
            : name?.startsWith("@")
            ? name.substring(1)
            : name;
        }

        if (name === newName) {
          return;
        }
        let target = { name: "", value: newName };
        // onNameChange({ target });
      }
    }, [isDynamic, name, itemType]);

    const InputText = withStyles((theme) => ({
      input: {
        color: "#091540",
        borderRadius: 3,
        position: "relative",
        border: "1px solid #ABB3BF",
        fontSize: 11,
        padding: "5px 12px",
        transition: theme?.transitions.create(["border-color", "box-shadow"]),
      },
    }))(InputBase);

    const dispatch = useDispatch();

    const preOnChange = (e) => {
      evtRef.current = e.target.value;

      const onNameChange = function () {
        const value = evtRef.current;
        /* return if name value contains  { } or |  */
        const { status: isForbiddenChar, characterValue } =
          validateUIEInputs(value);

        if (isForbiddenChar) {
          return errorToastify(
            `"${characterValue}" character not allowed in name.`
          );
        }
        /* return if name value isn't changed onBlur */
        if (name === value) {
          return;
        }

        if (
          [
            "dropdown",
            "checkbox",
            "radio",
            "displayTable",
            "inputText",
          ].includes(itemType)
        ) {
          if (value?.length > 1 && value.startsWith("@")) {
            // dispatch(saveDisplayTableColumn(true));
            setIsDynamic(true);
          } else {
            setIsDynamic(false);
            // dispatch(saveDisplayTableColumn(false));
          }
        }

        return dispatch(
          updateScreenItemPropertyValues({
            value,
            property: "name",
            itemRef,
            isRootValue: true,
          })
        );
      };

      clearTimeout(preOnChange.timeout);
      preOnChange.timeout = setTimeout(onNameChange, 2000);
    };

    return (
      <div className="sidebar-section _header">
        {title}

        {!noName && (
          <Tooltip title={"Use alphanumeric characters without spaces"}>
            <InputText
              variant="outlined"
              size="small"
              onChange={preOnChange}
              defaultValue={name}
              placeholder="Enter variable name..."
            />
          </Tooltip>
        )}
      </div>
    );
  }
);
export default SidebarNameSection;
