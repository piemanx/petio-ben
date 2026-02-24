import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

const CompanyCard = (props) => {
  const [inView, setInView] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (inView) return;

    const checkInView = () => {
      if (!cardRef.current) return;
      const left = cardRef.current.getBoundingClientRect().left;
      if (left <= props.width * 2 || props.view) {
        setInView(true);
      }
    };

    checkInView();
  });

  const onImgLoad = () => {
    setImgLoaded(true);
  };

  const company = props.company;
  return (
    <div
      ref={cardRef}
      key={`co__${company.id}`}
      data-key={`co__${company.id}`}
      className={`card company-card ${
        imgLoaded ? "img-loaded" : "img-not-loaded"
      }`}
    >
      <div className="company-card--inner">
        <Link to={`/company/${company.id}`} className="full-link"></Link>
        {company.logo_path ? (
          <div className="company-card--image">
            <LazyLoadImage
              alt={company.name}
              src={`https://image.tmdb.org/t/p/w500_filter(duotone,ffffff,868c96)${company.logo_path}`}
              onLoad={onImgLoad}
            />
          </div>
        ) : (
          <div className="company-card--name">
            <p>{company.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
