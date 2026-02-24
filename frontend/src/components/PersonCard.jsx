import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const PersonCard = (props) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const onImgLoad = () => {
    setImgLoaded(true);
  };

  let knownFor = null;
  let person = props.person;
  if (!person || person.gender === 0) {
    return null;
  }
  if (person.known_for && person.known_for.length) {
    person.known_for.map((item) => {
      return (
        <Link key={`${item.id}__kf`} to={`/movie/${item.id}`}>
          {item.title}
        </Link>
      );
    });
  }

  return (
    <div
      key={person.id}
      className={`card person-card ${
        imgLoaded ? "img-loaded" : "img-not-loaded"
      }`}
    >
      <div className="card--inner">
        <Link to={`/person/${person.id}`} className="full-link"></Link>
        <div className="image-wrap">
          <LazyLoadImage
            alt={person.name}
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                : `${window.location.pathname.replace(
                    /\/$/,
                    ""
                  )}/images/no-poster-person.jpg`
            }
            onLoad={onImgLoad}
          />
        </div>
        <div className="text-wrap">
          <p className="title">{person.name}</p>
          {knownFor ? <p className="known-for">{knownFor}</p> : null}
          {props.character ? (
            <p className="character">{props.character}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
