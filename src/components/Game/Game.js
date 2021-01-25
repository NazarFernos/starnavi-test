import React, { Component } from "react";
import { sampleSize, range } from "lodash";
import classNames from "classnames";
import Loader from "react-loader-spinner";
import Panel from "../Panel/Panel";
import Message from "../Message/Message";
import Field from "../Field/Field";
import "./Game.css";


export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      winner: null,
      gameMode: "DEFAULT",
      isGameStarted: false,
      isGameFinished: false,
      field: null,
      delay: null,
      max: null,
      fieldSquares: [],
      dataToPublish: {},
      lastNumber: null,
      points: {
        computer: [],
        user: [],
      },
    };
  }

  onChangeGameMode = async (e) => {
    const {
      props: { gameSettings },
    } = this;
    const gameMode = e.target.value;

    if (this.state.isGameStarted) {
      await this.resetState();
    }

    this.setState(
        {
          gameMode,
          field: gameSettings[gameMode].field,
          delay: gameSettings[gameMode].delay,
        },
        () => this.createFieldSquares()
    );
  };

  onChangeName = (e) => {
    this.setState({ user: e.target.value });
  };

  onClickPlay = () => {
    const { isGameStarted, isGameFinished } = this.state;

    if (isGameFinished) {
      this.createFieldSquares();
    }

    if (!isGameStarted) {
      this.setState(
          {
            isGameStarted: true,
            isGameFinished: false,
          },
          () => this.onStartGame()
      );
    }
  };

  createFieldSquares = () => {
    const { field } = this.state;
    let fieldSquares = [];
    const max = field ** 2;

    for (let i = 0; i < max; i++) {
      fieldSquares[i] = {
        color: "initial",
        clicked: false,
        id: i,
      };
    }

    this.setState({
      fieldSquares,
      max,
      field,
    });
  };

  onStartGame = () => {
    const { delay, max } = this.state;
    const uniqueRandomNumbers = sampleSize(range(0, max), max);
    let currentSquareIndex = 0;
    const timer = setInterval(() => {
      currentSquareIndex++;
      const abortTimer = this.checkIsGameFinished(currentSquareIndex);
      if (abortTimer) {
        this.onFinishGame();
        clearInterval(timer);
      } else {
        this.generateRandomSquare(uniqueRandomNumbers);
      }
    }, delay);
  };

  generateRandomSquare = uniqueRandomNumbers => {
    const {
      isGameStarted,
      isGameFinished,
      fieldSquares,
      lastNumber,
      points,
    } = this.state;

    if (isGameStarted && !isGameFinished) {
      const updatedFieldSquares = [...fieldSquares];
      let updatedPoints = { ...points };
      const prevNumber = lastNumber;
      const prevSquare = updatedFieldSquares[lastNumber];

      if (prevNumber !== null && prevSquare.color !== "green") {
        updatedFieldSquares[prevSquare.id] = {
          ...prevSquare,
          color: "red",
        };
        updatedPoints = {
          ...updatedPoints,
          computer: [...updatedPoints.computer, prevSquare.id],
        };
      }

      const newLastNumber = uniqueRandomNumbers.pop();
      const updatedCurrentSquare = updatedFieldSquares[newLastNumber];
      updatedCurrentSquare.color = "blue";

      this.setState({
        fieldSquares: updatedFieldSquares,
        lastNumber: newLastNumber,
        points: updatedPoints,
      });
    }
  };

  onClickSquare = (id) => {
    const { fieldSquares, points, lastNumber } = this.state;

    let updatedPoints = { ...points };
    let updatedFieldSquares = [...fieldSquares];
    let currentSquare = updatedFieldSquares[lastNumber];

    if (id === lastNumber && currentSquare.clicked === false) {
      currentSquare.color = "green";
      currentSquare.clicked = true;

      updatedPoints = {
        ...updatedPoints,
        user: [...updatedPoints.user, lastNumber],
      };

      this.setState({
        fieldSquares: updatedFieldSquares,
        points: updatedPoints,
      });
    }
  };

  makeLastSquareRed = () => {
    const { lastNumber, points, fieldSquares } = this.state;
    const updatedFieldSquares = [...fieldSquares];
    let updatedPoints = { ...points };
    const lastSquare = updatedFieldSquares[lastNumber];

    if (lastNumber !== null && lastSquare.color !== "green") {
      updatedFieldSquares[lastSquare.id] = {
        ...lastSquare,
        color: "red",
      };
      updatedPoints = {
        ...updatedPoints,
        computer: [...updatedPoints.computer, lastSquare.id],
      };
    }

    this.setState({
      fieldSquares: updatedFieldSquares,
      points: updatedPoints,
    });
  };

  onFinishGame = async () => {
    const { points, max, user } = this.state;

    if (points.computer.length === Math.floor(max / 2)) {
      this.setState({
        winner: "Computer AI",
        isGameFinished: true,
      });
    }

    if (points.user.length === Math.floor(max / 2)) {
      this.setState({
        winner: user,
        isGameFinished: true,
      });
    }

    await this.makeLastSquareRed();
    if (this.state.winner !== null) {
      await this.publishWinnerToBoard();
    }
    this.resetState();
  };

  checkIsGameFinished = currentSquareIndex => {
    const { points, max } = this.state;
    return (
        points.computer.length === Math.floor(max / 2) ||
        points.user.length === Math.floor(max / 2) ||
        !this.state.isGameStarted ||
        currentSquareIndex === max
    );
  };

  resetState = () => {
    const resetState = {
      isGameStarted: false,
      lastNumber: null,
      dataToPublish: {},
      points: {
        computer: [],
        user: [],
      },
    };

    this.setState({
      ...resetState,
    });
  };

  publishWinnerToBoard = () => {
    const { dataToPublish, winner, isGameFinished } = this.state;
    const { onPublishWinner } = this.props;
    let uploadWinner = { ...dataToPublish };

    const date = new Date();
    const winnerTime = `${date.toLocaleString("ru", {
      hour: "numeric",
      minute: "numeric",
    })}; ${date.getDate()} ${date.toLocaleString("en", {
      month: "long",
    })} ${date.getFullYear()}`;

    uploadWinner.winner = winner;
    uploadWinner.date = winnerTime;


    onPublishWinner(uploadWinner, isGameFinished);
  };

  render() {
    const currentState = this.state;
    const { gameSettings, loadingSettings } = this.props;
    const componentProps = { ...currentState, gameSettings };
    const contentStyles = {
      content: true,
      isGameModePicked: this.state.gameMode !== "DEFAULT",
    };

    return (
        <div className="Game">
          {loadingSettings ? (
              <Loader type="TailSpin" color="#00BFFF" height={60} width={60} />
          ) : (
              <div className={classNames(contentStyles)}>
                <Panel
                    {...componentProps}
                    onChangeGameMode={this.onChangeGameMode}
                    onChangeName={this.onChangeName}
                    onClickPlay={this.onClickPlay}
                />
                <Message {...componentProps} />
                <Field {...componentProps} onClickSquare={this.onClickSquare} />
              </div>
          )}
        </div>
    );
  }
}