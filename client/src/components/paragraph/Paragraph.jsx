import React from "react";
import "./Paragraph.scss";

const Paragraph = ({ children, className }) => {
  return <p className={`paragraph ${className}`}>{children}</p>;
};

export default Paragraph;
