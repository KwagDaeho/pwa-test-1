"use client";

import useGameDashboard from "@/hooks/useGameDashboard";
import "./style.css";
import { useEffect } from "react";

export default function CrossingBridge() {
  const { loading, addGameData } = useGameDashboard();
  useEffect(() => {
    if (loading == false) {
      window.postGameScore = (score) => {
        const userName = prompt(
          "Score : " + score + "\n점수를 등록하려면 이름을 입력하세요."
        );
        if (userName !== null) {
          addGameData(
            "1534c734f1b580f2894df5cf7e8b8358",
            userName,
            score,
            new Date().toISOString()
          );
          location.reload();
        } else {
          console.log("점수 등록 취소");
        }
      };
      (async () => {
        const { gameLogic } = await import("./logic.js");
        gameLogic();
      })();
    }
  }, [addGameData, loading]);

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
    <div id="BirdContainer" className="container" key={loading.toString()}>
      <canvas id="game" width="375" height="375"></canvas>
    </div>
  );
}
