const URL = "https://starnavi-frontend-test-task.herokuapp.com";

export const gameSettings = async () => {
  try {
    let response = await fetch(URL + "/game-settings", {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
};

export const getWinners = async () => {
  try {
    let response = await fetch(URL + "/winners", {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
};

export const setWinner = async body => {
  try {
    let response = await fetch(URL + "/winners", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
};
