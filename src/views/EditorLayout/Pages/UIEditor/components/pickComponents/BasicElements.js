import DraggableTile from "./DraggableTile";
import { allElements } from "../../utils/elementsList";

export default function BasicElements({}) {
  return (
    <DraggableTile
      droppableId="basicElements"
      elements={allElements.basicElements}
    />
  );
}
