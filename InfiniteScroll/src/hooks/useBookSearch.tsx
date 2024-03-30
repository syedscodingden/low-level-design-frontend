import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  query: string;
  pageNumber: number;
}

const useBookSearch = ({ query, pageNumber }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let cancelRequest: boolean;
    const debounceTimer = setTimeout(() => {
      setLoading(true);
      setError(false);
      axios({
        method: "GET",
        url: "http://openlibrary.org/search.json",
        params: { q: query, page: pageNumber },
      })
        .then((res) => {
          if (!cancelRequest) {
            if (pageNumber === 1) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setBooks([...res.data.docs.map((book: any) => book.title)]);
            } else {
              setBooks((prevBooks): typeof books => {
                return [
                  ...new Set([
                    ...prevBooks,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...res.data.docs.map((book: any) => book.title),
                  ]),
                ];
              });
            }
            setHasMore(res.data.docs.length > 0);
            setLoading(false);
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((_e) => {
          if (!cancelRequest) {
            setError(true);
            setBooks([]);
          }
        });
    }, 500); // Adjust debounce time as needed

    return () => {
      cancelRequest = true;
      clearTimeout(debounceTimer);
    };
  }, [query, pageNumber]);

  return { loading, hasMore, books, error };
};

export default useBookSearch;
