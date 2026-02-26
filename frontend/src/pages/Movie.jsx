import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PersonCard from "../components/PersonCard";
import MovieCard from "../components/MovieCard";
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

export default function Movie({ openIssues, msg }) {
  const { id } = useParams();
  const location = useLocation();
  const api = useSelector((state) => state.api);
  const user = useSelector((state) => state.user);

  const [onServer, setOnServer] = useState(false);
  const [requested, setRequested] = useState(false);
  const [trailer, setTrailer] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [getPos, setGetPos] = useState(false);

  // Use refs to keep track of current state for the unmount hook
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
    Nav.storeNav(`/movie/${stateRef.current.id}`, false, page.scrollTop, carousels);
  }, []);

  const getPosition = useCallback(() => {
    let page = document.querySelectorAll(".page-wrap")[0];
    if (!page) return;
    let scrollY = 0;
    let pHist = Nav.getNav(stateRef.current.pathname);
    if (pHist) {
      scrollY = pHist.scroll;
      document.querySelectorAll(".carousel").forEach((carousel, i) => {
        carousel.scrollLeft = pHist.carousels[i];
      });
    }
    page.scrollTop = scrollY;
  }, []);

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
    if (user.requests[id] && requestUsers !== requested) {
      setRequested(requestUsers);
    }
  }, [id, user.requests, requested]);

  const getReviews = useCallback(() => {
    User.getReviews(id);
  }, [id]);

  const getMovie = useCallback(() => {
    if (!api.movie_lookup[id]) {
      Api.movie(id);
    } else if (api.movie_lookup[id].isMinified) {
      Api.movie(id);
    }
  }, [id, api.movie_lookup]);

  const init = useCallback(() => {
    getMovie();
    getRequests();
    getReviews();
    let pHist = Nav.getNav(location.pathname);
    if (pHist) {
      setGetPos(true);
    }
    getPosition();
  }, [getMovie, getRequests, getReviews, location.pathname, getPosition]);

  // Initial load & Unmount
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
      setTrailer(false);
      init();
      prevIdRef.current = id;
    }
  }, [id, init, storePos]);

  useEffect(() => {
    getRequests();
  }, [user.requests, getRequests]);

  useEffect(() => {
    if (getPos) {
      setGetPos(false);
      getPosition();
    }
  }, [getPos, getPosition]);

  const request = async () => {
    let movie = api.movie_lookup[id];
    let requests = user.requests[id];
    if (requests) {
      if (requests.users.includes(user.current.id)) {
        msg({
          message: `Already Requested`,
          type: "error",
        });
        return;
      }
    }
    setRequestPending(true);
    let requestPayload = {
      id: movie.id,
      imdb_id: movie.imdb_id,
      tmdb_id: movie.id,
      tvdb_id: "n/a",
      title: movie.title,
      thumb: movie.poster_path,
      type: "movie",
    };
    try {
      await User.request(requestPayload, user.current);
      msg({
        message: `New Request added: ${movie.title}`,
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
    setRequestPending(false);
  };

  const openReview = () => setReviewOpen(true);
  const closeReview = () => setReviewOpen(false);
  const showTrailer = () => setTrailer(!trailer);

  let movieData = null;
  if (api.movie_lookup[id]) movieData = api.movie_lookup[id];

  if (!movieData || movieData.isMinified || !user) {
    return <MovieShowLoading />;
  }

  if (movieData.error) {
    return (
      <div className="media-wrap">
        <p className="main-title">Movie Not Found</p>
        <p>
          This movie may have been removed from TMDb or the link you've
          followed is invalid
        </p>
      </div>
    );
  }

  let related = null;
  let relatedItems = null;
  if (movieData.recommendations) {
    relatedItems = movieData.recommendations.map((key) => {
      return (
        <MovieCard
          key={`related-${key}`}
          msg={msg}
          movie={{ id: key }}
        />
      );
    });
    related = (
      <section>
        <h3 className="sub-title mb--1">Related Movies</h3>
        <Carousel>{relatedItems}</Carousel>
      </section>
    );
  }

  let video = false;
  if (movieData.videos && movieData.videos.results) {
    for (let i = 0; i < movieData.videos.results.length; i++) {
      let vid = movieData.videos.results[i];
      if (vid.site === "YouTube" && !video) {
        video = vid;
      }
    }
  }

  return (
    <div
      className="media-wrap"
      data-id={movieData.imdb_id}
      key={`${movieData.title}__wrap`}
    >
      <Review
        id={id}
        msg={msg}
        user={user.current}
        active={reviewOpen}
        closeReview={closeReview}
        getReviews={getReviews}
        item={movieData}
      />
      <MovieShowTop
        mediaData={movieData}
        video={video}
        openIssues={openIssues}
        trailer={trailer}
        requested={requested}
        request={request}
        showTrailer={showTrailer}
        requestPending={requestPending}
      />
      <div className="media-content">
        <MovieShowOverview
          mediaData={movieData}
          video={video}
          user={user}
          showTrailer={showTrailer}
          match={{ params: { id } }}
          openReview={openReview}
          externalReviews={movieData.reviews}
          openIssues={openIssues}
          requested={requested}
          request={request}
          trailer={trailer}
          requestPending={requestPending}
        />
        <section>
          <h3 className="sub-title mb--1">Cast</h3>
          <Carousel>
            {movieData.credits.cast.map((cast) => {
              return (
                <PersonCard
                  key={`person--${cast.name}`}
                  person={cast}
                  character={cast.character}
                />
              );
            })}
          </Carousel>
        </section>
        {movieData.belongs_to_collection && movieData.collection.length > 0 ? (
          <section>
            <h3 className="sub-title mb--1">
              {movieData.belongs_to_collection.name}
            </h3>
            <Carousel>
              {movieData.collection
                .sort(function (a, b) {
                  return a - b;
                })
                .map((key) => {
                  return (
                    <MovieCard
                      key={`collection-${key}`}
                      msg={msg}
                      movie={{ id: key }}
                    />
                  );
                })}
            </Carousel>
          </section>
        ) : null}
        {related}
        <section>
          <h3 className="sub-title mb--1">Reviews</h3>
          {user.reviews ? (
            <ReviewsList
              reviews={user.reviews[id]}
              external={movieData.reviews}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
