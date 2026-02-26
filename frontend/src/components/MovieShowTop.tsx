import React, { useState, useEffect } from "react";
import { ReactComponent as RequestIcon } from "../assets/svg/request.svg";
import { ReactComponent as ReportIcon } from "../assets/svg/report.svg";
import { ReactComponent as CheckIcon } from "../assets/svg/check.svg";
import { ReactComponent as Spinner } from "../assets/svg/spinner.svg";
import { ReactComponent as CloseIcon } from "../assets/svg/close.svg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactPlayer from "react-player/youtube";

interface MovieShowTopProps {
  mediaData: any;
  video: any;
  trailer: boolean;
  requested: any;
  request: () => void;
  openIssues: () => void;
  showTrailer: () => void;
  requestPending?: boolean;
  season?: string | number;
}

const MovieShowTop: React.FC<MovieShowTopProps> = (props) => {
  const [bgSize, setBgSize] = useState<string>("/w300");

  useEffect(() => {
    const handleResize = () => {
      let size = "/w300";
      let width = window.innerWidth;
      if (width > 300) {
        size = "/w780";
      }
      if (width > 780) {
        size = "/w1280";
      }
      setBgSize(size);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let typeRequest = props.mediaData.episode_run_time
    ? props.season
      ? `season ${props.season}`
      : "show"
    : "";
  let requestBtn = props.requestPending ? (
    <button className="btn btn__square pending">
      <Spinner />
      Request {typeRequest}
    </button>
  ) : props.mediaData.on_server ? (
    <a
      href={`https://app.plex.tv/desktop#!/server/${props.mediaData.on_server.serverKey}/details?key=%2Flibrary%2Fmetadata%2F${props.mediaData.on_server.ratingKey}`}
      target="_blank"
      rel="noreferrer"
      className="btn btn__square good"
    >
      <CheckIcon />
      Watch now
    </a>
  ) : props.requested ? (
    <button className="btn btn__square blue" onClick={props.request}>
      {`Requested by ${props.requested}
      ${props.requested > 1 ? "users" : "user"}`}
    </button>
  ) : (
    <button className="btn btn__square" onClick={props.request}>
      <RequestIcon />
      Request {typeRequest}
    </button>
  );

  let reportBtn = props.mediaData.on_server ? (
    <button className="btn btn__square" onClick={props.openIssues}>
      <ReportIcon />
      Report an issue
    </button>
  ) : null;

  let video = props.video;

  return (
    <div className={`media-top ${props.trailer ? "show-trailer" : ""}`}>
      <div
        className="media-backdrop"
        key={`${props.mediaData.title}__backdrop__${
          props.trailer ? "trailer" : "n_trailer"
        }`}
      >
        <div
          className="media-trailer--close"
          onClick={() => props.showTrailer()}
        >
          <CloseIcon />
        </div>
        {video && props.trailer ? (
          <div className="media-trailer">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${video.key}`}
              playing={true}
              width="100%"
              height="100%"
              playsinline={true}
              onEnded={() => props.showTrailer()}
              onPause={() => props.showTrailer()}
              onError={(error: any) => console.log(error)}
            />
          </div>
        ) : null}
        {props.mediaData.backdrop_path ? (
          <LazyLoadImage
            src={`https://image.tmdb.org/t/p${bgSize}${props.mediaData.backdrop_path}`}
            alt={props.mediaData.title || props.mediaData.name}
            effect="blur"
            key={`${props.mediaData.title}__backdrop`}
          />
        ) : (
          <div className="no-backdrop"></div>
        )}
      </div>
      <div className="media-poster">
        <div className="media-poster__cap">
          <div className="media-poster--inner">
            {props.mediaData.poster_path ? (
              <LazyLoadImage
                src={
                  "https://image.tmdb.org/t/p/w500" +
                  props.mediaData.poster_path
                }
                alt={props.mediaData.title || props.mediaData.name}
                effect="blur"
                key={`${props.mediaData.title}__poster`}
              />
            ) : (
              <LazyLoadImage
                src={"/images/no-poster.jpg"}
                alt={props.mediaData.title || props.mediaData.name}
                effect="blur"
                key={`${props.mediaData.title}__nposter`}
              />
            )}
          </div>
        </div>
      </div>
      <div className="media-details">
        <span></span>
        <div className="media-details--top">
          {props.mediaData.logo ? (
            <LazyLoadImage
              className="media-logo"
              src={props.mediaData.logo}
            />
          ) : (
            <h1 className="single-title">
              {props.mediaData.title
                ? props.mediaData.title
                : props.mediaData.name}
            </h1>
          )}
        </div>
        <div className="media--actions">
          {requestBtn}
          {reportBtn}
        </div>
      </div>
    </div>
  );
};

export default MovieShowTop;
