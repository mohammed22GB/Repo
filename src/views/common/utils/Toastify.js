import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export const successToastify = (message) => {
  return (
    message &&
    toast.success(`${message[0].toUpperCase()}${message.slice(1)}`, {
      position: "bottom-center",
      hideProgressBar: true,
      transition: Zoom,
      // delay: 3000,
      toastId: "success1",
    })
  );
};

export const errorToastify = (message) => {
  return (
    message &&
    toast.error(`${message[0].toUpperCase()}${message.slice(1)}`, {
      position: "bottom-center",
      hideProgressBar: true,
      transition: Zoom,
      // delay: 7000,
      toastId: "error1",
    })
  );
};

export const infoToastify = (message) => {
  return (
    message &&
    toast.info(`${message[0].toUpperCase()}${message.slice(1)}`, {
      position: "bottom-center",
      hideProgressBar: true,
      transition: Zoom,
      // delay: 7000,
      toastId: "info1",
    })
  );
};
