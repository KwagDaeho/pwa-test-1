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
    <div id="emojiContainer" style={{ opacity: 0 }}>
      <div id="emojiGame">
        <div className="scoreText"></div>
        <div className="timeTxt">30:00</div>
        <div className="timePlus">+3 sec</div>

        <div id="btnArea">
          <div id="b1" className="btn"></div>
        </div>

        <div className="end">
          <div className="endTxt"></div>
          <div id="replayBtn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="240"
              height="240"
              viewBox="0 0 240 240">
              <rect width="240" height="240" fill="none" />
              <path
                fill="#fff"
                d="M120,50V10L70,60l50,50V70c33.11,0,60,26.9,60,60c0,33.11-26.89,60-60,60c-33.1,0-60-26.89-60-60H40 c0,44.2,35.8,80,80,80s80-35.8,80-80S164.2,50,120,50z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
