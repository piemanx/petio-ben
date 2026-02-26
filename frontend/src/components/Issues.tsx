import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import User from "../data/User";

interface IssuesProps {
  open: boolean;
  close: () => void;
  msg: (message: any) => void;
}

const Issues: React.FC<IssuesProps> = ({ open, close, msg }) => {
  const { id } = useParams();
  const location = useLocation();
  const user = useSelector((state: any) => state.user);
  const api = useSelector((state: any) => state.api);

  const [type, setType] = useState<string>("");
  const [option, setOption] = useState<string>("");
  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    let currentType = "unknown";
    if (location.pathname.startsWith("/movie/")) {
      currentType = "movie";
    } else if (location.pathname.startsWith("/series/")) {
      currentType = "series";
    }
    setType(currentType);
    
    // Close modal if route changes
    return () => {
      close();
    };
  }, [id, location.pathname, close]);

  const inputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "option") setOption(value);
    if (name === "detail") setDetail(value);
  };

  const submit = async () => {
    if (!option) {
      msg({
        message: `Please pick an option`,
        type: "error",
      });
      return;
    }
    
    let userId = user.current?.id;
    let data = api[`${type}_lookup`] ? api[`${type}_lookup`][id as string] : null;
    let title = false;
    
    if (data) {
      title = type === "movie" ? data.title : data.name;
    }

    try {
      await User.addIssue({
        mediaId: id,
        type: type,
        title: title,
        user: userId,
        issue: option,
        comment: detail,
      });
      
      setType("");
      setOption("");
      setDetail("");
      close();
      
      msg({
        message: `New Issue added`,
        type: "good",
      });
    } catch {
      msg({
        message: "Error adding issue, please try again later!",
        type: "error",
      });
    }
  };

  return (
    <div className={`issues--wrap ${open ? "active" : ""}`}>
      <div className="issues--inner">
        <div className="issues--top">
          <h3>Report an issue</h3>
        </div>
        <div className="issues--main">
          <section>
            <p style={{ margin: 0 }}>
              We try our best to provide good quality content without any
              problems, but sometimes things go wrong. Please use this form to
              let us know of any issues you've had whilst watching Plex
              and we will do our best to fix them!
            </p>
          </section>
          <section>
            <p className="sub-title mb--1">Details</p>
            <p>
              Please fill out the fields below relating to the issue you are
              having with this show / movie.
            </p>
            <input type="hidden" name="id" value={id || ""} readOnly />
            <input type="hidden" name="type" value={type} readOnly />
            <input type="hidden" name="user" value={user.current?.id || ""} readOnly />
            <div className="styled-input--select">
              <select name="option" value={option} onChange={inputChange}>
                <option value="">Choose an option</option>
                {type === "movie" ? (
                  <>
                    <option value="subs">Missing Subtitles</option>
                    <option value="bad-video">Bad Quality / Video Issue</option>
                    <option value="bad-audio">Audio Issue / Audio Sync</option>
                  </>
                ) : (
                  <>
                    <option value="episodes">Missing Episodes</option>
                    <option value="season">Missing Season</option>
                    <option value="subs">Missing Subtitles</option>
                    <option value="bad-video">Bad Quality / Video Issue</option>
                    <option value="bad-audio">Audio Issue / Audio Sync</option>
                  </>
                )}
                <option value="other">Other, please specify</option>
              </select>
            </div>
            <textarea
              className="styled-input--textarea"
              value={detail}
              placeholder="Notes"
              name="detail"
              onChange={inputChange}
            ></textarea>
          </section>
          <div className="btn btn__square bad" onClick={close}>
            Cancel
          </div>
          <div className="btn btn__square save-issue" onClick={submit}>
            Submit
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issues;
