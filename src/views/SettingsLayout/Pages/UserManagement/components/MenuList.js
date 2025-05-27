import { Menu, MenuItem } from "@material-ui/core";

const MenuList = ({
  setAnchorEl,
  anchorEl,
  id,
  handleModalOpen,
  item,
  anchorRef,
  setToDeleteUser,
  handleResendMail,
}) => {
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDataSheetSwitch = ({
    name,
    id,
    setAnchorEl,
    deleteDatasheet = () => null,
    duplicateDatasheet = () => null,
  }) => {
    switch (name?.toLowerCase()) {
      case "delete":
        setAnchorEl(null);
        if (!!prompt && prompt.toLowerCase() === "delete")
          deleteDatasheet({ id });
        break;

      case "duplicate":
        duplicateDatasheet({ datasheet: id });
        break;

      default:
        break;
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={"screens-menu"}
      keepMounted
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {[
        {
          name: "View",
          anchorRef,
          onClick: () => {
            handleModalOpen("view", item);
            setAnchorEl(null);
          },
        },
        {
          name: "Edit",
          anchorRef,
          onClick: () => {
            handleModalOpen("update", item);
            setAnchorEl(null);
          },
        },
        {
          name: "Remove",
          anchorRef,
          onClick: () => {
            setToDeleteUser(true);
            setAnchorEl(null);
          },
        },
        ...(!item.active
          ? [
              {
                name: "Resend invite",
                anchorRef,
                onClick: () => {
                  handleResendMail(item.email);
                  setAnchorEl(null);
                },
              },
            ]
          : []),
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
