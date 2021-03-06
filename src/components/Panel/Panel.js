import React from "react";
import "./Panel.css";


const Panel = props => {
  const { gameMode, gameSettings, isGameStarted, isGameFinished, user } = props;
  const disablePlayButton =
    gameMode === "DEFAULT" || user === "" || isGameStarted;

  return (
    <div className="Panel">
      <div className="gameMode">
        <select value={gameMode} onChange={props.onChangeGameMode}>
          <option value="DEFAULT" disabled>
            Pick game mode...
          </option>
          {Object.keys(gameSettings).map(item => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="inputName">
        <input
          value={user}
          onChange={props.onChangeName}
          type="text"
          placeholder="Enter your name"
        />
      </div>
      <button
        className="playButton"
        onClick={props.onClickPlay}
        disabled={disablePlayButton}
      >
        {isGameFinished ? `PLAY AGAIN` : `PLAY`}
      </button>
    </div>
  );
};

export default Panel;
