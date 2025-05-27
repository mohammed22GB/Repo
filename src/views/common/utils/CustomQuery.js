import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { catchErr } from "./catchErr";

/**
 * It's a custom hook that uses the useQuery hook from the react-query library to make an API call
 *
 * @param {{
 *  apiFunc: function,
 *  onSuccess: ({ data: any }) => void,
 *  onError: (error: string) => void,
 *  queryKey: string,
 *  enabled: boolean,
 *  select: (data: any) => any
 * }} props
 *
 * @returns The response object from the useQuery hook.
 */
const useCustomQuery = ({
  apiFunc,
  onSuccess,
  onError,
  queryKey,
  enabled = true,
  select,
}) => {
  const history = useHistory();

  const response = useQuery(queryKey, apiFunc, {
    retry: 1,
    refetchOnWindowFocus: false,
    onError: (error) => {
      catchErr({
        err: error,
        alertResMessage: error?.response?.data?._meta?.error?.message,
        statuscode: error?.response?.data?._meta?.statuscode,
        history,
      });
      !!onError && onError(error?.response);
    },
    retryDelay: 3000,
    // onSuccess: (data) => onSuccess({ data }),
    onSuccess: (data) => {
      if (!data || data?.name === "Error") {
        catchErr({
          err: data?.stack,
          alertResMessage: "",
          statuscode: "",
          history,
        });
        !!onError && onError("Sorry an error occured.");
      } else {
        if (onSuccess) {
          onSuccess({ data });
        }
      }
    },
    enabled,
    select,
  });

  return response;
};

export default useCustomQuery;
