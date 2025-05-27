import { combineReducers } from "redux";
import { auth } from "./auth";
import { users } from "./users";
import { reducers } from "./reducers";
import { uieditor } from "./uieditor";
import { screens } from "./screens";
import { liveData } from "./liveData";
import { workflows } from "./workflows";
import { appsReducer } from "./AppsReducers";
import { canvasLayout, activeCanvas } from "./actionCanvas";
import { dataReducer } from "./dataReducers";
import { inappReducer } from "./inappReducer";
import { integrationReducer } from "./integrationReducer";
import { upLoadFileReducer } from "./uploadFileReducer";
export default combineReducers({
  auth,
  users,
  reducers,
  appsReducer,
  dataReducer,
  activeCanvas,
  canvasLayout,
  uieditor,
  screens,
  workflows,
  liveData,
  inappReducer,
  integrationReducer,
  upLoadFileReducer,
});
