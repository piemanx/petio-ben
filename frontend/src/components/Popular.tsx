import React, { useState, useEffect, useCallback } from "react";
import Api from "../data/Api";
import MovieCard from "./MovieCard";
import TvCard from "./TvCard";
import Carousel from "./Carousel";
import CarouselLoading from "./CarouselLoading";

interface PopularProps {
  type: "movie" | "series";
}

const Popular: React.FC<PopularProps> = ({ type }) => {
  const [topData, setTopData] = useState<any | false>(false);

  const getTop = useCallback(() => {
    Api.top(type)
      .then((res) => {
        setTopData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [type]);

  useEffect(() => {
    if (!topData) {
      getTop();
    }
  }, [topData, getTop]);

  if (type === "movie") {
    return (
      <section>
        <h3 className="sub-title mb--1">Popular on Plex</h3>
        {topData ? (
          <Carousel>
            {Object.keys(topData).map((t) => {
              if (
                !topData[t].item.tmdb_id ||
                topData[t].item.tmdb_id === "false"
              ) {
                return null;
              }
              return (
                <MovieCard
                  key={`${topData[t].item.tmdb_id}__top_movie`}
                  movie={{
                    id: topData[t].item.tmdb_id,
                  }}
                  popular_count={topData[t].globalViewCount}
                />
              );
            })}
          </Carousel>
        ) : (
          <CarouselLoading />
        )}
      </section>
    );
  } else {
    return (
      <section>
        <h3 className="sub-title mb--1">Popular on Plex</h3>
        {topData ? (
          <Carousel>
            {Object.keys(topData).map((t) => {
              if (
                !topData[t].item.tmdb_id ||
                topData[t].item.tmdb_id === "false"
              ) {
                return null;
              }
              return (
                <TvCard
                  key={`${topData[t].item.tmdb_id}__top_tv`}
                  series={{
                    id: topData[t].item.tmdb_id,
                  }}
                  popular_count={topData[t].globalViewCount}
                />
              );
            })}
          </Carousel>
        ) : (
          <CarouselLoading />
        )}
      </section>
    );
  }
};

export default Popular;
