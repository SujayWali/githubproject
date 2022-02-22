import React from "react";

const ReposCard = ({ repo }) => {
  return (
    <div className="card">
      <div className="card-body">
        <a href={repo.html_url} target="_blank">
          <h3>{repo.name}</h3>
          <p>{repo.pushed_at}</p>
          <p>{repo.watchers}</p>
        </a>
      </div>
    </div>
  );
};

export default ReposCard;
