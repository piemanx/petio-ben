import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const RequestCard = ({ request }) => {
  const user = useSelector((state) => state.user);

  if (!request) {
    return null;
  }

  const img = request.poster_path ? (
    <img
      src={`https://image.tmdb.org/t/p/w200${request.poster_path}`}
      alt={request.title}
    />
  ) : (
    <img src={`/images/no-poster.jpg`} alt={request.title} />
  );

  const type = user.requests[request.id].type;

  return (
    <div
      key={request.id}
      data-key={request.id}
      className={"card type--movie-tv"}
    >
      <div className="card--inner">
        <Link
          to={`/${type === "tv" ? "series" : "movie"}/${request.id}`}
          className="full-link"
        ></Link>

        <div className="request-count">
          {Object.keys(user.requests[request.id].users).length}
        </div>

        <div className="image-wrap">{img}</div>
        <div className="text-wrap">
          <p className="title" title={request.title || request.name}>
            {request.title || request.name}
            <span className="year">
              {type === "movie"
                ? `(${new Date(request.release_date).getFullYear()})`
                : `(${new Date(request.first_air_date).getFullYear()} - ${new Date(
                    request.last_air_date
                  ).getFullYear()})`}
            </span>
          </p>
          {user.current.admin ? (
            <p className="request-info">
              {Object.keys(user.requests[request.id].users).map((u) => {
                return (
                  <span key={`req_info_${request.id}__${u}`}>
                    {user.requests[request.id].users[u]}
                  </span>
                );
              })}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
