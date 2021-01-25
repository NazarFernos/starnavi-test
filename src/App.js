import React, { Component } from "react";
import Game from "./components/Game/Game";
import Board from "./components/Board/Board";

import { gameSettings, getWinners, setWinner } from "./api/api.js";
import "./App.css";


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnersList: {},
      gameSettings: {},
      loadingWinners: false,
      loadingSettings: false,
      isGameFinished: false,
    };
  }

  componentDidMount() {
    this.fetchGameSettings();
    this.fetchWinners();
  }

  fetchWinners = async () => {
    this.setState({ loadingWinners: true });
    try {
      const result = await getWinners();
      this.setState({
        winnersList: result.reverse(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ loadingWinners: false });
    }
  };

  fetchGameSettings = async () => {
    this.setState({ loadingSettings: true });
    try {
      const result = await gameSettings();
      this.setState({
        gameSettings: result,
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ loadingSettings: false });
    }
  };

  setPublishWinner = async data => {
    try {
      await setWinner(data);
    } catch (error) {
      console.error(error);
    }
  };

  onPublishWinner = async (data, isGameFinished) => {
    await this.setPublishWinner(data);
    await this.fetchWinners();
    this.setState({
      isGameFinished,
    });
  };

  render() {
    const {
      winnersList,
      gameSettings,
      loadingSettings,
      loadingWinners,
      isGameFinished,
    } = this.state;

    return (
      <div className="App">
        <Game
          loadingSettings={loadingSettings}
          gameSettings={gameSettings}
          onPublishWinner={this.onPublishWinner}
        />
        <Board
          loadingWinners={loadingWinners}
          winnersList={winnersList}
          isGameFinished={isGameFinished}
        />
      </div>
    );
  }
}
