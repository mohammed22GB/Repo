import { Menu, MenuItem } from "@material-ui/core";

const MenuList = ({
  setAnchorEl,
  anchorEl,
  id,
  anchorRef,
  assignAdmin,
  adminIDs,
  toggleMember,
  memberId,
}) => {
  const isMenuOpen = Boolean(anchorEl);
  const isAdmin = adminIDs.includes(memberId);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      //anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={"screens-menu"}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {[
        {
          name: "Delete member",
          anchorRef,
          onClick: async () => {
            await toggleMember(memberId, false);
            setAnchorEl(null);
          },
        },
        {
          name: `${isAdmin ? "Remove" : "Assign"} Admin`,
          anchorRef,
          onClick: async () => {
            await assignAdmin(memberId, isAdmin ? "remove" : "add");
            setAnchorEl(null);
          },
        },
      ].map((data, idx) => (
        <MenuItem
          button
          key={idx}
          onClick={data.onClick}
          anchorRef={data.anchorRef}
        >
          {data.name}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default MenuList;
