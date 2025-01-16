"use client";

import useGameDashboard from "@/hooks/useGameDashboard";
import "./style.css";
import { useEffect } from "react";

export default function Emoji() {
  const { loading, addGameData } = useGameDashboard();
  useEffect(() => {
    if (loading == false) {
      window.postGameScore = async (score) => {
        await addGameData("1534c734f1b58002be1fceb5ea3eb07d", score);
      };
      (async () => {
        const { gameLogic } = await import("./logic.js");
        gameLogic();
      })();
    }
    return () => {
      window.location.reload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  return loading ? (
    <div
      style={{
        position: "fixed",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        paddingTop: "40vh",
        textAlign: "center",
        backgroundColor: "rgba(255,255,255,0.6)",
      }}>
      <p style={{ color: "#121212" }}>점수를 등록하는 중....</p>
    </div>
  ) : (
    <div id="swingCanvasWrap">
      <canvas id="swingContainer" width="540" height="540"></canvas>
      <div id="buy_items">
        <button id="buy_mana">MANA</button>
        <button id="buy_jump">JUMP</button>
        <div>Touch/Click/Space</div>
      </div>
    </div>
  );
}
