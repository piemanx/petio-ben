import React, { useState } from "react";
import { ReactComponent as StarIcon } from "../assets/svg/star.svg";
import User from "../data/User";

interface ReviewProps {
  id: string | number;
  user: {
    id: string | number;
    [key: string]: any;
  };
  active: boolean;
  item: any;
  closeReview: () => void;
  getReviews: () => void;
  msg: (message: any) => void;
}

const Review: React.FC<ReviewProps> = ({
  id,
  user,
  active,
  item,
  closeReview,
  getReviews,
  msg,
}) => {
  const [rating, setRating] = useState<number>(0);

  const handleSetRating = (e: React.MouseEvent<HTMLDivElement>) => {
    const datasetRating = e.currentTarget.dataset.rating;
    if (datasetRating) {
      setRating(Number(datasetRating));
    }
  };

  const saveReview = async () => {
    try {
      let review = {
        score: rating,
        comment: "",
      };
      User.review(item, user.id, review);
      setTimeout(() => {
        closeReview();
        getReviews();
        setRating(0);
        msg({
          message: `Review saved`,
          type: "good",
        });
      }, 1000);
    } catch (err) {
      msg({
        message: `Error adding review`,
        type: "error",
      });
    }
  };

  let stars = [];
  for (let i = 0; i < 10; i++) {
    stars.push(
      <div
        key={`star__${i}`}
        className={`stars-1 star ${rating >= i + 1 ? "active" : ""}`}
        data-rating={i + 1}
        onClick={handleSetRating}
      >
        <StarIcon />
      </div>
    );
  }

  return (
    <div className={`review--wrap ${active ? "active" : ""}`}>
      <div className="review--inner">
        <div className="review--top">
          <h3>What did you think?</h3>
        </div>
        <div className="review--main">
          <p>
            Let other users know what you thought. Please note the review is not
            related to quality or issues, for issues please report an issue.
          </p>
          <div className="stars-wrap">{stars}</div>
          <div
            className="btn btn__square bad close-review"
            onClick={closeReview}
          >
            Cancel
          </div>
          <div className="btn btn__square save-review" onClick={saveReview}>
            Save
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
