import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Api from "../data/Api";
import User from "../data/User";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { ReactComponent as RequestIcon } from "../assets/svg/request.svg";

interface Movie {
  id: number | string;
  on_server?: boolean;
  title?: string;
  imdb_id?: string;
  poster_path?: string;
  release_date?: string;
}

interface MovieCardProps {
  movie: Movie;
  width?: number;
  view?: boolean;
  msg?: (message: any) => void;
  popular_count?: number | string;
  character?: string;
}

const MovieCard: React.FC<MovieCardProps> = (props) => {
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
        getMovie();
      }
    };

    checkInView();
  });

  const getMovie = () => {
    let movie = props.movie;
    let id = movie.id;
    if (!api.movie_lookup[id]) {
      if (!id) return false;
      Api.movie(id, true);
    }
  };

  const request = async () => {
    let id = props.movie.id;
    let movie = api.movie_lookup[id];

    let requestData = {
      id: movie.id,
      imdb_id: movie.imdb_id,
      tmdb_id: movie.id,
      tvdb_id: "n/a",
      title: movie.title,
      thumb: movie.poster_path,
      type: "movie",
    };
    try {
      await User.request(requestData, user.current);
      if (props.msg) {
        props.msg({
          message: `New Request added: ${movie.title}`,
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

  let id = props.movie.id;

  if (!id || id === "false") {
    return null;
  }

  let movie = api.movie_lookup[id];

  // Loading state
  if (!movie) {
    return (
      <div
        ref={cardRef}
        key={id}
        data-key={id}
        className={`card type--movie-tv`}
      >
        <div className="card--inner">
          <Link to={`/movie/${id}`} className="full-link"></Link>
          <div className="image-wrap">
            <div className="no-poster"></div>
          </div>
          <div className="text-wrap">
            <p className="title">
              Loading...
              <span className="year">&nbsp;</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  let img = movie.poster_path ? (
    <LazyLoadImage
      alt={movie.title}
      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
      onLoad={onImgLoad}
    />
  ) : (
    <LazyLoadImage
      src={`${window.location.pathname.replace(/\/$/, "")}/images/no-poster.jpg`}
      alt={movie.title}
      onLoad={onImgLoad}
    />
  );

  return (
    <div
      ref={cardRef}
      key={movie.id}
      data-key={movie.id}
      className={`card type--movie-tv ${
        props.movie.on_server || movie.on_server ? "on-server" : ""
      } ${user.requests && user.requests[movie.id] ? "requested" : ""} ${
        imgLoaded ? "img-loaded" : "img-not-loaded"
      }`}
    >
      <div className="card--inner">
        <Link to={`/movie/${movie.id}`} className="full-link"></Link>
        {(!user.requests || !user.requests[movie.id]) && !movie.on_server ? (
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
          <p className="title" title={movie.title}>
            {movie.title}
            <span className="year">
              {props.character
                ? props.character
                : movie.release_date
                ? "(" + new Date(movie.release_date).getFullYear() + ")"
                : null}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
