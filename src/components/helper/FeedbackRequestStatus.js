import React, { useState } from "react";
import { Link } from "react-router-dom";

function FeedbackRequestStatus({ status, requests }) {
  const [requestListOpen, setRequestListOpen] = useState(false);
  const request = requests.filter((req) => req.status === status);
  console.log(requests);
  let message = "";
  switch (status) {
    case 1:
      message = "experts show interest";
      break;
    case 2:
      message = "experts viewed";
      break;
    case 3:
      message = "experts got request";
  }
  return (
    <div>
      <span
        onClick={() => {
          setRequestListOpen(!requestListOpen);
        }}
      >
        {request.length} {message}
      </span>
      <div style={{ display: `${requestListOpen ? "block" : "none"}` }}>
        {request.map((req) => {
          return (
            <Link to={`/feedback/${req.id}`}>
              <div>{req.id}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default FeedbackRequestStatus;
