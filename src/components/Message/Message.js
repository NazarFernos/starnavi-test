import React from "react";
import classNames from "classnames";
import "./Message.css";


const Message = props => {
  const { isGameFinished, winner } = props;

  const messageStyles = {
    Message: true,
    messageVisible: winner !== null && winner !== "",
  };

  return (
    <div className={classNames(messageStyles)}>
      {isGameFinished && (
        <>
          <span>{winner}</span> won!
        </>
      )}
    </div>
  );
};

export default Message;
