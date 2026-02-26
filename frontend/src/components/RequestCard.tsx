import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

interface RequestItem {
  id: number | string;
  poster_path?: string | null;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  last_air_date?: string;
}

interface RequestCardProps {
  request: RequestItem;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const user = useSelector((state: any) => state.user);

  if (!request) {
    return null;
  }

  const img = request.poster_path ? (
    <img
      src={`https://image.tmdb.org/t/p/w200${request.poster_path}`}
      alt={request.title || request.name || "Poster"}
    />
  ) : (
    <img src={`/images/no-poster.jpg`} alt={request.title || request.name || "Poster"} />
  );

  const type = user.requests[request.id]?.type;

  const displayYear = () => {
    if (type === "movie" && request.release_date) {
      return `(${new Date(request.release_date).getFullYear()})`;
    } else if (type === "tv" && request.first_air_date && request.last_air_date) {
      return `(${new Date(request.first_air_date).getFullYear()} - ${new Date(
        request.last_air_date
      ).getFullYear()})`;
    } else if (type === "tv" && request.first_air_date) {
      return `(${new Date(request.first_air_date).getFullYear()})`;
    }
    return null;
  };

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
          {user.requests[request.id] && user.requests[request.id].users 
            ? Object.keys(user.requests[request.id].users).length
            : 0}
        </div>

        <div className="image-wrap">{img}</div>
        <div className="text-wrap">
          <p className="title" title={request.title || request.name}>
            {request.title || request.name}
            <span className="year">
              {displayYear()}
            </span>
          </p>
          {user.current?.admin && user.requests[request.id] && user.requests[request.id].users ? (
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
