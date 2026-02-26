import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as TrailerIcon } from "../assets/svg/video.svg";
import { ReactComponent as ResIconHd } from "../assets/svg/720p.svg";
import { ReactComponent as ResIconFHd } from "../assets/svg/1080p.svg";
import { ReactComponent as ResIconUHd } from "../assets/svg/4k.svg";
import { ReactComponent as StarIcon } from "../assets/svg/star.svg";
import { ReactComponent as Spinner } from "../assets/svg/spinner.svg";

import { ReactComponent as RequestIcon } from "../assets/svg/request.svg";
import { ReactComponent as ReportIcon } from "../assets/svg/report.svg";
import { ReactComponent as CheckIcon } from "../assets/svg/check.svg";

import { ReactComponent as GenreAction } from "../assets/svg/genres/action.svg";
import { ReactComponent as GenreAdventure } from "../assets/svg/genres/adventure.svg";
import { ReactComponent as GenreAnimation } from "../assets/svg/genres/animation.svg";
import { ReactComponent as GenreComedy } from "../assets/svg/genres/comedy.svg";
import { ReactComponent as GenreCrime } from "../assets/svg/genres/crime.svg";
import { ReactComponent as GenreDocumentary } from "../assets/svg/genres/documentary.svg";
import { ReactComponent as GenreDrama } from "../assets/svg/genres/drama.svg";
import { ReactComponent as GenreFamily } from "../assets/svg/genres/family.svg";
import { ReactComponent as GenreFantasy } from "../assets/svg/genres/fantasy.svg";
import { ReactComponent as GenreHistory } from "../assets/svg/genres/history.svg";
import { ReactComponent as GenreHorror } from "../assets/svg/genres/horror.svg";
import { ReactComponent as GenreMusic } from "../assets/svg/genres/music.svg";
import { ReactComponent as GenreMystery } from "../assets/svg/genres/mystery.svg";
import { ReactComponent as GenreRomance } from "../assets/svg/genres/romance.svg";
import { ReactComponent as GenreScienceFiction } from "../assets/svg/genres/science-fiction.svg";
import { ReactComponent as GenreTvMovie } from "../assets/svg/genres/tv-movie.svg";
import { ReactComponent as GenreThriller } from "../assets/svg/genres/thriller.svg";
import { ReactComponent as GenreWar } from "../assets/svg/genres/war.svg";
import { ReactComponent as GenreWestern } from "../assets/svg/genres/western.svg";
import { ReactComponent as GenreAnime } from "../assets/svg/genres/anime.svg";

import { ReactComponent as ImdbIcon } from "../assets/svg/imdb.svg";
import { ReactComponent as TmdbIcon } from "../assets/svg/tmdb-sm.svg";

import { isIOS } from "react-device-detect";

interface MovieShowOverviewProps {
  mediaData: any;
  video: any;
  user: any;
  showTrailer: () => void;
  match: any;
  openReview: () => void;
  externalReviews: any[];
  openIssues: () => void;
  requested: any;
  request: () => void;
  trailer: boolean;
  requestPending: boolean;
  season?: string | number;
}

const findNested = (obj: any, key: string, value: string): any => {
  if (!obj) return null;
  if (obj[key] === value) {
    return obj;
  } else {
    for (let i = 0, len = Object.keys(obj).length; i < len; i++) {
      if (typeof obj[i] === "object") {
        let found = findNested(obj[i], key, value);
        if (found) {
          return found;
        }
      }
    }
  }
};

const timeConvert = (n: number) => {
  let num = n;
  let hours = num / 60;
  let rhours = Math.floor(hours);
  let minutes = (hours - rhours) * 60;
  let rminutes = ("0" + Math.round(minutes)).slice(-2);
  let hrs = rhours < 1 ? "" : rhours === 1 ? "hr" : rhours > 1 ? "hrs" : "";
  return `${rhours >= 1 ? rhours : ""}${hrs}${rminutes}m`;
};

const genreIcon = (name: string) => {
  switch (name) {
    case "Action":
      return <GenreAction />;
    case "Adventure":
      return <GenreAdventure />;
    case "Animation":
      return <GenreAnimation />;
    case "Comedy":
      return <GenreComedy />;
    case "Crime":
      return <GenreCrime />;
    case "Documentary":
      return <GenreDocumentary />;
    case "Drama":
      return <GenreDrama />;
    case "Family":
      return <GenreFamily />;
    case "Fantasy":
      return <GenreFantasy />;
    case "History":
      return <GenreHistory />;
    case "Horror":
      return <GenreHorror />;
    case "Music":
      return <GenreMusic />;
    case "Mystery":
      return <GenreMystery />;
    case "Romance":
      return <GenreRomance />;
    case "Science Fiction":
      return <GenreScienceFiction />;
    case "TV Movie":
      return <GenreTvMovie />;
    case "Thriller":
      return <GenreThriller />;
    case "War":
      return <GenreWar />;
    case "Western":
      return <GenreWestern />;
    case "Action & Adventure":
      return (
        <>
          <GenreAction />
          <GenreAdventure />
        </>
      );
    case "Kids":
      return <GenreFamily />;
    case "News":
      return null;
    case "Reality":
      return null;
    case "Sci-Fi & Fantasy":
      return (
        <>
          <GenreScienceFiction />
          <GenreFantasy />
        </>
      );
    case "Soap":
      return <GenreTvMovie />;
    case "Talk":
      return null;
    case "War & Politics ":
      return <GenreWar />;
    case "anime":
      return <GenreAnime />;
    default:
      return null;
  }
};

const MovieShowOverview: React.FC<MovieShowOverviewProps> = (props) => {
  let criticRating = props.mediaData.vote_average;

  let director = findNested(
    props.mediaData.credits.crew,
    "job",
    "Director"
  );

  let screenplay = findNested(
    props.mediaData.credits.crew,
    "job",
    "Screenplay"
  );

  let userRating = "Not Reviewed";
  let userRatingVal = 0;

  let typeRequest = props.mediaData.episode_run_time
    ? props.season
      ? `season ${props.season}`
      : "show"
    : "";

  let requestBtn = props.requestPending ? (
    <button className="btn btn__square pending">
      <Spinner />
      Request
    </button>
  ) : props.mediaData.on_server ? (
    isIOS ? (
      <a
        href={`plex://preplay/?metadataKey=%2Flibrary%2Fmetadata%2F${props.mediaData.on_server.ratingKey}&metadataType=1&server=${props.mediaData.on_server.serverKey}`}
        target="_blank"
        rel="noreferrer"
        className="btn btn__square good"
      >
        <CheckIcon />
        Watch now
      </a>
    ) : (
      <a
        href={`https://app.plex.tv/desktop#!/server/${props.mediaData.on_server.serverKey}/details?key=%2Flibrary%2Fmetadata%2F${props.mediaData.on_server.ratingKey}`}
        target="_blank"
        rel="noreferrer"
        className="btn btn__square good"
      >
        <CheckIcon />
        Watch now
      </a>
    )
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

  let hasReviewed: any = false;
  if (props.user.reviews) {
    if (
      props.user.reviews[props.match.params.id] ||
      props.externalReviews
    ) {
      let ratingsUser = 0;
      let ignore = 0;
      let total = 0;
      if (props.user.reviews[props.match.params.id]) {
        for (
          let i = 0;
          i < props.user.reviews[props.match.params.id].length;
          i++
        ) {
          if (
            props.user.reviews[props.match.params.id][i].user ==
            props.user.current.id
          ) {
            hasReviewed =
              props.user.reviews[props.match.params.id][i];
          }
        }
        if (
          Object.keys(props.user.reviews[props.match.params.id])
            .length > 0
        ) {
          Object.keys(
            props.user.reviews[props.match.params.id]
          ).map((r) => {
            ratingsUser +=
              (props.user.reviews[props.match.params.id][r].score /
                10) *
              100;
          });
        }
        total += Object.keys(
          props.user.reviews[props.match.params.id]
        ).length;
      }

      if (props.externalReviews) {
        props.externalReviews.map((r) => {
          if (r.author_details.rating === null) {
            ignore++;
          } else {
            ratingsUser += (r.author_details.rating / 10) * 100;
          }
        });
        total += props.externalReviews.length;
      }

      userRating = ratingsUser
        ? `${(ratingsUser / (total - ignore)).toFixed(0)}% (${
            total - ignore
          } reviews)`
        : "Not Reviewed";

      userRatingVal = ratingsUser / (total - ignore);
    }
  }
  let reviewBtn = (
    <button
      className="btn btn__square"
      onClick={!hasReviewed ? props.openReview : undefined}
    >
      {!hasReviewed ? (
        <>
          <StarIcon />
          Review
        </>
      ) : (
        <>
          <StarIcon />
          Reviewed {(hasReviewed.score / 10) * 100}%
        </>
      )}
    </button>
  );

  let trailerBtn = props.video ? (
    <button onClick={props.showTrailer} className="btn btn__square">
      <TrailerIcon />
      {props.trailer ? "Close Trailer" : "Trailer"}
    </button>
  ) : null;

  return (
    <section>
      <div className="quick-view">
        <div className="side-content">
          <div className="media-action">
            {trailerBtn}
            {reviewBtn}
            {props.mediaData.available_resolutions ? (
              <div className="resolutions">
                {props.mediaData.available_resolutions.includes("4k") ? (
                  <ResIconUHd />
                ) : null}
                {props.mediaData.available_resolutions.includes(
                  "1080"
                ) ? (
                  <ResIconFHd />
                ) : null}
                {props.mediaData.available_resolutions.includes(
                  "720"
                ) ? (
                  <ResIconHd />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className="detail--wrap">
          <div className="detail--content">
            <div className="detail--bar">
              <p>
                {props.mediaData.release_date
                  ? new Date(props.mediaData.release_date).getFullYear()
                  : null}
                {props.mediaData.first_air_date
                  ? new Date(
                      props.mediaData.first_air_date
                    ).getFullYear()
                  : null}
                {!props.mediaData.release_date &&
                !props.mediaData.first_air_date
                  ? "Unknown"
                  : null}
              </p>
              <div className="detail--bar--sep">·</div>
              <p className="runtime" title="Running Time">
                {props.mediaData.runtime
                  ? timeConvert(props.mediaData.runtime)
                  : props.mediaData.episode_run_time
                  ? props.mediaData.episode_run_time.length > 0
                    ? timeConvert(
                        Array.isArray(props.mediaData.episode_run_time)
                          ? props.mediaData.episode_run_time[0]
                          : props.mediaData.episode_run_time
                      )
                    : "Unknown"
                  : "Not Available"}
              </p>
              <div className="detail--bar--sep">·</div>
              <p>
                <a
                  href={`https://www.themoviedb.org/${
                    props.mediaData.seasons ? "tv" : "movie"
                  }/${props.mediaData.id}`}
                  className="rating-icon"
                  target="_blank"
                  rel="noreferrer"
                >
                  <TmdbIcon />
                </a>
                <span
                  className={`rating color-${
                    criticRating > 7.9
                      ? "green"
                      : criticRating > 6.9
                      ? "blue"
                      : criticRating > 4.9
                      ? "orange"
                      : "red"
                  }`}
                >
                  {criticRating}
                </span>
              </p>
              {props.mediaData.imdb_data && props.mediaData.imdb_data.rating ? (
                <>
                  <div className="detail--bar--sep">·</div>
                  <p>
                    <a
                      href={`https://www.imdb.com/title/${props.mediaData.imdb_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rating-icon"
                    >
                      <ImdbIcon />
                    </a>
                    <span
                      className={`rating color-${
                        props.mediaData.imdb_data.rating.ratingValue >
                        7.9
                          ? "green"
                          : props.mediaData.imdb_data.rating
                              .ratingValue > 6.9
                          ? "blue"
                          : props.mediaData.imdb_data.rating
                              .ratingValue > 4.9
                          ? "orange"
                          : "red"
                      }`}
                    >
                      {props.mediaData.imdb_data.rating.ratingValue}
                    </span>
                  </p>
                </>
              ) : null}
              <div className="detail--bar--sep">·</div>
              <p>
                <span
                  className="desktop-only"
                  style={{ cursor: "help" }}
                  title="Petio reviews are a combination of Petio users on this server and external user reviews."
                >
                  Petio:{" "}
                </span>
                <span
                  className={`rating d-nm color-${
                    userRatingVal > 79
                      ? "green"
                      : userRatingVal > 69
                      ? "blue"
                      : userRatingVal > 49
                      ? "orange"
                      : "red"
                  }`}
                >
                  {userRating}
                </span>
              </p>
              {props.mediaData.original_language_format ? (
                <>
                  <div className="detail--bar--sep">·</div>
                  <p>
                    <span className="desktop-only">Language: </span>
                    <span className="item-val">
                      {props.mediaData.original_language_format}
                    </span>
                  </p>
                </>
              ) : null}
              {props.mediaData.age_rating ? (
                <>
                  <div className="detail--bar--sep">·</div>
                  <p>
                    <span className="desktop-only">Rated </span>
                    <span className="item-val">
                      {props.mediaData.age_rating}
                    </span>
                  </p>
                </>
              ) : null}
            </div>
            <div className="genre--wrap">
              {props.mediaData.genres.map((genre: any) => {
                return (
                  <Link
                    to={`/genre/${
                      props.mediaData.seasons ? "tv" : "movie"
                    }/${genre.id}`}
                    key={`genre_${genre.name}`}
                    className="genre--item"
                  >
                    {genreIcon(genre.name)}
                    {genre.name}
                  </Link>
                );
              })}
              {Object.keys(props.mediaData.keywords.results).length > 0
                ? props.mediaData.keywords.results.map((genre: any) => {
                    let customGenres = [210024];
                    if (customGenres.includes(genre.id))
                      return (
                        <Link
                          to={`/genre/${
                            props.mediaData.seasons ? "tv" : "movie"
                          }/${genre.id}`}
                          key={`genre_${genre.name}`}
                          className="genre--item"
                          style={{ textTransform: "capitalize" }}
                        >
                          {genreIcon(genre.name)}
                          {genre.name}
                        </Link>
                      );
                    return null;
                  })
                : null}
            </div>
            <div className="media--actions__mob">
              {requestBtn}
              {reportBtn}
              {reviewBtn}
              {trailerBtn}
            </div>
            <div className="companies--wrap">
              {props.mediaData.production_companies && props.mediaData.production_companies.length > 0
                ? props.mediaData.production_companies.map((co: any) => {
                    if (!co.logo_path) return null;
                    return (
                      <div className="companies--item" key={`co__${co.id}`}>
                        <Link to={`/company/${co.id}`} title={co.name}>
                          <img
                            src={`https://image.tmdb.org/t/p/w185_filter(duotone,ffffff,868c96)${co.logo_path}`}
                            alt={co.name}
                          />
                        </Link>
                      </div>
                    );
                  })
                : null}
            </div>
            <div className="networks--wrap">
              {props.mediaData.networks && props.mediaData.networks.length > 0
                ? props.mediaData.networks.map((network: any) => {
                    if (!network.logo_path) return null;
                    return (
                      <div
                        className="networks--item"
                        key={`net__${network.id}`}
                      >
                        <Link
                          to={`/networks/${network.id}`}
                          title={network.name}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w185_filter(duotone,ffffff,868c96)${network.logo_path}`}
                            alt={network.name}
                          />
                        </Link>
                      </div>
                    );
                  })
                : null}
            </div>
            <div className="media-crew">
              {props.mediaData.created_by
                ? props.mediaData.created_by.map((creator: any) => {
                    return (
                      <div
                        key={`cb__${creator.id}`}
                        className="media-crew--item"
                      >
                        <p className="sub-title">Created By</p>
                        <Link
                          to={`/person/${creator.id}`}
                          className="crew-credit"
                        >
                          {creator.name}
                        </Link>
                      </div>
                    );
                  })
                : null}
              {director ? (
                <div className="media-crew--item">
                  <p className="sub-title">Director</p>
                  <Link to={`/person/${director.id}`} className="crew-credit">
                    {director.name}
                  </Link>
                </div>
              ) : null}
              {screenplay ? (
                <div className="media-crew--item">
                  <p className="sub-title">Screenplay</p>
                  <Link
                    to={`/person/${screenplay.id}`}
                    className="crew-credit"
                  >
                    {screenplay.name}
                  </Link>
                </div>
              ) : null}
            </div>
            <p className="sub-title mb--1">Synopsis</p>
            <p className="overview">{props.mediaData.overview}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieShowOverview;
