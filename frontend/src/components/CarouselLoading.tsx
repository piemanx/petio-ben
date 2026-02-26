import React from "react";

const CarouselLoading: React.FC = () => {
  return (
    <div className="carousel-loading">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className={`carousel-loading-item carousel-loading-item-${item}`}>
          <div className="carousel-loading-item--inner"></div>
          <div className="text-wrap">
            <p className="title">
              &nbsp;
              <span className="year">&nbsp;</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarouselLoading;
