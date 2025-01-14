import { TimelineMax, Power1, Power2, TweenMax, Back } from "gsap";
export const gameLogic = () => {
  let game = document.getElementById("emojiGame"),
    btnArea = document.getElementById("btnArea"),
    replayBtn = document.getElementById("replayBtn"),
    timeLimit = 30 * 1000, // in millisec
    timeLeft,
    timeInt,
    lastBtn,
    matched = false,
    art = [
      "😄",
      "🤣",
      "🙂",
      "🙃",
      "😉",
      "😇",
      "😍",
      "🤥",
      "😘",
      "😚",
      "😛",
      "😜",
      "😋",
      "🤗",
      "🤔",
      "🤐",
      "😶",
      "🤑",
      "😏",
      "🙄",
      "😳",
      "😬",
      "😴",
      "🤕",
      "🤠",
      "🤧",
      "😢",
      "😵",
      "😎",
      "🤓",
      "😡",
      "🤢",
      "😭",
      "😫",
      "😠",
    ],
    score = 0;

  // Make 16 btn <divs>
  for (let i = 1; i <= 16; i++) {
    let b;
    if (i == 1) b = document.getElementById("b1");
    else {
      b = document.getElementById("b1").cloneNode(true);
      b.id = "b" + i;
      btnArea.appendChild(b);
    }
    b.onclick = b.ontouchend = btnClick;
  }

  // Initial states...
  new TimelineMax({ onStart: populate })
    .set(game, {
      userSelect: "none",
      background: "radial-gradient(#333, #000 120%)",
    })
    .set(".btn", {
      width: 90,
      height: 90,
      border: "3px solid transparent",
      textAlign: "center",
      fontSize: 72,
      lineHeight: "96px",
      cursor: "pointer",
    })
    .set(".scoreText", {
      width: "100%",
      fontSize: 35,
      textAlign: "center",
      textContent: "Find same emoji",
      fontWeight: 300,
      letterSpacing: 0.25,
    })
    .set(".timeTxt", { left: 30, top: 20, fontSize: 50, textAlign: "center" })
    .set(".timePlus", {
      fontSize: 25,
      alpha: 0,
      textAlign: "center",
    })
    .set(".end", {
      width: "100%",
      height: "100%",
      background: "rgba(255,255,255,0.1)",
      autoAlpha: 0,
    })
    .set(".endTxt", {
      textAlign: "center",
      fontSize: 25,
      fontWeight: 300,
    })
    .set(replayBtn, {
      textAlign: "center",
      scale: 0.6,
      transformOrigin: "120px 130px",
      cursor: "pointer",
    })
    .to("#emojiContainer", 0.2, { alpha: 1, ease: Power2.easeIn }, 0);

  function populate() {
    lastBtn = undefined;
    matched = false;
    TweenMax.staggerFromTo(
      ".btn",
      0.3,
      { scale: 0.2, alpha: 0, rotation: 1 },
      {
        rotation: 0,
        alpha: 1,
        scale: 1,
        ease: Back.easeOut.config(4),
        stagger: { grid: [4, 4], from: "center", amount: 0.2 },
      }
    );

    let btns = [];

    for (let i = 0; i < 15; i++) makeNewNum();

    function makeNewNum() {
      let n = art[Math.ceil(rand(0, art.length - 1))],
        valExists = false;
      for (let i = 0; i < btns.length; i++) {
        if (n == btns[i]) {
          valExists = true;
        }
      }
      if (valExists) {
        makeNewNum();
      } else {
        btns.push(n);
      }
    }

    btns.push(btns[14]);
    shuffleArray(btns);
    for (let b = 1; b <= 16; b++) window["b" + b].textContent = btns[b - 1];
  }

  function btnClick(e) {
    if (e.type == "touchend") e.currentTarget.onclick = undefined; //remove click for touch devices
    if (matched) return; //prevent user from repeatedly clicking the matching pair
    if (timeInt == undefined) {
      //start timer upon first click
      timeLeft = timeLimit;
      timeInt = setInterval(updateTime, 10);
    }

    let b = e.currentTarget;
    TweenMax.to(b, 0.05, { scale: 0.95, yoyo: true, repeat: 1 });

    if (lastBtn != undefined && lastBtn != b) {
      if (b.textContent == lastBtn.textContent) {
        //matched
        score++;
        matched = true;
        timeLeft += 3000;
        new TimelineMax({ onComplete: populate })
          .set(
            ".scoreText",
            { textContent: "score: " + score, fontWeight: 700 },
            0
          )
          .to(
            ".timePlus",
            0.1,
            { alpha: 1, yoyo: true, repeat: 1, repeatDelay: 0.4 },
            0
          )
          .fromTo(
            ".timePlus",
            0.3,
            { scale: 0, rotation: 0.1 },
            { scale: 1, rotation: 0 },
            0
          )
          .to([b, lastBtn], 0.1, { border: "3px solid #08c04d" }, 0)
          .to(
            b,
            0.3,
            {
              rotation: 1,
              scale: 0.8,
              ease: Back.easeIn.config(7),
              yoyo: true,
              repeat: 1,
            },
            0
          )
          .to(
            lastBtn,
            0.3,
            {
              rotation: 1,
              scale: 0.8,
              ease: Back.easeIn.config(7),
              yoyo: true,
              repeat: 1,
            },
            0
          )
          .to(".btn", 0.1, { border: "3px solid transparent" }, 0.5);
        return;
      }
      //not matched
      else TweenMax.to(lastBtn, 0.1, { border: "3px solid transparent" });
    }
    TweenMax.to(b, 0.1, { border: "3px solid #006da6" });
    lastBtn = e.currentTarget;
  }

  function updateTime() {
    if (timeLeft > 0) {
      timeLeft -= 10;
      let mil = Math.floor((timeLeft % 1000) / 10);
      let sec = Math.floor(timeLeft / 1000);
      if (mil < 10) mil = "0" + mil;
      if (sec < 10) sec = "0" + sec;
      let t = sec + ":" + mil;
      TweenMax.set(".timeTxt", { textContent: t });
    } else {
      // Game over
      clearInterval(timeInt);
      timeInt = undefined;
      if (score == 0)
        TweenMax.set(".scoreText", {
          textContent: "score: 0",
          fontWeight: 500,
        });
      TweenMax.set(".endTxt", {
        textContent: " Try again? ",
        fontSize: 35,
      });

      new TimelineMax()
        .to(".timeTxt", 0.3, { autoAlpha: 0 }, 0)
        .to(btnArea, 0.3, { autoAlpha: 0 }, 0)
        .to(".btn", 0.1, { border: "3px solid transparent" }, 0.3)
        .fromTo(
          ".scoreText",
          0.4,
          { rotation: 0.1 },
          { rotation: 0, scale: 2.5, y: 100, ease: Power2.easeInOut },
          0.2
        )
        .to(".end", 0.6, { autoAlpha: 1, ease: Power2.easeInOut }, 0)
        .fromTo(
          replayBtn,
          1.0,
          { rotation: 360, scale: 0 },
          { scale: 0.6, rotation: 0, ease: Power1.easeInOut },
          0.5
        );
    }
  }

  replayBtn.onclick = replayBtn.ontouchend = function () {
    new TimelineMax()
      .to(
        replayBtn,
        0.5,
        { rotation: -180, scale: 0, ease: Back.easeIn.config(3) },
        0
      )
      .fromTo(
        ".scoreText",
        0.4,
        { rotation: 0.1 },
        { rotation: 0, scale: 1, y: 0, ease: Power1.easeInOut },
        0.4
      )
      .to(".end", 0.3, { autoAlpha: 0 }, 0.5)
      .to([".timeTxt", btnArea], 0.3, { autoAlpha: 1 }, 0.8)
      .call(
        function () {
          // Reset game...
          TweenMax.set(".scoreText", { textContent: "score: 0" });
          TweenMax.set(".timeTxt", { textContent: "30:00" });
          score = 0;
          populate();
        },
        null,
        null,
        0.8
      );
  };

  // Browser resize
  function doResize() {
    new TimelineMax()
      .set("#b1", { left: 320, top: 100 })
      .set("#b2", { left: 420, top: 100 })
      .set("#b3", { left: 520, top: 100 })
      .set("#b4", { left: 620, top: 100 })
      .set("#b5", { left: 320, top: 200 })
      .set("#b6", { left: 420, top: 200 })
      .set("#b7", { left: 520, top: 200 })
      .set("#b8", { left: 620, top: 200 })
      .set("#b9", { left: 320, top: 300 })
      .set("#b10", { left: 420, top: 300 })
      .set("#b11", { left: 520, top: 300 })
      .set("#b12", { left: 620, top: 300 })
      .set("#b13", { left: 320, top: 400 })
      .set("#b14", { left: 420, top: 400 })
      .set("#b15", { left: 520, top: 400 })
      .set("#b16", { left: 620, top: 400 });
  }
  doResize();
  window.addEventListener("resize", doResize);

  // Helper Functions
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function rand(min, max) {
    min = min || 0;
    max = max || 1;
    return min + (max - min) * Math.random();
  }
};
