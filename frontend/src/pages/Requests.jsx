import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Api from "../data/Api";
import { ReactComponent as Spinner } from "../assets/svg/spinner.svg";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { ReactComponent as MovieIcon } from "../assets/svg/movie.svg";
import { ReactComponent as TvIcon } from "../assets/svg/tv.svg";
import User from "../data/User";
import MyRequests from "../components/MyRequests";

const localizer = momentLocalizer(moment);

export default function Requests({ msg }) {
  const user = useSelector((state) => state.user);
  
  const [requests, setRequests] = useState(false);
  const [archive, setArchive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [calendarData, setCalendarData] = useState(false);

  useEffect(() => {
    let page = document.querySelectorAll(".page-wrap")[0];
    if (page) {
      page.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, []);

  const getRequests = useCallback(async () => {
    let fetchedRequests;
    try {
      fetchedRequests = await User.myRequests();
    } catch {
      fetchedRequests = {};
    }
    setRequests(fetchedRequests);
    setLoaded(true);
  }, []);

  const getArchive = useCallback(async () => {
    let fetchedArchive;
    const id = user.current.id;
    try {
      fetchedArchive = await User.getArchive(id);
      fetchedArchive.requests = fetchedArchive.requests.reverse();
    } catch {
      fetchedArchive = {};
    }
    setArchive(fetchedArchive);
  }, [user.current.id]);

  const getCalendar = useCallback(async () => {
    try {
      let data = await Api.guideCalendar();
      let formattedCalendarData = data.map((item) => {
        if (item.series) {
          let time = new Date(item.airDateUtc);
          return {
            title: `${item.series.title} - S${item.seasonNumber.toLocaleString(
              "en-US",
              {
                minimumIntegerDigits: 2,
                useGrouping: false,
              }
            )}E${item.episodeNumber.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}`,
            allDay: false,
            start: time,
            end: time,
            resource: item,
          };
        } else {
          let time = new Date(item.inCinemas);
          return {
            title: item.title,
            allDay: true,
            start: time,
            end: time,
            resource: item,
          };
        }
      });
      setCalendarData(formattedCalendarData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getRequests();
    getCalendar();
    getArchive();
  }, [getRequests, getCalendar, getArchive]);

  const isToday = (someDate) => {
    let date = new Date(someDate);
    date.setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    return date.getTime() === today;
  };

  const typeIcon = (type) => {
    let icon = null;
    switch (type) {
      case "movie":
        icon = <MovieIcon />;
        break;
      case "tv":
        icon = <TvIcon />;
        break;
      default:
        icon = null;
    }
    return <span className="table-icon">{icon}</span>;
  };

  if (!loaded) {
    return (
      <div className="requests-page">
        <h1 className="main-title">Requests</h1>
        <div className="spinner">
          <Spinner />
        </div>
      </div>
    );
  }

  const MonthEvent = ({ event }) => {
    return (
      <div className="calendar--event--wrap">
        <div
          className={`calendar--event ${
            event.resource.hasFile ? "recorded" : ""
          } ${isToday(new Date(event.resource.airDateUtc)) ? "airsToday" : ""} ${
            new Date(event.resource.airDateUtc) < new Date() ? "hasAired" : ""
          }`}
        >
          <div className="calendar--event--icon">
            {event.resource.series ? <TvIcon /> : <MovieIcon />}
          </div>
          <p>{event.title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="requests-page">
      <h1 className="main-title mb--1">Requests</h1>
      <div className="request-section">
        <section>
          <h3 className="sub-title mb--1">Your Requests</h3>
          <p>
            Track the progress of your requests. See the legend below to
            understand the current status of your requests.
          </p>
          <div className="requests-legend">
            <p>
              <span className="request-status pending">Pending</span> - Your
              request is pending approval
            </p>
            <p>
              <span className="request-status manual">No Status</span> - This
              means the request cannot be tracked by Petio
            </p>
            <p>
              <span className="request-status bad">Unavailable</span> - Currently
              this item cannot be downloaded
            </p>
            <p>
              <span className="request-status orange">Downloading</span> - Your
              request is currently downloading
            </p>
            <p>
              <span className="request-status good">Downloaded</span> - The item
              has been downloaded but is waiting for Plex to import
            </p>
            <p>
              <span className="request-status blue">~1 m 2 d</span> /{" "}
              <span className="request-status cinema">In Cinemas</span> - Not yet
              released, the approximate time to release (Years, Months, Days) or
              still in cinemas.
            </p>
          </div>
          <MyRequests requests={requests} msg={msg} />
        </section>
      </div>
      <section className="request-guide">
        <h3 className="sub-title mb--1">Guide</h3>
        <p>Upcoming TV airings and Movie releases.</p>
        {calendarData ? (
          <Calendar
            localizer={localizer}
            events={calendarData}
            startAccessor="start"
            endAccessor="end"
            components={{
              month: { event: MonthEvent },
              week: { event: MonthEvent },
            }}
            views={["month", "agenda"]}
          />
        ) : null}
      </section>
      <section className="request-archive">
        <h3 className="sub-title mb--1">Previous Requests</h3>
        <p>See your completed / failed requests</p>
        <table className="generic-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Approved</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {archive ? (
              archive.requests.map((req) => {
                return (
                  <tr
                    key={req._id}
                    className={`generic-table--row--${
                      req.removed ? "bad" : req.complete ? "good" : "normal"
                    }`}
                  >
                    <td>
                      <Link
                        to={`/${req.type === "movie" ? "movie" : "series"}/${
                          req.tmdb_id
                        }`}
                      >
                        {req.title}
                      </Link>
                    </td>
                    <td>{typeIcon(req.type)}</td>
                    <td>{req.approved ? "Yes" : "No"}</td>
                    <td>
                      {req.removed
                        ? "Removed"
                        : req.complete
                        ? "Completed"
                        : "other"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">Empty</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
