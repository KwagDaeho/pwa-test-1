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
    <>
      <div className="container">
        <canvas id="game" width="375" height="375"></canvas>
        <div id="introduction">
          Click Mouse or Hold Touch
          <br />
          <br />
          Cross 1 bridge =&gt; <b>+1</b>
          <br />
          Cross to the red zone =&gt; <b>+2</b>
        </div>
        <div id="perfect" style={{ textAlign: "center" }}>
          <b>
            ~!@#$ Wow $#@!~
            <br />
            == == == == == == == ==
            <br />
            [[ SCORE + 2 ]]
          </b>
        </div>
        <button id="restart">RESTART</button>
      </div>
    </>
  );
}
