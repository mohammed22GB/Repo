import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Draggable, Droppable } from "react-beautiful-dnd";
import ComponentTile from "./ComponentTile";
import { v4 } from "uuid";
import { useSelector } from "react-redux";
import { APP_DESIGN_MODES } from "../../../../../common/utils/constants";

const useStyles = makeStyles((theme) => {
  return {
    elementButton: {
      background: "#010A43",
      borderRadius: "3px 3px 0 0",
    },
    root: ({ height }) => {
      return {
        display: "flex",
        width: "100%",
        // maxHeight: height,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        padding: 3,

        "& >*": {
          width: "30.7%",
          height: 60,
          // padding: 10
        },
      };
    },
    heading: {
      color: "#ABB3BF",
    },
    tileSpacing: {
      marginBottom: 10,
    },
    tiles: {
      display: "flex",
    },
  };
});

const DraggableTile = (props) => {
  const { uieCanvasMode } = useSelector(({ uieditor }) => uieditor);

  const [keyID, setKeyID] = useState(v4());
  const style = useStyles({
    height: Math.ceil(Object.keys(props.elements)?.length / 3) * 60 - 9,
  });

  useEffect(() => {}, [props.elements]);

  if (!props.droppableId) return null;
  return (
    <>
      <Droppable
        droppableId={props.droppableId}
        isDropDisabled={true}
        isDragDisabled={uieCanvasMode !== APP_DESIGN_MODES.EDIT}
      >
        {(provided, snapshot1) => (
          <div className={style.root} ref={provided.innerRef}>
            {props.elements.map((item, index) => (
              <Draggable
                key={`${item.id}-${keyID}`}
                draggableId={item.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <>
                    <div
                      key={index}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ComponentTile
                        title={item.title}
                        icon={item.icon}
                        tileId={item?.dataTestId}
                      />
                    </div>
                    {snapshot.isDragging && (
                      <div>
                        <ComponentTile
                          title={item.title}
                          icon={item.icon}
                          tileId={item?.dataTestId}
                        />
                      </div>
                    )}
                  </>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
};

export default DraggableTile;
