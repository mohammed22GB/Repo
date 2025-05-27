import { Tooltip } from "@mui/material";

const TooltipPatch = ({ children, ...props }) => (
  <Tooltip {...props}>
    <span>{children}</span>
  </Tooltip>
);

export default TooltipPatch;
