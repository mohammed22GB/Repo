import React from 'react';
import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
} from 'react-flow-renderer';

// import '../index.css';

const foreignObjectSize = 20;

const onEdgeClick = (evt, id) => {
  evt.stopPropagation();
//   alert(`remove ${id}`);
};

export const ButtonEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        // width={foreignObjectSize}
        // height={foreignObjectSize}
        // x={edgeCenterX - foreignObjectSize / 2}
        // y={edgeCenterY - foreignObjectSize / 2}
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button
            className="edgebutton"
            style={{
                borderRadius: 18,
                border: "none",
                background: "#ffd8c1",
                width: foreignObjectSize,
                height: foreignObjectSize,
                cursor: "pointer",
            }}
            onClick={(event) => onEdgeClick(event, id)}
          >
            ×
          </button>
        </div>
      </foreignObject>
      <text>
        <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
          {data?.text}
          {/* Hallelujah! */}
        </textPath>
      </text>
    </>
  );
}