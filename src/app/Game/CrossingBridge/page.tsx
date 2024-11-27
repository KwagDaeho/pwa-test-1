"use client";

import "./style.css";
import { useEffect } from "react";

export default function CrossingBridge() {
  useEffect(() => {
    // 클라이언트에서만 실행되는 로직
    import("./logic.js")
      .then(() => {
        // 로딩이 끝난 후, 해당 모듈을 사용할 수 있습니다.
        console.log("logic.js가 로드되었습니다!");
      })
      .catch((error) => {
        console.error("logic.js 로드 중 오류 발생:", error);
      });
  }, []);
  return (
    <>
      <div className="container">
        <div id="score"></div>
        <canvas id="game" width="375" height="375"></canvas>
        <div id="introduction">Hold down the mouse to stretch out a stick</div>
        <div id="perfect">DOUBLE SCORE</div>
        <button id="restart">RESTART</button>
      </div>
    </>
  );
}
