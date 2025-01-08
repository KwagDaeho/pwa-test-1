"use client";

import useGameDashboard from "@/hooks/useGameDashboard";
import "./style.css";
import { useEffect } from "react";

export default function CrossingBridge() {
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
    <div
      id="CrossingBridgeContainer"
      className="container"
      key={loading.toString()}>
      <canvas id="game" width="375" height="375"></canvas>
      <div id="introduction">
        Click Mouse or Hold Touch
        <br />
        <br />
        Cross 1 bridge =&gt; <b>+ 100</b>
        <br />
        Cross to the red zone =&gt; <b>+ 100~500</b>
        {/* <br />
        <br />
        [space] to reset<b>+1</b> */}
      </div>
      <div id="perfect" style={{ textAlign: "center" }}>
        <b>[[ PERFECT ]]</b>
      </div>
      <button id="restart">Restart</button>
      <button id="scoreUpdate">점수 업로드</button>
    </div>
  );
}
