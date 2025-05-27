import { useQuery } from "react-query";
import { getInAppNotification } from "../../../../common/components/Query/InAppNotificaficationQuery/inAppQuery";

export const useNotification = () => {
  const queryKey = [
    "inAppNotificationBadgeCount",
    {
      perPage: 3,
      page: 1,
      read: "",
      sortParams: {},
    },
  ];

  const { data } = useQuery(queryKey, getInAppNotification, {
    cacheTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: 3 * 60 * 1000,
    refetchOnMount: false,
  });

  const readNotificationCount = data?.data?._meta?.pagination?.total_read;
  const unreadNotificationCount = data?.data?._meta?.pagination?.total_unread;

  return { readNotificationCount, unreadNotificationCount };
};
