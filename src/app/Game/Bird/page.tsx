"use client";

import "./style.css";
import { useEffect } from "react";

export default function CrossingBridge() {
  useEffect(() => {
    (async () => {
      const { gameLogic } = await import("./logic.js");
      gameLogic();
    })();
    return () => {};
  }, []);
  return (
    <div id="BirdContainer" className="container">
      <canvas id="game" width="375" height="375"></canvas>
    </div>
  );
}
