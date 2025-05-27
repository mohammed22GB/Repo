import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import EditPencilIcon from "../../../../common/components/EditPencilIcon/EditPencilIcon";
import CustomizationModal from "./CustomizationModal";
import {
  ContentTypes,
  DetailsMode,
  ModalMode,
} from "../utils/customizationutils";

const CustomInternalDetails = ({
  detailsMode,
  details,
  onModalSave,
  onDelete,
}) => {
  const {
    _id,
    title,
    linkText,
    userInformation,
    documentType,
    content,
    contentType,
  } = details;

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("");

  const handleOpenDetailsModal = () => {
    if (
      detailsMode === DetailsMode.PersonalDetails ||
      detailsMode === DetailsMode.OrganizationDetails
    ) {
      setModalMode(ModalMode.PersonalAndOrganizationDetails);
    } else if (detailsMode === DetailsMode.MenuItemDetails) {
      setModalMode(ModalMode.MenuSettings);
    }

    setOpenModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenModal(false);
  };

  const getDescriptionBasedOnContentType = (contenttype) => {
    switch (contenttype) {
      case ContentTypes.APPS:
        return content?.name;
      case ContentTypes.EXTERNAL_LINK:
        return linkText;
      case ContentTypes.DOCUMENTS:
        return documentType;
      case ContentTypes.USER_DETAILS:
        return userInformation;
      default:
        return "";
    }
  };

  return (
    <>
      <div
        key={_id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <div>
          <Typography
            style={{
              color: "#535353",
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            {title}
          </Typography>
          <Typography
            style={{
              color: "#ABABAB",
              fontWeight: 400,
              fontSize: "12px",
            }}
          >
            {getDescriptionBasedOnContentType(contentType)}
          </Typography>
        </div>

        <div
          onClick={() => handleOpenDetailsModal()}
          style={{ cursor: "pointer" }}
        >
          <EditPencilIcon />
        </div>
      </div>

      {!!openModal && (
        <CustomizationModal
          id={_id}
          detailsMode={detailsMode}
          modalDetails={details}
          modalMode={modalMode}
          open={openModal}
          handleClose={handleCloseDetailsModal}
          onModalSave={onModalSave}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default CustomInternalDetails;
