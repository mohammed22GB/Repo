import React from "react";
import { allElements } from "../../utils/elementsList";
import DraggableTile from "./DraggableTile";

export default function NavigationElements() {
  return (
    <DraggableTile
      droppableId="navigationElements"
      elements={allElements.navigationElements}
    />
  );
}
