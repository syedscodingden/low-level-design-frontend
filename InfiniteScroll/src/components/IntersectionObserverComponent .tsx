import React, { useRef, useState, useCallback } from "react";
import useBookSearch from "../hooks/useBookSearch.js";
import { Grid } from "@mui/material";
import TitleCard from "../ui/TitleCard.js";

interface IntersectionObserverInstance {
  observe: (target: HTMLElement) => void;
  disconnect: () => void;
}

const IntersectionObserverComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPageNumber(1);
  };

  const { books, hasMore, loading, error } = useBookSearch({
    query: searchQuery,
    pageNumber,
  });

  const observer = useRef<IntersectionObserverInstance | null>(null);

  const lastBookElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <input type={"text"} value={searchQuery} onChange={handleChange} />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <Grid item xs={6} md={4} key={index}>
                <TitleCard bookName={book} forwardedRef={lastBookElementRef} />
              </Grid>
            );
          } else {
            return (
              <Grid item xs={6} md={4} key={index}>
                <TitleCard bookName={book} forwardedRef={null} />
              </Grid>
            );
          }
        })}
      </Grid>
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </>
  );
};

export default IntersectionObserverComponent;
