"use client";

import "./style.css";
import "./logic.js";

export default function CrossingBridge() {
  return (
    <>
      <div className="container">
        <div id="score"></div>
        <canvas id="game" width="375" height="375"></canvas>
        <div id="introduction">Hold down the mouse to stretch out a stick</div>
        <div id="perfect">DOUBLE SCORE</div>
        <button id="restart">RESTART</button>
      </div>
      <style></style>
    </>
  );
}
