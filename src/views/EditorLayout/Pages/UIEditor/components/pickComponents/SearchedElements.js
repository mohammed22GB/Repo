import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ComponentTile from "./ComponentTile";
import DraggableTile from "./DraggableTile";
import { allElements } from "../../utils/elementsList";
import { useSelector } from "react-redux";

export default function SearchedElements({
  navigation,
  buttonCallback,
  ...props
}) {
  const { storedSearchedElements } = useSelector(({ uieditor }) => uieditor);
  return (
    <DraggableTile
      droppableId="searchedElements"
      elements={storedSearchedElements}
    />
  );
}
