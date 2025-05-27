import PermissionsSidebar from "../PermissionsSidebar";

const DashboardPerms = (props) => {
  const {
    dashboardName,
    handleCloseSidebar,
    showMe,
    setShowMe,
    refetch,
    permsResource,
    setPermsResource,
    usersLists,
    permissionToggle,
    dashboardId,
  } = props;

  return (
    <PermissionsSidebar
      showMe={showMe}
      handleClose={() => setShowMe(false)}
      componentName={dashboardName}
      permsResource={permsResource}
      setPermsResource={setPermsResource}
      resourceId={dashboardId}
      refetch={refetch}
      permissionToggle={permissionToggle}
      queryType={"getDashboardPerms"}
      resourceType={"report"}
      component={"dashboard"}
    />
  );
};
export default DashboardPerms;
