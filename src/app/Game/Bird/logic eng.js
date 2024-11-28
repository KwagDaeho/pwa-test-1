export const gameLogic = () => {
  var Utils = {};

  // Checks if a value is between two other values
  // 특정 값(`value`)이 두 값(`min`, `max`) 사이에 있는지 확인하는 함수
  Utils.isBetween = function (value, min, max) {
    return (value - min) * (value - max) < 0;
  };

  // Generates a random number between min and max
  // `min`과 `max` 사이의 임의의 숫자를 생성하는 함수
  Utils.random = function (min, max) {
    return min + Math.random() * (max - min);
  };

  // Calculates the distance between two points
  // 두 점(`p1`, `p2`) 사이의 거리를 계산하는 함수
  Utils.getDistance = function (p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  // Performs linear interpolation between two values
  // 두 값(`value1`, `value2`) 사이의 선형 보간을 수행하는 함수
  Utils.lerp = function (value1, value2, amount) {
    return value1 + (value2 - value1) * amount;
  };

  // Checks if a point is inside a square
  // 특정 점(`x`, `y`)이 정사각형(`square`) 내부에 있는지 확인하는 함수
  Utils.isPointInSquare = function (x, y, square) {
    return (
      Utils.isBetween(x, square.pos.x, square.pos.x + square.size) &&
      Utils.isBetween(y, square.pos.y, square.pos.y + square.size)
    );
  };

  // Splits an array into multiple rows based on the specified width
  // 주어진 배열(`array`)을 지정된 크기(`width`)만큼의 행으로 나누는 함수
  Utils.splitArray = function (array, width) {
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
        x: 0.65,
        y: 0,
      };
      this.friction = 0.95;
      this.force = {
        x: 0,
        y: 0.09,
      };
      this.hitFloor = 0;
      this.isDead = false;
      this.sprite = new Sprite(this.world, this, sprite);
      this.sprite.selectLine = 1;
    }

    // Integrates physics and updates the position and velocity
    // 물리 계산을 통합하고 위치와 속도를 업데이트하는 함수
    update() {
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

      // Check for collision with spikes
      let targetX = this.position.x + this.size / 2 + this.velocity.x;
      let targetY = this.position.y + this.size / 2 + this.velocity.y;
      if (this.world.getKeyInfo(targetX, targetY).action) {
        if (
          !this.isDead &&
          this.world.getKeyInfo(targetX, targetY).action === "death"
        ) {
          this.world.sounds.defeat.url.play();
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
          this.world.sounds.bonus.url.play();
          this.world.score += 5;
          this.world.spawnBonus = true;
        }
      }

      // Check for collision with walls
      if (this.position.x < 32) {
        this.position.x = 32;
        this.velocity.x *= -1;
        if (!this.isDead) {
          this.world.sounds.bonus.url.play();
          this.world.score += 1;
          this.world.leftSpikes();
          this.sprite.selectLine = 1;
        }
      }
      if (this.position.x > this.limit.x - 32 - this.size) {
        this.position.x = this.limit.x - 32 - this.size;
        this.velocity.x *= -1;
        if (!this.isDead) {
          this.world.sounds.bonus.url.play();
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
          this.world.changePhase("menu");
        }
      }
      if (this.position.y < 24) {
        this.velocity.y = 0;
        this.position.y = 24;
      }

      // Controls
      if (!this.isDead) {
        if (this.world.keys[32] && !this.isPressed) {
          this.world.sounds.jump.url.play();
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
        if (!this.world.keys[32]) {
          this.isPressed = false;
        }
      }
    }

    // Renders the sprite
    // 스프라이트를 렌더링하는 함수
    draw() {
      this.sprite.render();
    }

    // Calls the draw and update methods
    // 렌더링과 업데이트 메서드를 호출하는 함수
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
      this.width = Math.round(this.sprite.img.width / this.sprite.sep);
      this.height = this.sprite.img.height / this.sprite.line;
      this.position = parent.position;
      this.length = this.sprite.sep;
      this.frame = 0;
      this.size = world.size;
      this.selectLine = 0;
      this.animation = true;
      this.speed = 0.2;
    }

    // Draws the sprite image on the canvas
    // 캔버스에 스프라이트 이미지를 그리는 함수
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

    // Updates the animation frame
    // 애니메이션 프레임을 업데이트하는 함수
    animate() {
      if (this.animation) {
        this.frame += this.speed;
        if (this.frame >= this.length) {
          this.frame = 0;
        }
      }
    }

    // Calls the animate and draw methods
    // 애니메이션과 드로우 메서드를 호출하는 함수
    render() {
      this.animate();
      this.draw();
    }
  }

  class Effect {
    constructor(world, x, y, sprite, line, speed) {
      this.world = world;
      this.ctx = world.ctx;
      this.sprite = sprite;
      this.size = world.size;
      this.width = Math.round(this.sprite.img.width / this.sprite.sep);
      this.height = this.sprite.img.height / this.sprite.line;
      this.position = {
        x: x,
        y: y,
      };
      this.length = this.sprite.sep;
      this.frame = 0;
      this.size = world.size;
      this.selectLine = line || 0;
      this.animation = true;
      this.speed = speed || 0.4;
    }

    // Renders the effect on the canvas
    // 캔버스에 효과를 렌더링하는 함수
    render() {
      if (this.animation) {
        this.frame += this.speed;
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
      this.keys = []; // Array to store the pressed keys
      this.zoom = parameters.zoom || 2; // Zoom level for the game world, default is 2
      this.fullscreen = false; // Flag for fullscreen mode (false by default)
      this.background = "black"; // Background color of the game world
      this.state = "menu"; // Initial state of the game (starts with the menu)

      // Levels
      this.bestScore = 0; // Stores the best score achieved
      this.score = 0; // Stores the current score
      this.levels = levels; // Array of levels for the game
      this.currentLevel = 0; // The current level being played

      // Resources (images, sounds, etc.)
      this.properties = {
        count: 0, // Count of loaded resources
        totalResources:
          parameters.stockImages.length + parameters.stockSounds.length, // Total number of resources (images + sounds)
      };
      this.resources = {}; // Object to store the resources (images, sounds, etc.)

      // Loading + Initialization
      this.createContext(); // Creates the game canvas context
      if (this.properties !== 0) {
        this.processResources(
          parameters.stockImages, // Image resources
          parameters.stockSounds, // Sound resources
          parameters.keys // Game keys (sprites and their parameters)
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

      // 캔버스를 문서의 body에 추가합니다.
      document.body.appendChild(this.canvas); // 캔버스를 화면에 추가합니다.

      // 캔버스를 생성한 후, 로깅을 출력합니다.
      console.log(
        "padding:2px; border-left:2px solid green; background: lightgreen; color: #000"
      );

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

        // 게임 상태에 따라 게임의 진행을 시작합니다.
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

    processImages(stockImages, stockSounds, keys) {
      // 이미지 리소스를 처리합니다.
      let imageResources = {};
      for (let i = 0; i < stockImages.length; i++) {
        let subject = stockImages[i];
        let name = subject.name;
        subject.img = this.loadImage(stockImages[i].img); // 이미지를 로드합니다.
        imageResources[name] = stockImages[i]; // 리소스를 객체에 저장합니다.
      }
      this.resources = imageResources; // 이미지 리소스를 객체에 할당합니다.

      // 사운드 리소스를 처리합니다.
      let soundResources = {};
      for (let i = 0; i < stockSounds.length; i++) {
        let subject = stockSounds[i];
        let name = subject.name;
        subject.url = this.loadSound(stockSounds[i].url); // 사운드를 로드합니다.
        subject.url.volume = 0.1; // 사운드 볼륨을 설정합니다.
        soundResources[name] = stockSounds[i]; // 리소스를 객체에 저장합니다.
      }
      this.sounds = soundResources; // 사운드 리소스를 객체에 할당합니다.

      if (keys) {
        // 키를 처리합니다.
        this.cleanKeys = new Array(keys.length).fill(false); // 모든 키를 비활성화 상태로 설정합니다.
        let keyMap = {};
        for (let i = 0; i < keys.length; i++) {
          let subject = keys[i];
          let name = subject.id;
          if (subject.type === "sprite") {
            // 스프라이트 유형의 키 처리
            subject.frame = 0; // 초기 프레임 설정
            subject.sprite = this.resources[subject.appearance]; // 스프라이트 이미지를 리소스에서 로드합니다.
            subject.loopMemory = false; // 반복 상태를 초기화합니다.
            subject.canAnimate = true; // 애니메이션 가능 상태로 설정합니다.
            subject.loop = true; // 애니메이션 반복 설정
          }
          keyMap[name] = keys[i]; // 키 정보를 객체에 저장합니다.
        }
        this.keys = keyMap; // 최종적으로 키 리소스를 할당합니다.
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
            this.changePhase("start");
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
          if (this.keys[id].name === search) {
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
        return this.keys[this.terrain.geometry[newY][newX]];
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

      // terrain의 appearance 배열을 분할하여 적용합니다.
      this.terrain.appearance = Utl.split(
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
          if (this.keys[id].appearance === "auto") {
            var sourceX = Math.floor(this.terrain.appearance[j][i]) * this.size;
            var sourceY = Math.floor(this.terrain.appearance[j][i]) * this.size;

            // 이미지를 그립니다.
            this.ctx.drawImage(
              this.resources.sheet.img,
              sourceX,
              this.keys[id].line * this.size,
              this.size,
              this.size,
              i * this.size,
              j * this.size,
              this.size,
              this.size
            );
          }
          // type이 "sprite"일 경우 애니메이션을 처리
          else if (this.keys[id].type === "sprite") {
            if (!this.keys[id].memoryLoop) {
              if (this.keys[id].canAnimate) {
                // 애니메이션 속도에 따라 프레임을 증가
                this.keys[id].frame += this.keys[id].speed;
              }

              // 프레임이 특정 값을 넘으면 초기화
              if (this.keys[id].frame >= this.keys[id].sprite.sep) {
                if (!this.keys[id].loop) {
                  this.keys[id].canAnimate = false;
                }
                this.keys[id].frame = 0;
              }

              // 애니메이션이 진행 중임을 메모리에 저장
              this.keys[id].memoryLoop = true;

              // 이미 지나간 ID는 처리하지 않음
              this.clear[id] = true;
            }

            // 스프라이트 이미지를 그립니다.
            this.ctx.drawImage(
              this.keys[id].sprite.img,
              Math.floor(this.keys[id].frame) * this.size,
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
            var sourceX = Math.floor(this.keys[id].appearance % 16) * this.size;
            var sourceY = Math.floor(this.keys[id].appearance / 16) * this.size;

            // 이미지를 그립니다.
            this.ctx.drawImage(
              this.resources.sheet.img,
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
      for (var i = 0; i < this.clear.length; i++) {
        if (this.clear[i]) {
          this.keys[i].memoryLoop = false;
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
      // 4개의 랜덤한 y값을 생성하여 반환
      let draw = [];
      while (draw.length < 3) {
        let randomNumber = Math.round(Utl.random(4, 12));
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

      // bonus 아이템을 배치
      if (this.spawnBonus) {
        this.spawnBonus = false;
        let bonusPosition = Math.round(Utl.random(4, 12));

        // bonus 효과 추가
        this.effects.push(
          new Effect(
            this,
            10 * this.size + 2,
            bonusPosition * this.size,
            this.resources.effects,
            0
          )
        );

        // bonus를 terrain에 설정
        this.terrain.geometry[bonusPosition][10] = 7;
      }
    }
    rightSpikes() {
      // 오른쪽 칸을 2로 채운 후 오른쪽에 랜덤한 spike를 배치
      for (var i = 0; i < 9; i++) {
        this.terrain.geometry[4 + i][11] = 2;
      }
      // 랜덤으로 spike를 배치
      let distribute = this.randomSpikes();
      for (var i = 0; i < distribute.length; i++) {
        this.terrain.geometry[distribute[i]][4] = 5;
      }

      // bonus가 이미 없다면 bonus 추가
      if (this.spawnBonus) {
        this.spawnBonus = false;
        let bonusPosition = Math.round(Utl.random(4, 12));
        // 효과를 추가합니다
        this.effects.push(
          new Effect(
            this,
            5 * this.size + 2,
            bonusPosition * this.size,
            this.resources.effects,
            0
          )
        );
        // terrain에 bonus 설정
        this.terrain.geometry[bonusPosition][5] = 7;
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
      this.continu = true;
      // 새 객체 생성
      this.bird = new Entity(this, this.L / 2, this.H / 2, this.resources.bird);
      this.loop();
    }

    render() {
      // 기본 배경과 화면 요소 렌더링
      this.ctx.fillStyle = this.pattern;
      this.ctx.fillRect(32, 24, 64, 88);

      this.renderTerrain();
      this.write(this.score.toString(), this.L / 2, 4);
      this.bird.render();
      for (var i = this.effects.length - 1; i >= 0; i--) {
        this.effects[i].render();
      }
    }

    loop() {
      // 애니메이션 루프
      this.ctx.fillStyle = this.background;
      this.ctx.fillRect(0, 0, this.L, this.H);
      this.render();
      // 애니메이션을 계속 반복
      if (this.continu) {
        this.animation = requestAnimationFrame(() => this.loop());
      }
    }

    phase(phase) {
      // 게임 상태 설정 및 메뉴 렌더링
      this.state = phase;
      this.continu = false;
      cancelAnimationFrame(this.animation);
      this.ctx.fillStyle = this.background;
      this.ctx.fillRect(0, 0, this.L, this.H);
      switch (phase) {
        case "menu":
          // 최고 점수 갱신
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
          this.ctx.fillRect(0, 0, this.L, this.H);
          this.ctx.globalAlpha = 1;
          this.write("Best Score : " + this.bestScore, this.L / 2, 4);
          this.write("[spacebar] to jump", this.L / 2, this.H / 2);
          break;
        case "start":
          // 게임 시작
          this.initialize();
          break;
        default:
          console.log("Unrecognized action");
      }
    }
  }

  // 게임 설정을 담고 있는 객체
  let parameters = {
    // 타일 크기 및 줌 설정
    tileSize: 8,
    zoomFactor: 4,

    // 사운드 파일 설정
    soundAssets: [
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

    // 이미지 파일 설정
    imageAssets: [
      { img: "https://image.ibb.co/by5TQQ/font.png", name: "pixelFont" }, // 폰트 이미지
      {
        img: "https://image.ibb.co/kiYF5Q/oiseau.png",
        name: "bird", // 새 이미지
        spriteCount: 6, // 스프라이트 수
        row: 4, // 스프라이트 시트의 행
        animationSpeed: 0.6, // 애니메이션 속도
      },
      {
        img: "https://image.ibb.co/mvORC5/effets.png",
        name: "effects", // 효과 이미지
        spriteCount: 7,
        row: 3,
        animationSpeed: 0.6,
      },
      { img: "https://image.ibb.co/hCPoQQ/feuille.png", name: "leaf" }, // 나뭇잎 이미지
      {
        img: "https://image.ibb.co/dojBek/piece.png",
        name: "coin",
        spriteCount: 6,
      }, // 동전 이미지
      { img: "https://image.ibb.co/gU7a5Q/motif.png", name: "pattern" }, // 배경 패턴 이미지
    ],

    // 타일 정의 (게임의 맵을 구성하는 요소들)
    tileDefinitions: [
      { type: "tile", name: "empty", id: 0, isCollidable: true }, // 빈 타일
      {
        type: "tile",
        name: "wall",
        id: 1,
        isCollidable: false,
        appearance: "auto", // 자동 배경
        row: 1,
      },
      {
        type: "tile",
        name: "background",
        id: 2,
        isCollidable: false,
        appearance: 0,
      }, // 배경 타일
      {
        type: "tile",
        name: "spikeTop",
        id: 3,
        isCollidable: false,
        appearance: 2,
        action: "death", // 이 타일을 밟으면 죽음
      },
      {
        type: "tile",
        name: "spikeBottom",
        id: 4,
        isCollidable: false,
        appearance: 3,
        action: "death", // 이 타일을 밟으면 죽음
      },
      {
        type: "tile",
        name: "spikeLeft",
        id: 5,
        isCollidable: false,
        appearance: 4,
        action: "death", // 이 타일을 밟으면 죽음
      },
      {
        type: "tile",
        name: "spikeRight",
        id: 6,
        isCollidable: false,
        appearance: 5,
        action: "death", // 이 타일을 밟으면 죽음
      },
      {
        type: "sprite",
        name: "next",
        id: 7,
        isCollidable: false,
        action: "bonus", // 보너스 아이템
        appearance: "coin",
        row: 1,
        animationSpeed: 0.2, // 애니메이션 속도
      },
    ],
  };

  // 게임 레벨 설정
  let levels = [
    {
      name: "lvl1", // 레벨 이름
      geometry: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 첫 번째 행 (빈 타일)
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 두 번째 행 (빈 타일)
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 세 번째 행 (벽 타일)
        [0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0], // 네 번째 행 (스파이크 타일)
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], // 다섯 번째 행 (길 타일)
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], // 여섯 번째 행 (길 타일)
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], // 일곱 번째 행 (길 타일)
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], // 여덟 번째 행 (길 타일)
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], // 아홉 번째 행 (길 타일)
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], // 열 번째 행 (길 타일)
        [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], // 열한 번째 행 (길 타일)
        [0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0], // 열두 번째 행 (보너스 타일)
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 열세 번째 행 (벽 타일)
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 열네 번째 행 (빈 타일)
      ],
    },
  ];

  // 월드 객체 생성 (게임 설정 및 레벨을 인자로 전달)
  new World(parameters, levels);
};
