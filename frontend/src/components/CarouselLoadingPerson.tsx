import React from 'react';

const CarouselLoadingPerson: React.FC = () => {
  return (
    <div className="carousel-loading carousel-loading-person">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className={`carousel-loading-item carousel-loading-item-${item}`}>
          <div className="carousel-loading-item--inner"></div>
          <div className="text-wrap">
            <p className="title">
              <span className="year"></span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarouselLoadingPerson;
