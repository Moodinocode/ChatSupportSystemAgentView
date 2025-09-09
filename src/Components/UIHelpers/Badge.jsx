import React from "react";

const Badge = ({ classnames = "", text = "", ...props }) => {
  return (
    <div className={`badge ${classnames}`} {...props}>
      {text}
    </div>
  );
};

export default Badge;
