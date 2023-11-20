import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Game } from "./Game";
import { Provider } from "react-redux";
import store from "./store";
import SteamPlugin from "./SteamPlugin";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <SteamPlugin />
    <App />
  </Provider>
);

export let mainGameObject = new Game();

let ts = Date.now();
function update(timestamp: number) {
  const diff = timestamp - ts;
  ts = timestamp;
  mainGameObject.update(diff); // which updates all the plants and resources
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
reportWebVitals();
