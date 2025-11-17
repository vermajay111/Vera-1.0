import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/TokenRefresh";

export function useFriendsSearch(search) {
  return useQuery({
    queryKey: ["friends-search", search],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/users/search_within_friends`,
        {
          params: { search },
        }
      );
      return response.data.results; // backend returns { results: [...] }
    },
    staleTime: 1000 * 60, // 1 minute caching
    enabled: true, // always run (search may be empty)
  });
}
