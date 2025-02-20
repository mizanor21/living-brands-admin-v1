import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useNewsItemsData = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/news-center`,
    fetcher
  );
  return { data, error, isLoading: !data && !error };
};
