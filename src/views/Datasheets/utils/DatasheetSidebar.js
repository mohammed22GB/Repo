import { useState } from "react";
import PermissionsSidebar from "../../Dashboards/pages/DashboardsList/PermissionsSidebar";

const DatasheetSidebar = ({
  showMe, //= true,
  setShowMe,
  datasheetId,
  datasheetName,
  permissionToggle,
  //showSideBar,
  //setShowSideBar,
  usersLists,
  permsResource,
  setPermsResource,
  handleCloseSidebar,
  refetch,
}) => {
  const node = "screen";

  const handleClose = () => {
    // dispatch({ type: SHOW_COLUMNBOX, payload: false });
    setShowMe(false);
  };

  return (
    <PermissionsSidebar
      showMe={showMe}
      handleClose={handleClose}
      componentName={datasheetName}
      permsResource={permsResource}
      setPermsResource={setPermsResource}
      resourceId={datasheetId}
      refetch={refetch}
      permissionToggle={permissionToggle}
      queryType={"getDatasheetPerms"}
      resourceType={"datasheet"}
      component={"datasheet"}
    />
  );
};

export default DatasheetSidebar;
