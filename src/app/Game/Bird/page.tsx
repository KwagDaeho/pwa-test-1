"use client";

import "./style.css";
import { useEffect } from "react";

export default function CrossingBridge() {
  useEffect(() => {
    (async () => {
      const { gameLogic } = await import("./logic.js");
      gameLogic();
    })();
  }, []);
  return (
    <div className="BirdContainer">
      <canvas id="game" width="375" height="375"></canvas>
    </div>
  );
}
