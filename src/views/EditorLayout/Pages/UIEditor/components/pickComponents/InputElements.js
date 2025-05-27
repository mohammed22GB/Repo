import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ComponentTile from "./ComponentTile";
import DraggableTile from "./DraggableTile";
import { allElements } from "../../utils/elementsList";

export default function InputElements({ navigation, buttonCallback, props }) {
  const [count, setCount] = useState(1);

  // const { next } = navigation;

  return (
    <DraggableTile
      droppableId="inputElements"
      elements={allElements.inputElements}
    />
  );
}
