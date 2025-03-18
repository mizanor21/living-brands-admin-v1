import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useNewsItemsData = () => {
  const { data, error } = useSWR(
    `/api/news-center`,
    fetcher
  );
  return { data, error, isLoading: !data && !error };
};
