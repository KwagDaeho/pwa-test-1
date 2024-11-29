export const gameLogic = () => {
  var Utils = {};

  Utils.isBetween = function (value, min, max) {
    // 특정 값(`value`)이 두 값(`min`, `max`) 사이에 있는지 확인하는 함수
    return (value - min) * (value - max) < 0;
  };
  Utils.random = function (min, max) {
    // `min`과 `max` 사이의 임의의 숫자를 생성하는 함수
    return min + Math.random() * (max - min);
  };
  Utils.getDistance = function (p1, p2) {
    // 두 점(`p1`, `p2`) 사이의 거리를 계산하는 함수
    return Math.heightypot(p1.x - p2.x, p1.y - p2.y);
  };
  Utils.lerp = function (value1, value2, amount) {
    // 두 값(`value1`, `value2`) 사이의 선형 보간을 수행하는 함수
    return value1 + (value2 - value1) * amount;
  };
  Utils.isPointInSquare = function (x, y, square) {
    // 특정 점(`x`, `y`)이 정사각형(`square`) 내부에 있는지 확인하는 함수
    return (
      Calcul.isBetween(x, square.position.x, square.position.x + square.size) &&
      Calcul.isBetween(y, square.position.y, square.position.y + square.size)
    );
  };
  Utils.splitArray = function (array, width) {
    // 주어진 배열(`array`)을 지정된 크기(`width`)만큼의 행으로 나누는 함수
    var result = [];
    for (var i = 0; i < array.length; i += width)
      result.push(array.slice(i, i + width));
    return result;
  };

  class Entity {
    constructor(world, x, y, sprite) {
      this.world = world;
      this.limit = world.limit;
      this.size = world.size;
      this.ctx = world.ctx;
      this.isPressed = false;
      this.position = {
        x: x,
        y: y,
      };
      this.velocity = {
        x: 1.15,
        y: 0,
      };
      this.friction = 0.97;
      this.force = {
        x: 0,
        y: 0.1,
      };
      this.hitFloor = 0;
      this.isDead = false;
      this.sprite = new Sprite(this.world, this, sprite);
      this.sprite.selectLine = 1;
    }
    update() {
      // 물리 계산을 통합하고 위치와 속도를 업데이트하는 함수

      // Apply force
      this.velocity.x += this.force.x;
      this.velocity.y += this.force.y;

      // Apply friction
      if (this.isDead) {
        this.velocity.x *= this.friction;
      }
      this.velocity.y *= this.friction;

      // Update position
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // Check for isCollidable with spikes
      let targetX = this.position.x + this.size / 2 + this.velocity.x;
      let targetY = this.position.y + this.size / 2 + this.velocity.y;
      if (this.world.getKeyInfo(targetX, targetY).action) {
        if (
          !this.isDead &&
          this.world.getKeyInfo(targetX, targetY).action === "isDead"
        ) {
          // this.world.sounds.defeat.url.play();
          this.isDead = true;
          this.sprite.animation = false;
          this.sprite.selectLine += 2;
          this.world.effects.push(
            new Effect(
              this.world,
              this.position.x,
              this.position.y,
              this.world.resources.effects,
              0
            )
          );
        } else if (this.world.getKeyInfo(targetX, targetY).action === "bonus") {
          this.world.terrain.geometry[Math.floor(targetY / this.size)][
            Math.floor(targetX / this.size)
          ] = 2;
          // this.world.sounds.bonus.url.play();
          this.world.score += 5;
          this.world.spawnBonus = true;
        }
      }
      // Check for collision with walls
      if (this.position.x < 32) {
        this.position.x = 32;
        this.velocity.x *= -1;
        if (!this.isDead) {
          // this.world.sounds.bonus.url.play();
          this.world.score += 1;
          this.world.leftSpikes();
          this.sprite.selectLine = 1;
        }
      }
      if (this.position.x > this.limit.x - 32 - this.size) {
        this.position.x = this.limit.x - 32 - this.size;
        this.velocity.x *= -1;
        if (!this.isDead) {
          // this.world.sounds.bonus.url.play();
          this.world.score += 1;
          this.world.rightSpikes();
          this.sprite.selectLine = 0;
        }
      }
      // Check for collision with walls and ceiling
      if (this.position.y > this.limit.y - 16 - this.size) {
        this.velocity.y *= -0.8;
        this.position.y = this.limit.y - 16 - this.size;
        if (this.hitFloor < 8) {
          this.hitFloor += 1;
        } else {
          this.world.phase("menu");
        }
      }
      if (this.position.y < 24) {
        this.velocity.y = 0;
        this.position.y = 24;
      }
      // Controls
      if (!this.isDead) {
        if (this.world.keysPressed[32] && !this.isPressed) {
          // this.world.sounds.jump.url.play();
          this.world.effects.push(
            new Effect(
              this.world,
              this.position.x,
              this.position.y,
              this.world.resources.effects,
              1
            )
          );
          this.isPressed = true;
          this.velocity.y = -2;
        }
        if (!this.world.keysPressed[32]) {
          this.isPressed = false;
        }
      }
    }
    draw() {
      this.sprite.render();
    }
    render() {
      this.draw();
      this.update();
    }
  }

  class Sprite {
    constructor(world, parent, sprite) {
      this.ctx = world.ctx;
      this.sprite = sprite;
      this.size = world.size;
      this.width = Math.round(this.sprite.img.width / this.sprite.spriteCount);
      this.height = this.sprite.img.height / this.sprite.row;
      this.position = parent.position;
      this.length = this.sprite.spriteCount;
      this.frame = 0;
      this.size = world.size;
      this.selectLine = 0;
      this.animation = true;
      this.animationSpeed = 0.2;
    }
    draw() {
      this.ctx.drawImage(
        this.sprite.img,
        Math.floor(this.frame) * this.width,
        this.selectLine * this.height,
        this.width,
        this.height,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
    animate() {
      if (this.animation) {
        this.frame += this.animationSpeed;
        if (this.frame >= this.length) {
          this.frame = 0;
        }
      }
    }
    render() {
      this.animate();
      this.draw();
    }
  }

  class Effect {
    constructor(world, x, y, sprite, row, animationSpeed) {
      this.world = world;
      this.ctx = world.ctx;
      this.sprite = sprite;
      this.size = world.size;
      this.width = Math.round(this.sprite.img.width / this.sprite.spriteCount);
      this.height = this.sprite.img.height / this.sprite.row;
      this.position = {
        x: x,
        y: y,
      };
      this.length = this.sprite.spriteCount;
      this.frame = 0;
      this.size = world.size;
      this.selectLine = row || 0;
      this.animation = true;
      this.animationSpeed = animationSpeed || 0.4;
    }
    render() {
      if (this.animation) {
        this.frame += this.animationSpeed;
        if (this.frame >= this.length) {
          this.world.effects.splice(this.world.effects.indexOf(this), 1);
        }
      }
      this.ctx.drawImage(
        this.sprite.img,
        Math.floor(this.frame) * this.width,
        this.selectLine * this.height,
        this.width,
        this.height,
        this.position.x - this.width / 4,
        this.position.y - this.width / 4,
        this.width,
        this.height
      );
    }
  }
  class World {
    constructor(parameters) {
      // Parameters: Sets the initial values for the game world
      this.alphabet =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ?!:',.()<>[]"; // Available characters
      this.size = parameters.size; // Grid size (dimensions of tiles)
      this.keysPressed = []; // Array to store the pressed tileDefinitions
      this.zoom = parameters.zoom || 2; // Zoom level for the game world, default is 2
      this.fullscreen = false; // Flag for fullscreen mode (false by default)
      this.background = "black"; // Background color of the game world
      this.state = "menu"; // Initial state of the game (starts with the menu)
      this.lastUpdateTime = 0; // 마지막 업데이트 시간
      this.targetFPS = 60; // 목표 FPS
      this.targetFrameInterval = 1000 / this.targetFPS; // 프레임 간격 (ms)
      // levels
      this.bestScore = 0;
      this.score = 0;
      this.levels = levels;
      this.currentLevel = 0;
      // resources
      this.prop = {
        count: 0,
        totalResources:
          parameters.stockImages.length + parameters.stockSounds.length,
      };
      this.resources = {};
      // Chargement + lancement
      this.createContext();
      if (this.prop !== 0) {
        this.processImages(
          parameters.stockImages,
          parameters.stockSounds,
          parameters.tileDefinitions
        );
      }

      // FPS (frames per second) tracking
      this.fps = {
        frame: 0, // Current frame count
        newTime: 0, // Current timestamp for FPS calculation
        oldTime: new Date().getMilliseconds(), // Previous timestamp for FPS calculation
        counter: 1, // Frame counter
        render: function () {
          this.newTime = new Date().getMilliseconds(); // Get the current time
          if (this.oldTime > this.newTime) {
            this.frame = this.counter; // If the new time is less, reset the frame counter
            this.counter = 1; // Reset counter
          } else {
            this.counter += 1; // Otherwise, increment the counter
          }
          this.oldTime = this.newTime; // Update the previous timestamp
        },
      };
      this.effects = []; // Array to store effects
      this.continueGame = true; // Flag for whether the game should continue
      this.spawnBonus = true; // Flag for spawning bonus items
    }
    createContext() {
      // 캔버스를 가져와서 초기화합니다.
      this.canvas = document.getElementById("game"); // 'game' ID를 가진 캔버스를 가져옵니다.
      this.ctx = this.canvas.getContext("2d"); // 캔버스의 2D 렌더링 컨텍스트를 가져옵니다.

      // 캔버스의 크기를 설정합니다.
      this.width = this.canvas.width = 128; // 캔버스의 너비를 128로 설정합니다.
      this.height = this.canvas.height = 128; // 캔버스의 높이를 128로 설정합니다.

      // 캔버스 크기의 제한을 설정합니다.
      this.limit = {
        x: this.width, // x 방향으로 캔버스 크기 제한
        y: this.height, // y 방향으로 캔버스 크기 제한
      };

      // 확대/축소 비율을 적용하여 캔버스 크기를 설정합니다.
      this.canvas.style.width = this.width * this.zoom + "px"; // 캔버스의 너비에 확대/축소 배율을 적용합니다.
      this.canvas.style.height = this.height * this.zoom + "px"; // 캔버스의 높이에 확대/축소 배율을 적용합니다.

      // 브라우저에서 이미지 부드럽게 처리하는 옵션을 비활성화합니다.
      this.ctx.mozImageSmoothingEnabled = false; // Firefox에서 이미지 smoothing 비활성화
      this.ctx.msImageSmoothingEnabled = false; // Internet Explorer에서 이미지 smoothing 비활성화
      this.ctx.imageSmoothingEnabled = false; // 기타 브라우저에서 이미지 smoothing 비활성화

      const touchToSpace = () => {
        // 스페이스바 keydown 이벤트 생성 및 디스패치
        const keydownEvent = new KeyboardEvent("keydown", {
          key: " ", // 스페이스바 키
          code: "Space", // 코드
          keyCode: 32, // 키코드
          bubbles: true, // 이벤트 버블링 허용
          cancelable: true, // 이벤트 취소 가능
        });
        document.dispatchEvent(keydownEvent);

        // 일정 시간 후에 keyup 이벤트 생성 및 디스패치
        setTimeout(() => {
          const keyupEvent = new KeyboardEvent("keyup", {
            key: " ", // 스페이스바 키
            code: "Space", // 코드
            keyCode: 32, // 키코드
            bubbles: true, // 이벤트 버블링 허용
            cancelable: true, // 이벤트 취소 가능
          });
          document.dispatchEvent(keyupEvent);
        }, 10); // 10ms 동안 눌림 상태 유지 (필요에 따라 조정 가능)
      };
      // 모바일 터치 이벤트 리스너를 설정합니다.
      document
        .getElementById("BirdContainer")
        .removeEventListener("touchstart", touchToSpace);
      document
        .getElementById("BirdContainer")
        .addEventListener("touchstart", touchToSpace, {
          passive: false,
        }); // passive 옵션을 false로 설정)

      // 키보드 이벤트 리스너를 설정합니다.
      document.addEventListener(
        "keydown",
        (event) => this.keyPress(event),
        false
      ); // 키가 눌렸을 때 처리
      document.addEventListener(
        "keyup",
        (event) => this.keyRelease(event),
        false
      ); // 키가 떼졌을 때 처리
    }
    load() {
      // 리소스 카운트를 증가시킵니다.
      this.prop.count += 1;

      // 모든 리소스가 로드되었는지 확인합니다.
      if (this.prop.count === this.prop.totalResources) {
        // 리소스가 모두 로드되면, 로딩이 끝났음을 콘솔에 출력합니다.
        console.log(
          "%c Images are loaded " +
            this.prop.totalResources +
            " / " +
            this.prop.totalResources,
          "padding:2px; border-left:2px solid green; background: lightgreen; color: #000"
        );

        // 로딩이 끝나면 패턴을 설정합니다.
        this.pattern = this.ctx.createPattern(
          this.resources.pattern.img, // 반복할 이미지로 패턴을 설정합니다.
          "repeat" // 이미지가 반복되는 방식
        );

        this.phase(this.state);
      } else {
        // 리소스가 아직 로딩 중일 경우 로딩 화면을 표시합니다.
        this.ctx.fillStyle = this.background; // 배경색을 설정합니다.
        this.ctx.fillRect(0, 0, this.width, this.height); // 캔버스를 채웁니다.
        this.ctx.fillStyle = "#fff"; // 로딩 상태를 표시할 색상으로 흰색을 설정합니다.
        this.ctx.fillRect(
          0,
          this.height / 2 - 1,
          (this.prop.count * this.width) / this.prop.totalResources,
          1
        ); // 로딩 진행률을 표시합니다.
      }
    }
    loadImage(url) {
      // 이미지를 로드하고 로딩이 완료되면 처리할 함수를 설정합니다.
      let img = new Image();
      img.onload = () => {
        this.load(); // 이미지가 로드된 후 로딩 상태를 업데이트합니다.
      };
      img.src = url; // 이미지를 로드합니다.
      return img; // 이미지를 반환합니다.
    }

    loadSound(url) {
      // 오디오 파일을 로드하고 로딩이 완료되면 처리할 함수를 설정합니다.
      let audio = new Audio(url);
      audio.addEventListener("canplaythrough", this.load(), false); // 오디오가 준비되면 로딩을 완료합니다.
      return audio; // 오디오 객체를 반환합니다.
    }

    processImages(stockImages, stockSounds, tileDefinitions) {
      // 이미지 리소스를 처리합니다.
      let imageResources = {};
      for (let i = 0; i < stockImages.length; i++) {
        let subject = stockImages[i];
        let name = subject.name;
        subject.img = this.loadImage(stockImages[i].img);
        imageResources[name] = stockImages[i];
      }
      this.resources = imageResources;
      // 사운드 리소스를 처리합니다.
      let soundResources = {};
      for (let i = 0; i < stockSounds.length; i++) {
        let subject = stockSounds[i];
        let name = subject.name;
        subject.url = this.loadSound(stockSounds[i].url);
        subject.url.volume = 0.1;
        soundResources[name] = stockSounds[i];
      }

      // this.sounds = soundResources;
      if (tileDefinitions) {
        //  processImages tileDefinitions
        this.cleanKeys = new Array(tileDefinitions.length).fill(false);
        let keyMap = {};
        for (let i = 0; i < tileDefinitions.length; i++) {
          let subject = tileDefinitions[i];
          let name = subject.id;
          if (subject.type === "sprite") {
            subject.frame = 0;
            subject.sprite = this.resources[subject.appearance];
            subject.memoryLoop = false;
            subject.canAnimate = true;
            subject.loop = true;
          }
          keyMap[name] = tileDefinitions[i];
        }
        this.tileDefinitions = keyMap;
      }
    }

    keyPress(event) {
      // 키가 눌렸을 때 처리합니다.
      this.keysPressed[event.keyCode] = true; // 눌린 키의 상태를 true로 설정합니다.
      if (this.keysPressed[70]) {
        // F 키가 눌리면 전체화면 모드로 전환합니다.
        this.toggleFullScreen();
      }
      switch (this.state) {
        case "menu":
          if (this.keysPressed[32]) {
            // 스페이스바가 눌리면 게임을 시작합니다.
            this.phase("start");
          }
          break;
      }
    }

    keyRelease(event) {
      // 키가 떼어졌을 때 처리합니다.
      this.keysPressed[event.keyCode] = false; // 떼어진 키의 상태를 false로 설정합니다.
    }

    toggleFullScreen() {
      // 전체화면 모드를 토글합니다.
      if (!this.isFullScreen) {
        // 전체화면 모드로 진입
        this.canvas.webkitRequestFullScreen();
        this.isFullScreen = true;
        this.canvas.style.width = "100vmin"; // 화면 크기를 100vmin으로 설정합니다.
        this.canvas.style.height = "100vmin"; // 화면 크기를 100vmin으로 설정합니다.
      } else {
        // 전체화면 모드를 종료
        document.webkitCancelFullScreen();
        this.isFullScreen = false;
        this.canvas.style.width = this.width * this.zoom + "px"; // 원래 크기로 복원합니다.
        this.canvas.style.height = this.height * this.zoom + "px"; // 원래 크기로 복원합니다.
      }
    }

    findKey(search) {
      // 특정 키를 찾고 해당 키의 위치를 반환합니다.
      let searchResults = [];
      for (let j = 0; j < this.terrain.dimension.y; j++) {
        for (let i = 0; i < this.terrain.dimension.x; i++) {
          let id = this.terrain.geometry[j][i]; // 지형에서 키의 ID를 가져옵니다.
          if (this.tileDefinitions[id].name === search) {
            // 키의 이름이 검색어와 일치하면
            let info = {
              position: {
                x: i,
                y: j,
              },
            };
            searchResults.push(info); // 키 위치를 결과 배열에 추가합니다.
          }
        }
      }
      return searchResults; // 키의 위치 목록을 반환합니다.
    }

    getKeyInfo(x, y) {
      // 주어진 x, y 좌표에 해당하는 키 정보를 반환합니다.
      let newX = Math.floor(x / this.size); // x 좌표를 셀 크기(`size`)로 나눈 값
      let newY = Math.floor(y / this.size); // y 좌표를 셀 크기(`size`)로 나눈 값

      // 주어진 좌표가 지형의 범위 안에 있는지 확인합니다.
      if (
        newX > -1 &&
        newX < this.terrain.dimension.x &&
        newY > -1 &&
        newY < this.terrain.dimension.y
      ) {
        // 좌표에 해당하는 키를 반환합니다.
        return this.tileDefinitions[this.terrain.geometry[newY][newX]];
      } else {
        // 좌표가 지형 범위 밖에 있으면 `false` 반환
        return false;
      }
    }
    writeText(text, x, y, color) {
      // 주어진 텍스트를 지정된 x, y 위치에 지정된 색상으로 그립니다.
      let width = 6, // 글자의 너비
        height = 9; // 글자의 높이
      let multiplier = color || 0; // 색상 값 (기본값은 0)
      let center = (text.length * width) / 2; // 텍스트의 중앙 위치 계산

      for (let i = 0; i < text.length; i++) {
        // 텍스트에서 각 문자를 하나씩 처리합니다.
        let index = this.alphabet.indexOf(text.charAt(i)), // 문자의 인덱스 찾기
          clipX = width * index, // 텍스트에서 문자의 가로 위치
          posX = x - center + i * width; // 화면에 그릴 x 좌표 계산

        // 문자 이미지를 캔버스에 그립니다.
        this.ctx.drawImage(
          this.resources.pixelFont.img, // 픽셀 폰트 이미지
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
    }
    box(x, y, w, h) {
      // 사각형의 배경을 흰색으로 그립니다.
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(x + 1, y + 1, w - 2, h - 2); // 배경 그리기

      // 사각형의 테두리를 그립니다.

      // 좌측 상단 모서리
      this.ctx.drawImage(
        this.resources.cursor.img,
        32, // 이미지에서 자를 x 위치
        16, // 이미지에서 자를 y 위치
        16, // 자를 영역의 너비
        16, // 자를 영역의 높이
        x, // 캔버스에서 그릴 x 위치
        y, // 캔버스에서 그릴 y 위치
        16, // 캔버스에 그릴 너비
        16 // 캔버스에 그릴 높이
      );

      // 우측 상단 모서리
      this.ctx.drawImage(
        this.resources.cursor.img,
        32 + 8, // 자를 x 위치 (우측으로 8픽셀 이동)
        16, // 자를 y 위치
        16, // 자를 영역의 너비
        16, // 자를 영역의 높이
        x + w - 16, // 캔버스에서 그릴 x 위치 (우측으로 위치 이동)
        y, // 캔버스에서 그릴 y 위치
        16, // 캔버스에 그릴 너비
        16 // 캔버스에 그릴 높이
      );

      // 좌측 하단 모서리
      this.ctx.drawImage(
        this.resources.cursor.img,
        32, // 이미지에서 자를 x 위치
        16 + 8, // 이미지에서 자를 y 위치 (하단으로 8픽셀 이동)
        16, // 자를 영역의 너비
        16, // 자를 영역의 높이
        x, // 캔버스에서 그릴 x 위치
        y + h - 16, // 캔버스에서 그릴 y 위치 (하단으로 위치 이동)
        16, // 캔버스에 그릴 너비
        16 // 캔버스에 그릴 높이
      );

      // 우측 하단 모서리
      this.ctx.drawImage(
        this.resources.cursor.img,
        32 + 8, // 자를 x 위치 (우측으로 8픽셀 이동)
        16 + 8, // 이미지에서 자를 y 위치 (하단으로 8픽셀 이동)
        16, // 자를 영역의 너비
        16, // 자를 영역의 높이
        x + w - 16, // 캔버스에서 그릴 x 위치 (우측 하단으로 위치 이동)
        y + h - 16, // 캔버스에서 그릴 y 위치 (하단으로 위치 이동)
        16, // 캔버스에 그릴 너비
        16 // 캔버스에 그릴 높이
      );

      // 상단
      this.ctx.drawImage(
        this.resources.cursor.img,
        32 + 4, // 자를 x 위치 (중간으로 이동)
        16, // 자를 y 위치
        16, // 자를 영역의 너비
        16, // 자를 영역의 높이
        x + 16, // 캔버스에서 그릴 x 위치 (좌측 16픽셀 이동)
        y, // 캔버스에서 그릴 y 위치
        w - 32, // 캔버스에 그릴 너비 (양옆 16픽셀씩 뺀 너비)
        16 // 캔버스에 그릴 높이
      );

      // 하단
      this.ctx.drawImage(
        this.resources.cursor.img,
        32 + 4, // 자를 x 위치 (중간으로 이동)
        16 + 8, // 자를 y 위치 (하단으로 이동)
        16, // 자를 영역의 너비
        16, // 자를 영역의 높이
        x + 16, // 캔버스에서 그릴 x 위치
        y + h - 16, // 캔버스에서 그릴 y 위치 (하단으로 위치 이동)
        w - 32, // 캔버스에 그릴 너비 (양옆 16픽셀씩 뺀 너비)
        16 // 캔버스에 그릴 높이
      );

      // 좌측
      this.ctx.drawImage(
        this.resources.cursor.img,
        32, // 자를 x 위치
        16 + 4, // 자를 y 위치 (좌측 중앙으로 이동)
        16, // 자를 영역의 너비
        16, // 자를 영역의 높이
        x, // 캔버스에서 그릴 x 위치
        y + 16, // 캔버스에서 그릴 y 위치 (상단 16픽셀 이동)
        16, // 캔버스에 그릴 너비
        h - 32 // 캔버스에 그릴 높이 (상하 16픽셀씩 뺀 높이)
      );

      // 우측
      this.ctx.drawImage(
        this.resources.cursor.img,
        32 + 8, // 자를 x 위치 (우측으로 8픽셀 이동)
        16 + 4, // 자를 y 위치 (우측 중앙으로 이동)
        16, // 자를 영역의 너비
        16, // 자를 영역의 높이
        x + w - 16, // 캔버스에서 그릴 x 위치 (우측 16픽셀 이동)
        y + 16, // 캔버스에서 그릴 y 위치
        16, // 캔버스에 그릴 너비
        h - 32 // 캔버스에 그릴 높이
      );
    }
    bitMasking() {
      // terrain의 appearance 배열을 초기화합니다.
      this.terrain.appearance = [];

      // terrain의 모든 셀을 순회합니다.
      for (var j = 0; j < this.terrain.dimension.y; j++) {
        for (var i = 0; i < this.terrain.dimension.x; i++) {
          let id = this.terrain.geometry[j][i];
          // 상단, 좌측, 우측, 하단의 이웃 셀들을 체크합니다.
          let neighbor = [0, 0, 0, 0]; // top, left, right, bottom

          // 상단 이웃 확인
          if (j - 1 > -1) {
            if (0 !== this.terrain.geometry[j - 1][i]) {
              // 상단에 값이 있다면 1로 설정
              neighbor[0] = 1;
            }
          } else {
            // 경계를 벗어나면 1로 설정
            neighbor[0] = 1;
          }

          // 좌측 이웃 확인
          if (i - 1 > -1) {
            if (0 !== this.terrain.geometry[j][i - 1]) {
              // 좌측에 값이 있다면 1로 설정
              neighbor[1] = 1;
            }
          } else {
            // 경계를 벗어나면 1로 설정
            neighbor[1] = 1;
          }

          // 우측 이웃 확인
          if (i + 1 < this.terrain.dimension.x) {
            if (0 !== this.terrain.geometry[j][i + 1]) {
              // 우측에 값이 있다면 1로 설정
              neighbor[2] = 1;
            }
          } else {
            // 경계를 벗어나면 1로 설정
            neighbor[2] = 1;
          }

          // 하단 이웃 확인
          if (j + 1 < this.terrain.dimension.y) {
            if (0 !== this.terrain.geometry[j + 1][i]) {
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
          this.terrain.appearance.push(id);
        }
      }
      this.terrain.appearance = Utils.splitArray(
        this.terrain.appearance,
        this.terrain.dimension.x
      );
    }
    renderTerrain() {
      // terrain의 각 칸을 순차적으로 그립니다.
      for (let j = 0; j < this.terrain.dimension.y; j++) {
        for (let i = 0; i < this.terrain.dimension.x; i++) {
          let id = this.terrain.geometry[j][i];

          // appearance가 "auto"일 경우 자동으로 처리
          if (this.tileDefinitions[id].appearance === "auto") {
            var sourceX = Math.floor(this.terrain.appearance[j][i]) * this.size;
            var sourceY = Math.floor(this.terrain.appearance[j][i]) * this.size;

            // 이미지를 그립니다.
            this.ctx.drawImage(
              this.resources.leaf.img,
              sourceX,
              this.tileDefinitions[id].row * this.size,
              this.size,
              this.size,
              i * this.size,
              j * this.size,
              this.size,
              this.size
            );
          }
          // type이 "sprite"일 경우 애니메이션을 처리
          else if (this.tileDefinitions[id].type === "sprite") {
            if (!this.tileDefinitions[id].memoryLoop) {
              if (this.tileDefinitions[id].canAnimate) {
                // 애니메이션 속도에 따라 프레임을 증가
                this.tileDefinitions[id].frame +=
                  this.tileDefinitions[id].animationSpeed;
              }
              // 프레임이 특정 값을 넘으면 초기화
              if (
                this.tileDefinitions[id].frame >=
                this.tileDefinitions[id].sprite.spriteCount
              ) {
                if (!this.tileDefinitions[id].loop) {
                  this.tileDefinitions[id].canAnimate = false;
                }
                this.tileDefinitions[id].frame = 0;
              }
              // 애니메이션이 진행 중임을 메모리에 저장
              this.tileDefinitions[id].memoryLoop = true;

              // 이미 지나간 ID는 처리하지 않음
              this.cleanKeys[id] = true;
            }
            // 스프라이트 이미지를 그립니다.
            this.ctx.drawImage(
              this.tileDefinitions[id].sprite.img,
              Math.floor(this.tileDefinitions[id].frame) * this.size,
              0,
              this.size,
              this.size,
              i * this.size,
              j * this.size,
              this.size,
              this.size
            );
          }
          // appearance가 특정 값이면 고정 이미지를 그립니다.
          else {
            var sourceX =
              Math.floor(this.tileDefinitions[id].appearance % 16) * this.size;
            var sourceY =
              Math.floor(this.tileDefinitions[id].appearance / 16) * this.size;
            // 이미지를 그립니다.
            this.ctx.drawImage(
              this.resources.leaf.img,
              sourceX,
              sourceY,
              this.size,
              this.size,
              i * this.size,
              j * this.size,
              this.size,
              this.size
            );
          }
        }
      }
      // clear 배열을 순회하며, 메모리에서 애니메이션을 종료
      for (var i = 0; i < this.cleanKeys.length; i++) {
        if (this.cleanKeys[i]) {
          this.tileDefinitions[i].memoryLoop = false;
        }
      }
    }
    initializeMap() {
      // terrain 객체 초기화
      this.terrain = {};
      this.terrain.geometry = this.levels[this.currentLevel].geometry;
      this.terrain.dimension = {
        x: this.terrain.geometry[0].length,
        y: this.terrain.geometry.length,
      };
      this.terrain.appearance = [];
      // 비트 마스킹을 적용
      this.bitMasking();
    }
    randomSpikes() {
      // 아래 범위의 갯수만큼 랜덤한 y값을 생성하여 반환
      const spikeCount = Utils.random(1.8, Math.min(3 + this.score / 50), 5);

      // 100점 달성시 최고난이도 진입
      let draw = [];
      while (draw.length < spikeCount) {
        let randomNumber = Math.round(Utils.random(4, 12));
        if (draw.indexOf(randomNumber) === -1) {
          draw.push(randomNumber);
        }
      }
      return draw;
    }
    leftSpikes() {
      // 왼쪽 칸을 2로 채운 후 오른쪽에 랜덤한 spike를 배치
      for (var i = 0; i < 9; i++) {
        this.terrain.geometry[4 + i][4] = 2;
      }
      let distribute = this.randomSpikes();
      for (var i = 0; i < distribute.length; i++) {
        this.terrain.geometry[distribute[i]][11] = 6;
      }
      // bonus가 이미 없다면 bonus 추가
      if (this.spawnBonus || Utils.random(0, 8) < 1) {
        this.spawnBonus = false;
        let posBonus = Math.round(Utils.random(4, 12));
        // bonus 효과 추가
        this.effects.push(
          new Effect(
            this,
            10 * this.size + 2,
            posBonus * this.size,
            this.resources.effects,
            0
          )
        );
        // bonus를 terrain에 설정
        this.terrain.geometry[posBonus][10] = 7;
      }
    }
    rightSpikes() {
      // 오른쪽 칸을 2로 채운 후 오른쪽에 랜덤한 spike를 배치
      for (var i = 0; i < 9; i++) {
        this.terrain.geometry[4 + i][11] = 2;
      }
      let distribute = this.randomSpikes();
      for (var i = 0; i < distribute.length; i++) {
        this.terrain.geometry[distribute[i]][4] = 5;
      }
      // bonus가 이미 없다면 bonus 추가
      if (this.spawnBonus || Utils.random(0, 8) < 1) {
        this.spawnBonus = false;
        let posBonus = Math.round(Utils.random(4, 12));
        this.effects.push(
          new Effect(
            this,
            5 * this.size + 2,
            posBonus * this.size,
            this.resources.effects,
            0
          )
        );
        // bonus를 terrain에 설정
        this.terrain.geometry[posBonus][5] = 7;
      }
    }
    cleanUpSpikes() {
      // 왼쪽과 오른쪽, 중앙의 칸들을 2로 초기화
      for (var i = 0; i < 9; i++) {
        this.terrain.geometry[4 + i][4] = 2;
      }
      for (var i = 0; i < 9; i++) {
        this.terrain.geometry[4 + i][11] = 2;
      }
      for (var i = 0; i < 9; i++) {
        this.terrain.geometry[4 + i][10] = 2;
      }
      for (var i = 0; i < 9; i++) {
        this.terrain.geometry[4 + i][5] = 2;
      }
    }
    initialize() {
      // 맵 초기화 후 새 게임 시작
      this.initializeMap();
      this.spawnBonus = true;
      this.score = 0;
      this.continueGame = true;
      this.bird = new Entity(
        this,
        this.width / 2,
        this.height / 2,
        this.resources.bird
      );
      this.loop();
    }
    render() {
      // 기본 배경과 화면 요소 렌더링
      this.ctx.fillStyle = this.pattern;
      this.ctx.fillRect(32, 24, 64, 88);

      this.renderTerrain();
      this.writeText(this.score.toString(), this.height / 2, 4);
      this.bird.render();
      for (var i = this.effects.length - 1; i >= 0; i--) {
        this.effects[i].render();
      }
    }
    loop() {
      const currentTime = performance.now(); // 현재 시간(ms)
      const deltaTime = currentTime - this.lastUpdateTime; // 지난 프레임 이후 경과 시간
      if (deltaTime >= this.targetFrameInterval) {
        this.lastUpdateTime =
          currentTime - (deltaTime % this.targetFrameInterval); // 시간 보정
        // 화면 초기화 및 렌더링
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (deltaTime / this.targetFrameInterval < 3) {
          for (
            let index = 1;
            index < deltaTime / this.targetFrameInterval;
            index++
          ) {
            this.render(); // 렌더링 및 게임 업데이트
          }
        } else {
          this.render(); // 렌더링 및 게임 업데이트
        }
      }

      if (this.continueGame) {
        this.animation = requestAnimationFrame(() => this.loop()); // 다음 루프 실행
      }
    }
    phase(phase) {
      // 게임 상태 설정 및 메뉴 렌더링
      this.state = phase;
      this.continueGame = false;
      cancelAnimationFrame(this.animation);
      this.ctx.fillStyle = this.background;
      this.ctx.fillRect(0, 0, this.width, this.height);
      switch (phase) {
        case "menu":
          if (this.score > this.bestScore) {
            this.bestScore = this.score;
          }
          this.initializeMap();
          this.cleanUpSpikes();
          this.ctx.fillStyle = this.pattern;
          this.ctx.fillRect(32, 24, 64, 88);
          this.renderTerrain();
          this.ctx.fillStyle = "black";
          this.ctx.globalAlpha = 0.8;
          this.ctx.fillRect(0, 0, this.width, this.height);
          this.ctx.globalAlpha = 1;
          if (window.innerWidth > 768) {
            this.writeText(
              "Best Score : " + this.bestScore,
              this.height / 2,
              5
            );
            this.writeText(
              "[spacebar] to jump",
              this.width / 2,
              this.height / 3
            );
            this.writeText(
              "[f] to fullscreen",
              this.width / 2,
              this.height / 2
            );
          } else {
            this.writeText("Best : " + this.bestScore, this.height / 2, 5);
            this.writeText("[touch]", this.width / 2, this.height / 3);
            this.writeText("to jump", this.width / 2, this.height / 2);
          }

          break;
        case "start":
          this.initialize();
          break;
        default:
          console.log("Unrecognized action");
      }
    }
  }

  let parameters = {
    size: 8,
    zoom: 4,

    stockSounds: [
      {
        url: "http://www.noiseforfun.com/waves/interface-and-media/NFF-select-04.wav",
        name: "jump", // 점프 사운드
      },
      {
        url: "http://www.noiseforfun.com/waves/interface-and-media/NFF-menu-04-b.wav",
        name: "bonus", // 보너스 사운드
      },
      {
        url: "http://www.noiseforfun.com/waves/interface-and-media/NFF-lose.wav",
        name: "defeat", // 패배 사운드
      },
    ],

    stockImages: [
      { img: "https://image.ibb.co/by5TQQ/font.png", name: "pixelFont" },
      {
        img: "https://image.ibb.co/kiYF5Q/oiseau.png",
        name: "bird",
        spriteCount: 6,
        row: 4,
        animationSpeed: 0.6,
      },
      {
        img: "https://image.ibb.co/mvORC5/effets.png",
        name: "effects",
        spriteCount: 7,
        row: 3,
        animationSpeed: 0.6,
      },
      { img: "https://image.ibb.co/hCPoQQ/feuille.png", name: "leaf" },
      {
        img: "https://image.ibb.co/dojBek/piece.png",
        name: "coin",
        spriteCount: 6,
      },
      { img: "https://image.ibb.co/gU7a5Q/motif.png", name: "pattern" },
    ],

    tileDefinitions: [
      { type: "tile", name: "empty", id: 0, isCollidable: true },
      {
        type: "tile",
        name: "wall",
        id: 1,
        isCollidable: false,
        appearance: "auto",
        row: 1,
      },
      {
        type: "tile",
        name: "background",
        id: 2,
        isCollidable: false,
        appearance: 0,
      },
      {
        type: "tile",
        name: "spikeTop",
        id: 3,
        isCollidable: false,
        appearance: 2,
        action: "isDead",
      },
      {
        type: "tile",
        name: "spikeBottom",
        id: 4,
        isCollidable: false,
        appearance: 3,
        action: "isDead",
      },
      {
        type: "tile",
        name: "spikeLeft",
        id: 5,
        isCollidable: false,
        appearance: 4,
        action: "isDead",
      },
      {
        type: "tile",
        name: "spikeRight",
        id: 6,
        isCollidable: false,
        appearance: 5,
        action: "isDead",
      },
      {
        type: "sprite",
        name: "next",
        id: 7,
        isCollidable: false,
        action: "bonus",
        appearance: "coin",
        row: 1,
        animationSpeed: 0.2,
      },
    ],
  };

  let levels = [
    {
      name: "lvl1",
      geometry: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
  ];

  new World(parameters, levels);
};
