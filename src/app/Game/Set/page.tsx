"use client";

import { useState, useRef, useEffect } from "react";
import "./style.css";

interface Bauble {
  color: string;
  shading: string;
  shape: string;
  number: number;
  selected: boolean;
}

// Return a random item from an array
function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// The possible values of each feature
const colors = ["#72C264", "#FAC44C", "#EF5169"];
const shadings = ["solid", "striped", "open"];
const shapes = ["circle", "tree", "star"];
const numbers = [1, 2, 3];

// Generates a random bauble
const generateBauble = (): Bauble => ({
  color: pick(colors),
  shading: pick(shadings),
  shape: pick(shapes),
  number: pick(numbers),
  selected: false,
});

// Generates a random bauble that's not in the given array
const generateBaubleNotInArray = (array) => {
  const bauble = generateBauble();
  if (!baubleIsInArray(array, bauble)) return bauble;
  return generateBaubleNotInArray(array);
};

// Check is bauble is already in array or not
const baubleIsInArray = (baubles, bauble) =>
  baubles.find(
    (b) =>
      b.color == bauble.color &&
      b.shading == bauble.shading &&
      b.shape == bauble.shape &&
      b.number == bauble.number
  );

const generateBaubles = (): Bauble[] => {
  const baubles = [];
  while (baubles.length < 12) {
    const bauble = generateBaubleNotInArray(baubles);
    baubles.push(bauble);
  }
  if (thereIsAtLeastOneSet(baubles)) return baubles;
  return generateBaubles();
};

// const replaceSet = (baubles) => {
//   const newBaubles = [];
//   const remainingBaublesUnordered = baubles.filter((b) => !b.selected);
//   baubles.forEach((b) => {
//     if (!b.selected) return newBaubles.push(b);

//     const newBauble = generateBaubleNotInArray(remainingBaublesUnordered);
//     remainingBaublesUnordered.push(newBauble);
//     newBaubles.push(newBauble);
//   });

//   if (thereIsAtLeastOneSet(newBaubles)) return newBaubles;
//   return replaceSet(baubles);
// };

const selectBauble = (baubles, index) =>
  baubles.map((b, i) => (i == index ? { ...b, selected: !b.selected } : b));

const getSet = (baubles) => {
  for (let i1 = 0; i1 < baubles.length - 2; i1++) {
    for (let i2 = i1 + 1; i2 < baubles.length - 1; i2++) {
      for (let i3 = i2 + 1; i3 < baubles.length; i3++) {
        if (itIsASet(baubles[i1], baubles[i2], baubles[i3])) {
          // console.log("Psst! Here's a solution:", i1 + 1, i2 + 1, i3 + 1);
          return [i1, i2, i3];
        }
      }
    }
  }

  return undefined;
};

const thereIsAtLeastOneSet = (baubles) => {
  return getSet(baubles) != undefined;
};

const highlightSet = (baubles) => {
  const setIndexes = getSet(baubles);

  const newBaubles = baubles.map((b, i) => {
    if (setIndexes.includes(i))
      return {
        ...b,
        selected: true,
      };
    return {
      ...b,
      selected: false,
    };
  });

  return newBaubles;
};

const itIsASet = (bauble1, bauble2, bauble3) => {
  const {
    colorsFitCriteria,
    shadingsFitCriteria,
    shapesFitCriteria,
    numberFitCriteria,
  } = getCriteria(bauble1, bauble2, bauble3);

  return (
    colorsFitCriteria &&
    shadingsFitCriteria &&
    shapesFitCriteria &&
    numberFitCriteria
  );
};

const getCriteria = (bauble1, bauble2, bauble3) => {
  const selectedColors = [bauble1.color, bauble2.color, bauble3.color];
  const selectedShadings = [bauble1.shading, bauble2.shading, bauble3.shading];
  const selectedShapes = [bauble1.shape, bauble2.shape, bauble3.shape];
  const selectedNumbers = [bauble1.number, bauble2.number, bauble3.number];

  return {
    colorsFitCriteria:
      allTheSame(selectedColors) || allDifferent(selectedColors),
    shadingsFitCriteria:
      allTheSame(selectedShadings) || allDifferent(selectedShadings),
    shapesFitCriteria:
      allTheSame(selectedShapes) || allDifferent(selectedShapes),
    numberFitCriteria:
      allTheSame(selectedNumbers) || allDifferent(selectedNumbers),
  };
};

const threeBaublesAreSelected = (baubles) =>
  baubles.filter((b) => b.selected).length == 3;

const allTheSame = (values) => values[0] == values[1] && values[0] == values[2];

const allDifferent = (values) =>
  values[0] != values[1] && values[0] != values[2] && values[1] != values[2];

export default function Set() {
  const [baubles, setBaubles] = useState<Bauble[] | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("demo");

  useEffect(() => {
    setBaubles(generateBaubles());
  }, []);

  const select = (index) => {
    if (phase == "demo") return;
    let newBaubles = selectBauble(baubles, index);

    if (threeBaublesAreSelected(newBaubles)) {
      const selectedBaubles = newBaubles.filter((b) => b.selected);

      // If the three selected baubles are a set then replace them
      if (
        itIsASet(selectedBaubles[0], selectedBaubles[1], selectedBaubles[2])
      ) {
        setScore(score + 10);
        newBaubles = generateBaubles();
      } else {
        setTimeout(() => {
          endGame();
        }, 0);
      }
    }

    setBaubles(newBaubles);
  };
  const endGame = () => {
    // Highlight the possible set
    setBaubles(highlightSet(baubles));
    // score alert
    alert("Score : " + score);
    // demo로 이동
    setPhase("demo");
  };
  const start = () => {
    // Start the game
    setBaubles(generateBaubles());
    setPhase("game");
  };

  const timeUp = () => {
    endGame();
  };

  return (
    <div id="setContainer">
      <div className={"grid " + phase}>
        {baubles?.map(({ color, shading, shape, number, selected }, index) => (
          <Bauble
            key={`${index}-${color}-${shading}-${shape}-${number}`}
            index={index}
            color={color}
            shading={shading}
            shape={shape}
            number={number}
            selected={selected}
            select={select}
          />
        ))}
      </div>
      {phase == "demo" && (
        <div className="sidebar">
          <p className="less-important">
            This game is based on the card game Set.
          </p>
          <p id="ko-help">
            <b>[ 색상 / 갯수 / 음영 / 모양 ]</b> 4가지 각각의 State가 모두
            같거나, 모두 다른 3장의 카드를 고르면 Score UP!
            <br />
            <br />
            Rule 유튜브 영상 :
            <a
              href="https://www.youtube.com/watch?v=uFKi9g6X3ng"
              target="_blank">
              Set
            </a>
          </p>
          <button onClick={start}>Game Start</button>
        </div>
      )}
      {phase == "game" && (
        <div className="sidebar">
          <Score score={score} />
          <Timer key={score} timeUp={timeUp} />
        </div>
      )}
    </div>
  );
}

// Utility hook for requestAnimationFrame
const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  // 타입 지정
  const requestRef = useRef<number | undefined>(undefined); // request ID
  const previousTimeRef = useRef<number | undefined>(undefined); // 이전 프레임 시간

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time; // 현재 시간을 저장
      requestRef.current = requestAnimationFrame(animate); // 다음 프레임 예약
    };

    requestRef.current = requestAnimationFrame(animate); // 첫 프레임 예약
    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current); // 예약 취소
      }
    };
  }, [callback]); // 콜백이 바뀔 때만 재설정
};

function Timer({ timeUp }) {
  const time = 60; // 타이머 초기 시간 (초 단위)
  const [timeLeft, setTimeLeft] = useState(time * 1000);

  // 애니메이션 프레임 훅
  useAnimationFrame((deltaTime) => {
    setTimeLeft((prevTime) => prevTime - deltaTime);
  });

  // 시간 초과 시 `timeUp` 호출
  useEffect(() => {
    if (timeLeft < 0) {
      timeUp();
    }
  }, [timeLeft, timeUp]);

  const timeLeftInSeconds = Math.max(0, Math.floor(timeLeft / 1000)); // 0 이하로 내려가지 않도록 수정
  const radius = 70;
  const circumference = 2 * radius * Math.PI;

  return (
    <svg id="timer" width="100%" height="200" viewBox="-100 -100 200 200">
      <path
        d={`M -1 -${radius} A ${radius} ${radius} 0 1 0 0 -${radius}`}
        stroke="white"
        strokeWidth="20"
        fill="none"
        strokeDasharray={`${(circumference / (time * 1000)) * timeLeft} 1000`}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="2.5em"
        fontWeight="bold"
        fill="white">
        {timeLeftInSeconds}
      </text>
    </svg>
  );
}
function Score({ score }) {
  return (
    <div className="score">
      <h3>Score</h3>
      <h1>{score}</h1>
    </div>
  );
}

function Bauble({ index, color, shading, shape, number, selected, select }) {
  const motifFill = {
    solid: "#5f4c6c",
    striped: "url(#stripe)",
    open: "transparent",
  }[shading];

  return (
    <svg
      viewBox="-100 -100 200 200"
      onClick={() => select(index)}
      className={"bauble " + (selected && "selected")}>
      <defs>
        <radialGradient id="shine" cx="0.25" cy="0.25" r="0.35">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <pattern
          id="stripe"
          patternUnits="userSpaceOnUse"
          width="10"
          height="6">
          <rect x="0" y="2.5" width="10" height="3" fill="#5f4c6c" />
        </pattern>
      </defs>

      <circle cx="0" cy="20" r="65" fill={color} />

      <g
        transform="translate(0, 20)"
        fill={motifFill}
        stroke="#5f4c6c"
        strokeWidth="3">
        <Motif shape={shape} number={number} />
      </g>

      <circle cx="0" cy="20" r="65" fill="url(#shine)" />

      <circle
        cx="0"
        cy="-70"
        r="12"
        fill="none"
        stroke="#F79257"
        strokeWidth="2"
      />
      <rect x="-17.5" y="-60" width="34" height="20" fill="#F79257" />
    </svg>
  );
}

function Motif({ shape, number }) {
  const Shape = {
    tree: Tree,
    circle: Circle,
    star: Star,
  }[shape];

  if (number == 1) {
    return <Shape />;
  }

  if (number == 2) {
    return (
      <g>
        <Shape transform="translate(-30, 0)" />
        <Shape transform="translate(30, 0)" />
      </g>
    );
  }

  return (
    <g>
      <Shape />
      <Shape transform="translate(-40, 0)" />
      <Shape transform="translate(40, 0)" />
    </g>
  );
}

function Circle({ transform }) {
  return <circle r="15" transform={transform} />;
}

function Star({ transform }) {
  return (
    <polygon
      points="0,-20 6,-8 19,-6 10,3 12,16 0,10 -12,16 -10,3 -19,-6 -6,-8"
      transform={transform}
    />
  );
}

function Tree({ transform }) {
  return (
    <polygon
      points="
        0,-24 8,-8 6,-8 12,4 10,4 16,16 4,16 4,22
        -4,22 -4,16 -16,16 -10,4 -12,4 -6,-8 -8,-8"
      transform={transform}
    />
  );
}
