import React from "react";
import classNames from "classnames";
import "./Square.css";


const Square = props => {
  const { onClick, color, field } = props;
  const squareSize = {
    small: field === 15,
    middle: field === 10,
    big: field === 5,
  };

  return <li className={classNames("Square", color, squareSize)} onClick={onClick} />;
};

export default Square;
