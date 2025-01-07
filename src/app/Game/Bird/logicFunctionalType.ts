import {
  alphabets,
  IMAGES_BIRD,
  levels,
  parameters,
} from "@/constants/game_bird";
import { BirdImagesData } from "@/types/LocalData";
import { sound, util } from "@/util/game";

export const gameLogic = () => {
  const world = (parameters, levels) => {
    const size = parameters.size; // Grid size (dimensions of tiles)
    const keysPressed = []; // Array to store the pressed tileDefinitions
    const zoom = parameters.zoom || 2; // Zoom level for the game world, default is 2
    const background = "black"; // Background color of the game world
    let state = "menu"; // Initial state of the game (starts with the menu)
    const { tileDefinitions } = parameters;
    let lastUpdateTime = 0; // 마지막 업데이트 시간
    const targetFPS = 60; // 목표 FPS
    let targetFrameInterval = 1000 / targetFPS; // 프레임 간격 (ms)
    // levels
    let bestScore = 0;
    let score = 0;
    const currentLevel = 0;
    // resources
    const prop = {
      count: 0,
      totalResources: IMAGES_BIRD.length,
    };
    let resources: BirdImagesData = {
      bird: {},
      leaf: {
        url: null,
        img: null,
      },
      pattern: {
        url: null,
        img: null,
      },
      pixelFont: {
        url: null,
        img: null,
      },
      effects: [],
    };
    // Chargement + lancement
    let birdState = 1;
    // FPS (frames per second) tracking
    const effects = []; // Array to store effects
    let continueGame = true; // Flag for whether the game should continue
    let spawnBonus = true; // Flag for spawning bonus items
    let canvas;
    let ctx;
    let width = 128;
    let height = 128;
    const limit = {
      x: width, // x 방향으로 캔버스 크기 제한
      y: height, // y 방향으로 캔버스 크기 제한
    };
    let pattern;
    let cleanKeys;
    let terrain;
    let bird;
    let animation;
    let frame = 0;

    const createContext = () => {
      // 캔버스를 가져와서 초기화합니다.
      canvas = document.getElementById("game"); // 'game' ID를 가진 캔버스를 가져옵니다.
      ctx = canvas.getContext("2d"); // 캔버스의 2D 렌더링 컨텍스트를 가져옵니다.
      // 캔버스의 크기를 설정합니다.
      width = canvas.width = 128; // 캔버스의 너비를 128로 설정합니다.
      height = canvas.height = 128; // 캔버스의 높이를 128로 설정합니다.
      // 캔버스 크기의 제한을 설정합니다.
      // 확대/축소 비율을 적용하여 캔버스 크기를 설정합니다.
      canvas.style.width = width * zoom + "px"; // 캔버스의 너비에 확대/축소 배율을 적용합니다.
      canvas.style.height = height * zoom + "px"; // 캔버스의 높이에 확대/축소 배율을 적용합니다.

      // 브라우저에서 이미지 부드럽게 처리하는 옵션을 비활성화합니다.
      ctx.mozImageSmoothingEnabled = false; // Firefox에서 이미지 smoothing 비활성화
      ctx.msImageSmoothingEnabled = false; // Internet Explorer에서 이미지 smoothing 비활성화
      ctx.imageSmoothingEnabled = false; // 기타 브라우저에서 이미지 smoothing 비활성화

      const touchToSpaceStart = (e) => {
        // 스페이스바 keydown 이벤트 생성 및 디스패치
        e.preventDefault();
        const keydownEvent = new KeyboardEvent("keydown", {
          key: " ", // 스페이스바 키
          code: "Space", // 코드
          keyCode: 32, // 키코드
          bubbles: true, // 이벤트 버블링 허용
          cancelable: true, // 이벤트 취소 가능
        });
        document.dispatchEvent(keydownEvent);
      };
      const touchToSpaceEnd = () => {
        // keyup 이벤트 생성 및 디스패치
        const keyupEvent = new KeyboardEvent("keyup", {
          key: " ", // 스페이스바 키
          code: "Space", // 코드
          keyCode: 32, // 키코드
          bubbles: true, // 이벤트 버블링 허용
          cancelable: true, // 이벤트 취소 가능
        });
        document.dispatchEvent(keyupEvent);
      };
      // 모바일 터치 이벤트 리스너를 설정합니다.
      document
        .getElementById("BirdContainer")
        .removeEventListener("touchstart", touchToSpaceStart);
      document
        .getElementById("BirdContainer")
        .addEventListener("touchstart", touchToSpaceStart, {
          passive: false,
        }); // passive 옵션을 false로 설정)
      document
        .getElementById("BirdContainer")
        .removeEventListener("touchend", touchToSpaceEnd);
      document
        .getElementById("BirdContainer")
        .addEventListener("touchend", touchToSpaceEnd, {
          passive: false,
        }); // passive 옵션을 false로 설정)

      // 키보드 이벤트 리스너를 설정합니다.
      document.addEventListener("keydown", (event) => keyPress(event), false); // 키가 눌렸을 때 처리
      document.addEventListener("keyup", (event) => keyRelease(event), false); // 키가 떼졌을 때 처리
    };
    createContext();
    const load = () => {
      // 리소스 카운트를 증가시킵니다.
      prop.count += 1;

      // 모든 리소스가 로드되었는지 확인합니다.
      if (prop.count === prop.totalResources) {
        // 리소스가 모두 로드되면, 로딩이 끝났음을 콘솔에 출력합니다.
        console.log(
          "%c Images are loaded " +
            prop.totalResources +
            " / " +
            prop.totalResources,
          "padding:2px; border-left:2px solid green; background: lightgreen; color: #000"
        );

        // 로딩이 끝나면 패턴을 설정합니다.
        pattern = ctx.createPattern(
          resources.pattern.img, // 반복할 이미지로 패턴을 설정합니다.
          "repeat" // 이미지가 반복되는 방식
        );
        sound("/sound/game-start.mp3").load();
        sound("/sound/defeat.mp3").load();
        sound("/sound/get-coin.mp3").load();
        sound("/sound/get-point.mp3").load();
        sound("/sound/jump.mp3").load();
        phase(state);
      } else {
        // 리소스가 아직 로딩 중일 경우 로딩 화면을 표시합니다.
        ctx.fillStyle = background; // 배경색을 설정합니다.
        ctx.fillRect(0, 0, width, height); // 캔버스를 채웁니다.
        ctx.fillStyle = "#fff"; // 로딩 상태를 표시할 색상으로 흰색을 설정합니다.
        ctx.fillRect(
          0,
          height / 2 - 1,
          (prop.count * width) / prop.totalResources,
          1
        ); // 로딩 진행률을 표시합니다.
      }
    };
    const loadImage = (url) => {
      // 이미지를 로드하고 로딩이 완료되면 처리할 함수를 설정합니다.
      const img = new Image();
      img.onload = () => {
        load(); // 이미지가 로드된 후 로딩 상태를 업데이트합니다.
      };
      img.src = url; // 이미지를 로드합니다.
      return img; // 이미지를 반환합니다.
    };

    const processResources = (tileDefinitions) => {
      // 이미지 리소스를 처리합니다.
      const imageResources = resources;
      for (let i = 0; i < IMAGES_BIRD.length; i++) {
        const subject = IMAGES_BIRD[i];
        const name = subject.name;
        subject.img = loadImage(IMAGES_BIRD[i].url);
        imageResources[name] = IMAGES_BIRD[i];
      }
      resources = imageResources;

      if (tileDefinitions) {
        //  processResources tileDefinitions
        cleanKeys = new Array(tileDefinitions.length).fill(false);
        const keyMap = {};
        for (let i = 0; i < tileDefinitions.length; i++) {
          const subject = tileDefinitions[i];
          const name = subject.id;
          if (subject.type === "sprite") {
            subject.frame = 0;
            subject.sprite = resources[subject.appearance];
            subject.memoryLoop = false;
            subject.canAnimate = true;
            subject.loop = true;
          }
          keyMap[name] = tileDefinitions[i];
        }
        tileDefinitions = keyMap;
      }
    };
    console.log(prop);
    processResources(tileDefinitions);
    const keyPress = (event) => {
      // 키가 눌렸을 때 처리합니다.
      keysPressed[event.keyCode] = true; // 눌린 키의 상태를 true로 설정합니다.
      // if (this.keysPressed[70]) {
      //   // F 키가 눌리면 전체화면 모드로 전환합니다.
      //   this.toggleFullScreen();
      // }
      switch (state) {
        case "menu":
          if (keysPressed[32]) {
            birdState = 1;
            sound("/sound/game-start.mp3").play();
            // 스페이스바가 눌리면 게임을 시작합니다.
            phase("start");
          }
          break;
      }
    };

    const keyRelease = (event) => {
      // 키가 떼어졌을 때 처리합니다.
      keysPressed[event.keyCode] = false; // 떼어진 키의 상태를 false로 설정합니다.
    };

    const getKeyInfo = (x, y) => {
      // 주어진 x, y 좌표에 해당하는 키 정보를 반환합니다.
      const newX = Math.floor(x / size); // x 좌표를 셀 크기(`size`)로 나눈 값
      const newY = Math.floor(y / size); // y 좌표를 셀 크기(`size`)로 나눈 값

      // 주어진 좌표가 지형의 범위 안에 있는지 확인합니다.
      if (
        newX > -1 &&
        newX < terrain.dimension.x &&
        newY > -1 &&
        newY < terrain.dimension.y
      ) {
        // 좌표에 해당하는 키를 반환합니다.
        return tileDefinitions[terrain.geometry[newY][newX]];
      } else {
        // 좌표가 지형 범위 밖에 있으면 `false` 반환
        return false;
      }
    };
    const writeText = (text, x, y, color?) => {
      // 주어진 텍스트를 지정된 x, y 위치에 지정된 색상으로 그립니다.
      const width = 6, // 글자의 너비
        height = 9; // 글자의 높이
      const multiplier = color || 0; // 색상 값 (기본값은 0)
      const center = (text.length * width) / 2; // 텍스트의 중앙 위치 계산

      for (let i = 0; i < text.length; i++) {
        // 텍스트에서 각 문자를 하나씩 처리합니다.
        const index = alphabets.indexOf(text.charAt(i)), // 문자의 인덱스 찾기
          clipX = width * index, // 텍스트에서 문자의 가로 위치
          posX = x - center + i * width; // 화면에 그릴 x 좌표 계산

        // 문자 이미지를 캔버스에 그립니다.
        ctx.drawImage(
          resources.pixelFont.img, // 픽셀 폰트 이미지
          clipX, // 자르기 시작 위치 (가로)
          multiplier * height, // 자르기 시작 위치 (세로)
          width, // 자를 영역의 너비
          height, // 자를 영역의 높이
          posX, // 캔버스에 그릴 x 좌표
          y, // 캔버스에 그릴 y 좌표
          width, // 캔버스에 그릴 너비
          height // 캔버스에 그릴 높이
        );
      }
    };
    const bitMasking = () => {
      // terrain의 appearance 배열을 초기화합니다.
      terrain.appearance = [];

      // terrain의 모든 셀을 순회합니다.
      for (let j = 0; j < terrain.dimension.y; j++) {
        for (let i = 0; i < terrain.dimension.x; i++) {
          let id = terrain.geometry[j][i];
          // 상단, 좌측, 우측, 하단의 이웃 셀들을 체크합니다.
          const neighbor = [0, 0, 0, 0]; // top, left, right, bottom

          // 상단 이웃 확인
          if (j - 1 > -1) {
            if (0 !== terrain.geometry[j - 1][i]) {
              // 상단에 값이 있다면 1로 설정
              neighbor[0] = 1;
            }
          } else {
            // 경계를 벗어나면 1로 설정
            neighbor[0] = 1;
          }

          // 좌측 이웃 확인
          if (i - 1 > -1) {
            if (0 !== terrain.geometry[j][i - 1]) {
              // 좌측에 값이 있다면 1로 설정
              neighbor[1] = 1;
            }
          } else {
            // 경계를 벗어나면 1로 설정
            neighbor[1] = 1;
          }

          // 우측 이웃 확인
          if (i + 1 < terrain.dimension.x) {
            if (0 !== terrain.geometry[j][i + 1]) {
              // 우측에 값이 있다면 1로 설정
              neighbor[2] = 1;
            }
          } else {
            // 경계를 벗어나면 1로 설정
            neighbor[2] = 1;
          }

          // 하단 이웃 확인
          if (j + 1 < terrain.dimension.y) {
            if (0 !== terrain.geometry[j + 1][i]) {
              // 하단에 값이 있다면 1로 설정
              neighbor[3] = 1;
            }
          } else {
            // 경계를 벗어나면 1로 설정
            neighbor[3] = 1;
          }

          // 비트 마스크 계산 (상, 좌, 우, 하 순으로 1, 2, 4, 8을 더함)
          id =
            1 * neighbor[0] +
            2 * neighbor[1] +
            4 * neighbor[2] +
            8 * neighbor[3];
          // appearance 배열에 비트 마스크 값을 추가합니다.
          terrain.appearance.push(id);
        }
      }
      terrain.appearance = util.splitArray(
        terrain.appearance,
        terrain.dimension.x
      );
    };
    const renderTerrain = () => {
      if (!terrain) return;
      // terrain의 각 칸을 순차적으로 그립니다.
      for (let j = 0; j < terrain.dimension.y; j++) {
        for (let i = 0; i < terrain.dimension.x; i++) {
          const id = terrain.geometry[j][i];

          // appearance가 "auto"일 경우 자동으로 처리
          if (tileDefinitions[id].appearance === "auto") {
            const sourceX = Math.floor(terrain.appearance[j][i]) * size;

            // 이미지를 그립니다.
            ctx.drawImage(
              resources.leaf.img,
              sourceX,
              tileDefinitions[id].row * size,
              size,
              size,
              i * size,
              j * size,
              size,
              size
            );
          }
          // type이 "sprite"일 경우 애니메이션을 처리
          else if (tileDefinitions[id].type === "sprite") {
            if (!tileDefinitions[id].memoryLoop) {
              if (tileDefinitions[id].canAnimate) {
                // 애니메이션 속도에 따라 프레임을 증가
                tileDefinitions[id].frame += tileDefinitions[id].animationSpeed;
              }
              // 프레임이 특정 값을 넘으면 초기화
              if (
                tileDefinitions[id].frame >=
                tileDefinitions[id].sprite.spriteCount
              ) {
                if (!tileDefinitions[id].loop) {
                  tileDefinitions[id].canAnimate = false;
                }
                tileDefinitions[id].frame = 0;
              }
              // 애니메이션이 진행 중임을 메모리에 저장
              tileDefinitions[id].memoryLoop = true;

              // 이미 지나간 ID는 처리하지 않음
              cleanKeys[id] = true;
            }
            // 스프라이트 이미지를 그립니다.
            ctx.drawImage(
              tileDefinitions[id].sprite.img,
              Math.floor(tileDefinitions[id].frame) * size,
              0,
              size,
              size,
              i * size,
              j * size,
              size,
              size
            );
          }
          // appearance가 특정 값이면 고정 이미지를 그립니다.
          else {
            const sourceX =
              Math.floor(tileDefinitions[id].appearance % 16) * size;
            const sourceY =
              Math.floor(tileDefinitions[id].appearance / 16) * size;
            // 이미지를 그립니다.
            ctx.drawImage(
              resources.leaf.img,
              sourceX,
              sourceY,
              size,
              size,
              i * size,
              j * size,
              size,
              size
            );
          }
        }
      }
      // clear 배열을 순회하며, 메모리에서 애니메이션을 종료
      for (let i = 0; i < cleanKeys.length; i++) {
        if (cleanKeys[i]) {
          tileDefinitions[i].memoryLoop = false;
        }
      }
    };
    const initializeMap = () => {
      terrain = {};
      terrain.geometry = levels[currentLevel].geometry;
      terrain.dimension = {
        x: terrain.geometry[0].length,
        y: terrain.geometry.length,
      };
      terrain.appearance = [];
      // 비트 마스킹을 적용
      bitMasking();
    };
    const randomSpikes = () => {
      // 아래 범위의 갯수만큼 랜덤한 y값을 생성하여 반환
      // 9000점 달성 이후부터, 최고난이도 (= 최대 6개 생성)
      const spikeCount = util.random(1.2, Math.min(3 + score / 3000, 6));

      const draw = [];
      while (draw.length < spikeCount) {
        const randomNumber = Math.round(util.random(4, 12));
        if (draw.indexOf(randomNumber) === -1) {
          draw.push(randomNumber);
        }
      }
      return draw;
    };
    const leftSpikes = () => {
      // 왼쪽 칸을 2로 채운 후 오른쪽에 랜덤한 spike를 배치
      for (let i = 0; i < 9; i++) {
        terrain.geometry[4 + i][4] = 2;
      }
      const distribute = randomSpikes();
      for (let i = 0; i < distribute.length; i++) {
        terrain.geometry[distribute[i]][11] = 6;
      }
      if (spawnBonus || util.random(0, 100) < 40) {
        // 코인 습득 이후는 76%, 아닌 경우에는 40% 확률로 코인 생성
        spawnBonus = false;
        const posBonus = Math.round(util.random(4, 12));
        // bonus 효과 추가
        effects.push(
          effect(10 * size + 2, posBonus * size, 0, resources.effects, 0)
        );
        // bonus를 terrain에 설정
        terrain.geometry[posBonus][10] = 7;
      }
    };
    const rightSpikes = () => {
      // 오른쪽 칸을 2로 채운 후 오른쪽에 랜덤한 spike를 배치
      for (let i = 0; i < 9; i++) {
        terrain.geometry[4 + i][11] = 2;
      }
      const distribute = randomSpikes();
      for (let i = 0; i < distribute.length; i++) {
        terrain.geometry[distribute[i]][4] = 5;
      }
      if (spawnBonus || util.random(0, 100) < 40) {
        // 코인 습득 이후는 76%, 아닌 경우에는 40% 확률로 코인 생성
        const posBonus = Math.round(util.random(4, 12));
        effects.push(
          effect(5 * size + 2, posBonus * size, 0, resources.effects, 0)
        );
        // bonus를 terrain에 설정
        terrain.geometry[posBonus][5] = 7;
      }
    };
    const cleanUpSpikes = () => {
      // 왼쪽과 오른쪽, 중앙의 칸들을 2로 초기화
      for (let i = 0; i < 9; i++) {
        if (terrain) {
          terrain.geometry[4 + i][4] = 2;
        }
      }
      for (let i = 0; i < 9; i++) {
        if (terrain) {
          terrain.geometry[4 + i][11] = 2;
        }
      }
      for (let i = 0; i < 9; i++) {
        if (terrain) {
          terrain.geometry[4 + i][10] = 2;
        }
      }
      for (let i = 0; i < 9; i++) {
        if (terrain) {
          terrain.geometry[4 + i][5] = 2;
        }
      }
    };
    function initialize() {
      // 맵 초기화 후 새 게임 시작
      initializeMap();
      spawnBonus = true;
      score = 0;
      continueGame = true;
      bird = entity(width / 2, height / 2); // bird 객체 생성
      loop();
    }
    const render = () => {
      // 기본 배경과 화면 요소 렌더링
      ctx.fillStyle = pattern;
      ctx.fillRect(32, 24, 64, 88);

      renderTerrain();
      writeText(score.toString(), height / 2, 4);
      bird.render();
      for (let i = effects.length - 1; i >= 0; i--) {
        effects[i].render();
      }
    };
    const loop = () => {
      if (score > 48) {
        // 6000점 달성시 최고속도 도달
        targetFrameInterval = Math.max(14, 18 - score / 1000);
      } else {
        targetFrameInterval = 1000 / targetFPS;
      }
      const currentTime = performance.now(); // 현재 시간(ms)
      const deltaTime = currentTime - lastUpdateTime; // 지난 프레임 이후 경과 시간
      if (deltaTime >= targetFrameInterval) {
        lastUpdateTime = currentTime - (deltaTime % targetFrameInterval); // 시간 보정

        if (
          2 < deltaTime / targetFrameInterval &&
          deltaTime / targetFrameInterval < 3
        ) {
          for (
            let index = 1;
            index < deltaTime / targetFrameInterval;
            index++
          ) {
            // 화면 초기화 및 렌더링
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, width, height);
            render(); // 부족한 프레임만큼 반복하여 렌더링 및 게임 업데이트
          }
        } else {
          // 화면 초기화 및 렌더링
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, width, height);
          render(); // 프레임에 맞추어 렌더링 및 게임 업데이트
        }
      }

      if (continueGame) {
        animation = requestAnimationFrame(() => loop()); // 다음 루프 실행
      }
    };
    const phase = (phase) => {
      // 게임 상태 설정 및 메뉴 렌더링
      state = phase;
      continueGame = false;
      cancelAnimationFrame(animation);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      switch (phase) {
        case "menu":
          if (score > bestScore) {
            window.postGameScore(score);
            bestScore = score;
          }
          initializeMap();
          cleanUpSpikes();
          ctx.fillStyle = pattern;
          ctx.fillRect(32, 24, 64, 88);
          renderTerrain();
          ctx.fillStyle = "black";
          ctx.globalAlpha = 0.8;
          ctx.fillRect(0, 0, width, height);
          ctx.globalAlpha = 1;
          if (window.innerWidth > 768) {
            writeText("Best Score : " + bestScore, height / 2, 5);
            writeText("[spacebar] to jump", width / 2, height / 3);
          } else {
            writeText("Best : " + bestScore, height / 2, 5);
            writeText("[touch]", width / 2, height / 3);
            writeText("to jump", width / 2, height / 2);
          }
          break;
        case "start":
          initialize();
          break;
        default:
          console.log("Unrecognized action");
      }
    };
    const entity = (x, y) => {
      let isPressed = false;
      const position = {
        x: x,
        y: y,
      };
      const velocity = {
        x: 1.15,
        y: 0,
      };
      const friction = 0.97;
      const force = {
        x: 0,
        y: 0.1,
      };
      let hitFloor = 0;
      let isDead = false;
      const update = () => {
        // 물리 계산을 통합하고 위치와 속도를 업데이트하는 함수

        // Apply force
        velocity.x += force.x;
        velocity.y += force.y;

        // Apply friction
        if (isDead) {
          velocity.x *= friction;
        }
        velocity.y *= friction;

        // Update position
        position.x += velocity.x;
        position.y += velocity.y;

        // Check for isCollidable with spikes
        const targetX = position.x + size / 2 + velocity.x;
        const targetY = position.y + size / 2 + velocity.y;
        if (getKeyInfo(targetX, targetY).action) {
          if (!isDead && getKeyInfo(targetX, targetY).action === "isDead") {
            sound("/sound/defeat.mp3").play();
            isDead = true;
            birdState = 2;
            effects.push(
              effect(position.x, position.y, 0, resources.effects, 0)
            );
          } else if (getKeyInfo(targetX, targetY).action === "bonus") {
            terrain.geometry[Math.floor(targetY / size)][
              Math.floor(targetX / size)
            ] = 2;
            sound("/sound/get-coin.mp3").play();
            score += util.randomFloor(10, 80);
            if (util.random(0, 9) < 6) {
              // 보너스 습득 후 벽 도달시, 60% 확률로 보너스 코인 생성
              spawnBonus = true;
            }
          }
        }
        // Check for collision with walls
        if (position.x < 32) {
          position.x = 32;
          velocity.x *= -1;
          if (!isDead) {
            sound("/sound/get-point.mp3").play();
            score += 10;
            leftSpikes();
            birdState = 1;
          }
        }
        if (position.x > limit.x - 32 - size) {
          position.x = limit.x - 32 - size;
          velocity.x *= -1;
          if (!isDead) {
            sound("/sound/get-point.mp3").play();
            score += 10;
            rightSpikes();
            birdState = 0;
          }
        }
        // Check for collision with walls and ceiling
        if (position.y > limit.y - 16 - size) {
          velocity.y *= -0.8;
          position.y = limit.y - 16 - size;
          if (hitFloor < 8) {
            hitFloor += 1;
          } else {
            phase("menu");
          }
        }
        if (position.y < 24) {
          velocity.y = 0;
          position.y = 24;
        }
        // Controls
        if (!isDead) {
          if (keysPressed[32] && !isPressed) {
            sound("/sound/jump.mp3").play();
            effects.push(
              effect(position.x, position.y, 1, resources.effects, 0)
            );
            isPressed = true;
            velocity.y = -2;
          }
          if (!keysPressed[32]) {
            isPressed = false;
          }
        }
      };
      const sprite = (sprite, birdState) => {
        const width = Math.round(sprite.img.width / sprite.spriteCount);
        const height = sprite.img.height / sprite.row;
        const length = sprite.spriteCount;
        const animationSpeed = 0.6;

        const draw = () => {
          ctx.drawImage(
            sprite.img,
            birdState == 2 ? 0 : Math.floor(frame) * width,
            birdState * height,
            width,
            height,
            position.x,
            position.y,
            width,
            height
          );
        };

        const animate = () => {
          if (animation) {
            frame += animationSpeed;
            if (frame >= length) {
              frame = 0;
            }
          }
        };

        const render = () => {
          animate();
          draw();
        };

        return {
          render,
        };
      };
      const draw = () => {
        sprite(resources.bird, birdState).render();
      };
      const render = () => {
        draw();
        update();
      };
      return {
        render,
      };
    };
    const effect = (x, y, row, sprite, animationSpeed) => {
      const width = Math.round(sprite.img.width / sprite.spriteCount);
      const height = sprite.img.height / sprite.row;
      const position = {
        x: x,
        y: y,
      };
      const length = sprite.spriteCount;
      let frame = 0;
      const selectLine = row || 0;
      const effectAnimationSpeed = animationSpeed || 0.4;
      const render = () => {
        frame += effectAnimationSpeed;
        if (frame >= length) {
          effects.shift();
        }
        ctx.drawImage(
          sprite.img,
          Math.floor(frame) * width,
          selectLine * height,
          width,
          height,
          position.x - width / 4,
          position.y - width / 4,
          width,
          height
        );
      };
      return {
        render,
      };
    };
  };

  world(parameters, levels);
};
