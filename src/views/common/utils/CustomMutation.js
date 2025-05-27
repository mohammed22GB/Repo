import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { catchErr } from "./catchErr";

/**
 * It's a custom hook that uses the useMutation hook from react-query to make an API call
 * @returns The response object is being returned.
 */
const useCustomMutation = ({
  apiFunc,
  onMutate,
  onSuccess,
  onError,
  retries,
  overrideNotification = false,
}) => {
  const history = useHistory();
  const response = useMutation(apiFunc, {
    exact: true,
    retry: retries === undefined ? 1 : retries,
    delay: 3000,
    onMutate,
    onError: (error) => {
      !overrideNotification &&
        catchErr({
          err: error,
          alertResMessage: error?.response?.data?._meta?.error?.message,
          statuscode: error?.response?._meta?.statuscode,
          history,
        });
      !!onError && onError({ error });
    },

    onSuccess: async (data) => {
      await onSuccess({ data });
    },
  });

  return response;
};

export default useCustomMutation;
