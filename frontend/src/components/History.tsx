import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Api from "../data/Api";
import MovieCard from "./MovieCard";
import Carousel from "./Carousel";
import TvCard from "./TvCard";
import CarouselLoading from "./CarouselLoading";

interface HistoryProps {
  type: "movie" | "series";
}

const History: React.FC<HistoryProps> = ({ type }) => {
  const user = useSelector((state: any) => state.user);
  
  const [historyData, setHistoryData] = useState<any[] | false>(false);
  const [text, setText] = useState<string>("Loading");

  const getHistory = useCallback(async () => {
    if (user.current?.custom && !user.current?.altId) {
      setText("No history from the last 2 weeks.");
      return;
    }
    
    setHistoryData([]);
    
    try {
      const idToUse = user.current?.altId ? user.current.altId : user.current?.id;
      if (!idToUse) {
         setText("No history from the last 2 weeks.");
         return;
      }

      const res = await Api.history(idToUse, type);
      
      if (Object.keys(res).length === 0) {
        setText("No history from the last 2 weeks.");
      } else {
        setHistoryData(res);
      }
    } catch (err) {
      console.log(err);
      setText("No history from the last 2 weeks.");
    }
  }, [user.current, type]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  if (type === "movie") {
    return (
      <section>
        <h3 className="sub-title mb--1">Recently Viewed Movies by You</h3>
        <p>
          Be sure to review movies you watched to help other users decide
          what to watch!
        </p>
        {historyData && Object.keys(historyData).length > 0 ? (
          <Carousel>
            {Object.keys(historyData).map((t) => {
              if (!historyData[t as any].id || historyData[t as any].id === "false") {
                return null;
              }
              return (
                <MovieCard
                  key={historyData[t as any].id}
                  movie={{
                    id: historyData[t as any].id,
                  }}
                />
              );
            })}
          </Carousel>
        ) : text === "Loading" ? (
          <CarouselLoading />
        ) : (
          <p>{text}</p>
        )}
      </section>
    );
  } else {
    return (
      <section>
        <h3 className="sub-title mb--1">Recently Viewed TV Shows by You</h3>
        <p>
          Be sure to review shows you watched to help other users decide
          what to watch!
        </p>
        {historyData && Object.keys(historyData).length > 0 ? (
          <Carousel>
            {Object.keys(historyData).map((t) => {
              if (!historyData[t as any].id || historyData[t as any].id === "false") {
                return null;
              }
              return (
                <TvCard
                  key={historyData[t as any].id}
                  series={{
                    id: historyData[t as any].id,
                  }}
                />
              );
            })}
          </Carousel>
        ) : text === "Loading" ? (
          <CarouselLoading />
        ) : (
          <p>{text}</p>
        )}
      </section>
    );
  }
};

export default History;
