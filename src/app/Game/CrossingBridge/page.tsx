"use client";

import "./style.css";
import { useEffect } from "react";

export default function CrossingBridge() {
  useEffect(() => {
    // 클라이언트에서만 실행되는 로직
    import("./logic.js")
      .then((module) => {
        module.gameLogic();
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
        <canvas id="game" width="375" height="375"></canvas>
        <div id="introduction">
          Click Mouse || Hold Touch
          <br />
          <br />1 cross =&gt; +1 score
          <br />
          cross with red-zone =&gt; +2 score
        </div>
        <div id="perfect" style={{ textAlign: "center" }}>
          ~!@#$ Wow $#@!~
          <br />
          == == == == == == == ==
          <br />
          <b>[[ SCORE + 2 ]]</b>
        </div>
        <button id="restart">RESTART</button>
      </div>
    </>
  );
}
