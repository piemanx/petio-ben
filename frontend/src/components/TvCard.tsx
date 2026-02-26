import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Api from "../data/Api";
import User from "../data/User";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { ReactComponent as RequestIcon } from "../assets/svg/request.svg";

interface Series {
  id: number | string;
  on_server?: boolean;
  name?: string;
  imdb_id?: string;
  tvdb_id?: string | number;
  poster_path?: string;
  first_air_date?: string;
}

interface TvCardProps {
  series: Series;
  width?: number;
  view?: boolean;
  msg?: (message: any) => void;
  popular_count?: number | string;
  character?: string;
}

const TvCard: React.FC<TvCardProps> = (props) => {
  const [inView, setInView] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const api = useSelector((state: any) => state.api);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if (inView) return;

    const checkInView = () => {
      if (!cardRef.current) return;
      const left = cardRef.current.getBoundingClientRect().left;
      if (left <= (props.width || 0) * 2 || props.view) {
        setInView(true);
        getSeries();
      }
    };

    checkInView();
  });

  const getSeries = () => {
    let series = props.series;
    let id = series.id;
    if (!api.series_lookup[id]) {
      if (!id) return false;
      Api.series(id, true);
    }
  };

  const request = async () => {
    let id = props.series.id;
    let series = api.series_lookup[id];

    let requestData = {
      id: series.id,
      tmdb_id: series.id,
      tvdb_id: series.tvdb_id,
      imdb_id: series.imdb_id,
      title: series.name,
      type: "tv",
      thumb: series.poster_path,
    };

    try {
      await User.request(requestData, user.current);
      if (props.msg) {
        props.msg({
          message: `New Request added: ${series.name}`,
          type: "good",
        });
      }
      await User.getRequests();
    } catch (err) {
      if (props.msg) {
        props.msg({
          message: err,
          type: "error",
        });
      }
    }
  };

  const onImgLoad = () => {
    setImgLoaded(true);
  };

  let id = props.series.id;
  if (!id || id === "false") {
    return null;
  }
  let series = api.series_lookup[id];

  if (!series) {
    return (
      <div
        ref={cardRef}
        key={id}
        data-key={id}
        className={"card type--movie-tv "}
      >
        <div className="card--inner">
          <Link to={`/series/${id}`} className="full-link"></Link>
          <div className="image-wrap">
            <div className="no-poster"></div>
          </div>
          <div className="text-wrap">
            <p className="title">
              Loading...
              <span className="year"></span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  let img = series.poster_path ? (
    <LazyLoadImage
      alt={series.name || series.title}
      src={`https://image.tmdb.org/t/p/w200${series.poster_path}`}
      onLoad={onImgLoad}
    />
  ) : (
    <LazyLoadImage
      src={`${window.location.pathname.replace(/\/$/, "")}/images/no-poster.jpg`}
      alt={series.name || series.title}
      onLoad={onImgLoad}
    />
  );

  return (
    <div
      ref={cardRef}
      key={series.id}
      data-key={series.id}
      className={`card type--movie-tv ${series.on_server ? "on-server" : ""} ${
        user.requests && user.requests[series.id] ? "requested" : ""
      } ${imgLoaded ? "img-loaded" : "img-not-loaded"}`}
    >
      <div className="card--inner">
        <Link to={`/series/${series.id}`} className="full-link"></Link>
        {(!user.requests || !user.requests[series.id]) && !series.on_server ? (
          <div className="quick-req" title="Request now" onClick={request}>
            <RequestIcon />
          </div>
        ) : null}
        <div className="image-wrap">
          {props.popular_count ? (
            <p className="popular-card--count">{props.popular_count}</p>
          ) : null}
          {img}
        </div>
        <div className="text-wrap">
          <p className="title">
            {series.name}
            <span className="year">
              {props.character
                ? props.character
                : series.first_air_date
                ? "(" + new Date(series.first_air_date).getFullYear() + ")"
                : null}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TvCard;
