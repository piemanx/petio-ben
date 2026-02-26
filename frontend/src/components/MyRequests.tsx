import React from "react";
import MovieCard from "../components/MovieCard";
import TvCard from "../components/TvCard";
import { ReactComponent as DoneIcon } from "../assets/svg/check.svg";

interface ProcessStage {
  step: number;
  status: string;
  message: string;
}

interface RequestItem {
  _id: string;
  tmdb_id: number | string;
  title: string;
  type: "tv" | "movie";
  process_stage: ProcessStage;
}

interface MyRequestsProps {
  requests: Record<string, RequestItem> | RequestItem[];
  msg: (message: any) => void;
}

const MyRequests: React.FC<MyRequestsProps> = ({ requests, msg }) => {
  const requestKeys = Object.keys(requests);

  if (requestKeys.length === 0) {
    return (
      <div className="myrequests--wrap">
        <div className="myrequests--none">
          <p>
            <strong>You haven't made any requests yet</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="myrequests--wrap">
      <div className="myrequests--grid">
        {requestKeys.map((key) => {
          let request = (requests as any)[key] as RequestItem;
          return (
            <div key={`mreq__${key}`} className="myrequests--item">
              <div className="myrequests--item--poster">
                {request.type === "tv" ? (
                  <TvCard
                    key={request._id}
                    series={{ id: request.tmdb_id }}
                    msg={msg}
                    view={true}
                  />
                ) : (
                  <MovieCard
                    key={request._id}
                    movie={{ id: request.tmdb_id }}
                    msg={msg}
                    view={true}
                  />
                )}
              </div>
              <div className="myrequests--item--details">
                <p className="detail-title">{request.title}</p>
                <p className="detail-text">
                  {request.type === "tv" ? "TV Show" : "Movie"}
                </p>
                <p className="detail-text">
                  Status:{" "}
                  <span
                    className={`request-status ${request.process_stage.status}`}
                  >
                    {request.process_stage.message}
                  </span>
                </p>
                <div className="detail-steps">
                  <div className="detail-steps--item detail-steps--item__completed">
                    Requested
                    <div className="icon">
                      <DoneIcon />
                    </div>
                  </div>
                  <div
                    className={`detail-steps--item ${
                      request.process_stage.step > 2
                        ? "detail-steps--item__completed"
                        : request.process_stage.step == 2
                        ? "detail-steps--item__active"
                        : ""
                    }`}
                  >
                    Approved
                    <div className="icon">
                      <DoneIcon />
                    </div>
                  </div>
                  <div
                    className={`detail-steps--item ${
                      request.process_stage.step > 3
                        ? "detail-steps--item__completed"
                        : request.process_stage.step == 3
                        ? "detail-steps--item__active"
                        : ""
                    }`}
                  >
                    Processing
                    <div className="icon">
                      <DoneIcon />
                    </div>
                  </div>
                  <div
                    className={`detail-steps--item ${
                      request.process_stage.step > 4
                        ? "detail-steps--item__completed"
                        : request.process_stage.step == 4
                        ? "detail-steps--item__active"
                        : ""
                    }`}
                  >
                    Finalising
                    <div className="icon">
                      <DoneIcon />
                    </div>
                  </div>
                  <div className="detail-steps--item">
                    On Plex
                    <div className="icon">
                      <DoneIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRequests;
