import { Button } from "@material-ui/core";

const ToggleUserPortalActivationButton = ({
  buttonClassName,
  isUserPortalEnabled,
  userPortalLoading,
  showActivateUserPortalModal,
  toggleUserPortalActivationAndDeactivation,
}) => {
  const getTextContentBasedOnButtonState = (isLoading, isActivated) => {
    if (isLoading) {
      if (isActivated) {
        return "Deactivating user portal";
      }
      return "Activating user portal";
    }

    if (isActivated) {
      return "Deactivate user portal";
    }

    return "Activate user portal";
  };

  return (
    <Button
      className={buttonClassName}
      role="button"
      style={
        isUserPortalEnabled
          ? {
              color: "#2457C1",
              backgroundColor: "rgba(36, 87, 193, 0.1)",
            }
          : {
              backgroundColor: "#2457C1",
              color: "#ffffff",
            }
      }
      onClick={() => {
        if (isUserPortalEnabled) {
          toggleUserPortalActivationAndDeactivation();
        } else {
          showActivateUserPortalModal(true);
        }
      }}
      disabled={userPortalLoading}
    >
      {getTextContentBasedOnButtonState(userPortalLoading, isUserPortalEnabled)}
    </Button>
  );
};

export default ToggleUserPortalActivationButton;
