import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PersonCard from "../components/PersonCard";
import TvCard from "../components/TvCard";
import Api from "../data/Api";
import Nav from "../data/Nav";
import Carousel from "../components/Carousel";
import "react-lazy-load-image-component/src/effects/blur.css";
import User from "../data/User";
import Review from "../components/Review";
import ReviewsList from "../components/ReviewsLists";
import MovieShowLoading from "../components/MovieShowLoading";
import MovieShowTop from "../components/MovieShowTop";
import MovieShowOverview from "../components/MovieShowOverview";

export default function Series({ openIssues, msg }) {
  const { id } = useParams();
  const location = useLocation();
  const api = useSelector((state) => state.api);
  const user = useSelector((state) => state.user);

  const [onServer, setOnServer] = useState(false);
  const [requested, setRequested] = useState(false);
  const [trailer, setTrailer] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const stateRef = useRef({ id, pathname: location.pathname });
  useEffect(() => {
    stateRef.current = { id, pathname: location.pathname };
  }, [id, location.pathname]);

  const storePos = useCallback(() => {
    let page = document.querySelectorAll(".page-wrap")[0];
    if (!page) return;
    let carouselsData = document.querySelectorAll(".carousel");
    let carousels = [];
    carouselsData.forEach((carousel) => {
      carousels.push(carousel.scrollLeft);
    });
    Nav.storeNav(stateRef.current.pathname, false, page.scrollTop, carousels);
  }, []);

  const getPosition = useCallback(() => {
    let page = document.querySelectorAll(".page-wrap")[0];
    if (!page) return;
    let scrollY = 0;
    let pHist = Nav.getNav(location.pathname);
    if (pHist) {
      scrollY = pHist.scroll;
      document.querySelectorAll(".carousel").forEach((carousel, i) => {
        carousel.scrollLeft = pHist.carousels[i];
      });
    }
    page.scrollTop = scrollY;
  }, [location.pathname]);

  const getRequests = useCallback(() => {
    let requests = user.requests;
    if (!requests) return;
    if (!requests[id]) {
      if (requested) {
        setRequested(false);
      }
      return;
    }
    let requestUsers = Object.keys(requests[id].users).length;
    if (
      api.series_lookup[id] &&
      user.requests[id] &&
      requestUsers !== requested &&
      user.requests[id].seasons &&
      api.series_lookup[id].seasons
    ) {
      if (
        !user.requests[id].seasons ||
        Object.keys(user.requests[id].seasons).length ===
          Object.keys(api.series_lookup[id].seasons).length
      ) {
        setRequested(requestUsers);
      }
    } else if (!requests[id] && requested) {
      setRequested(false);
    }
  }, [id, user.requests, api.series_lookup, requested]);

  const getReviews = useCallback(() => {
    User.getReviews(id);
  }, [id]);

  const getSeries = useCallback(() => {
    if (!api.series_lookup[id]) {
      Api.series(id);
    } else if (api.series_lookup[id].isMinified) {
      Api.series(id);
    }
  }, [id, api.series_lookup]);

  const init = useCallback(() => {
    getSeries();
    getRequests();
    getReviews();
    getPosition();
  }, [getSeries, getRequests, getReviews, getPosition]);

  // Initial mount and unmount
  useEffect(() => {
    init();
    return () => {
      storePos();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle route / ID change
  const prevIdRef = useRef(id);
  useEffect(() => {
    if (prevIdRef.current !== id) {
      storePos();
      setOnServer(false);
      setRequested(false);
      init();
      prevIdRef.current = id;
    }
  }, [id, init, storePos]);

  useEffect(() => {
    getRequests();
  }, [user.requests, getRequests]);

  const request = async () => {
    let series = api.series_lookup[id];
    let requests = user.requests[id];
    if (requests) {
      if (
        (requests.users.includes(user.current.id) &&
          !user.requests[id].seasons) ||
        (user.requests[id].seasons &&
          Object.keys(user.requests[id].seasons).length ===
            Object.keys(api.series_lookup[id].seasons).length)
      ) {
        msg({
          message: "Already Requested",
          type: "error",
        });
        return;
      }
    }
    let seasons = {};
    if (series.seasons.length > 0) {
      series.seasons.forEach((season) => {
        seasons[season.season_number] = true;
      });
    }
    let requestPayload = {
      id: series.id,
      tmdb_id: series.id,
      tvdb_id: series.tvdb_id,
      imdb_id: series.imdb_id,
      title: series.name,
      type: "tv",
      thumb: series.poster_path,
      seasons: seasons,
    };

    try {
      await User.request(requestPayload, user.current);
      msg({
        message: `New Request added: ${series.name}`,
        type: "good",
      });
      await User.getRequests();
      getRequests();
    } catch (err) {
      msg({
        message: err,
        type: "error",
      });
    }
  };

  const openReview = () => setReviewOpen(true);
  const closeReview = () => setReviewOpen(false);
  const showTrailer = () => setTrailer(!trailer);

  const seasonEpisodes = (seriesData, seasonNumber) => {
    let onServerSeason =
      seriesData &&
      seriesData.server_seasons &&
      seriesData.server_seasons[seasonNumber]
        ? seriesData.server_seasons[seasonNumber]
        : false;
    return {
      onServer: onServerSeason ? true : false,
      seasonNumber: seasonNumber,
      availableEps: onServerSeason ? Object.keys(onServerSeason.episodes).length : 0,
      totalEps:
        seriesData &&
        seriesData.seasonData &&
        seriesData.seasonData[seasonNumber]
          ? Object.keys(seriesData.seasonData[seasonNumber].episodes).length
          : 0,
    };
  };

  let seriesData = api.series_lookup[id];

  if (!seriesData || seriesData.isMinified) {
    return <MovieShowLoading />;
  }

  if (seriesData.error) {
    return (
      <div className="media-wrap">
        <p className="main-title">Series Not Found</p>
        <p>
          This show may have been removed from TMDb or the link you've
          followed is invalid
        </p>
      </div>
    );
  }

  let related = null;
  let relatedItems = null;
  if (seriesData.recommendations) {
    relatedItems = seriesData.recommendations.map((key) => {
      return (
        <TvCard
          key={`related-${key}`}
          msg={msg}
          series={{ id: key }}
        />
      );
    });
    related = (
      <section>
        <h3 className="sub-title mb--1">Related Shows</h3>
        <Carousel>{relatedItems}</Carousel>
      </section>
    );
  }

  let seasonsList = seriesData.seasons;

  let video = false;
  if (seriesData.videos && seriesData.videos.results) {
    for (let i = 0; i < seriesData.videos.results.length; i++) {
      let vid = seriesData.videos.results[i];
      if (vid.site === "YouTube" && !video) {
        video = vid;
      }
    }
  }

  return (
    <div
      className="media-wrap"
      data-id={seriesData.imdb_id}
      key={`${seriesData.title}__wrap`}
    >
      <Review
        id={id}
        msg={msg}
        user={user.current}
        active={reviewOpen}
        closeReview={closeReview}
        getReviews={getReviews}
        item={seriesData}
      />
      <MovieShowTop
        mediaData={seriesData}
        video={video}
        trailer={trailer}
        requested={requested}
        request={request}
        openIssues={openIssues}
        showTrailer={showTrailer}
      />

      <div className="media-content">
        <MovieShowOverview
          mediaData={seriesData}
          video={video}
          user={user}
          showTrailer={showTrailer}
          match={{ params: { id } }}
          openReview={openReview}
          requested={requested}
          request={request}
          externalReviews={seriesData.reviews}
          openIssues={openIssues}
          trailer={trailer}
        />

        <section>
          <h3 className="sub-title mb--1">Seasons</h3>
          <Carousel>
            {seasonsList.map((season) => {
              let seasonInfo = seasonEpisodes(seriesData, season.season_number);
              let requestedSeason =
                user.requests[id] &&
                user.requests[id].seasons &&
                user.requests[id].seasons[season.season_number]
                  ? true
                  : false;
              return (
                <div
                  className={`card type--movie-tv img-loaded ${
                    seasonInfo.onServer ? "on-server" : ""
                  } ${requestedSeason ? "requested" : ""}`}
                  data-season_no={season.season_number}
                  data-total_eps={seasonInfo.totalEps}
                  data-avail_eps={seasonInfo.availableEps}
                  key={`season--${season.season_number}${id}`}
                >
                  <div className="card--inner">
                    <Link
                      to={`/series/${id}/season/${season.season_number}`}
                      className="full-link"
                    ></Link>
                    <div className="image-wrap">
                      {season.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
                          alt={season.name}
                        />
                      ) : seriesData.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${seriesData.poster_path}`}
                          alt={season.name}
                        />
                      ) : null}
                      <div className="ep-count">
                        {seasonInfo.availableEps} / {seasonInfo.totalEps}
                      </div>
                    </div>
                    <div className="text-wrap">
                      <p className="title">
                        {season.name}
                        <span className="year">
                          {season.air_date
                            ? "(" +
                              new Date(season.air_date).getFullYear() +
                              ")"
                            : ""}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </section>
        <section>
          <h3 className="sub-title mb--1">Cast</h3>
          <Carousel>
            {seriesData.credits.cast.map((cast) => {
              return (
                <PersonCard
                  key={`${cast.name}--${cast.character}`}
                  person={cast}
                  character={cast.character}
                />
              );
            })}
          </Carousel>
        </section>
        {related}

        <section>
          <h3 className="sub-title mb--1">Reviews</h3>
          {user.reviews ? (
            <ReviewsList
              reviews={user.reviews[id]}
              external={seriesData.reviews}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
