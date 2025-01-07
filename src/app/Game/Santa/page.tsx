"use client";

import useGameDashboard from "@/hooks/useGameDashboard";
import { util } from "@/util/game";
import { useEffect, useRef, useState } from "react";

export default function Santa() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const santaRef = useRef({ x: 150, y: 50, speed: 5 }); // 산타 초기 속도
  const playerRef = useRef({ x: 150, y: 500, speed: 0, targetSpeed: 0 }); // 플레이어 초기 속도
  const snowflakesRef = useRef<{ x: number; y: number }[]>([]); // 눈송이
  const goldenSnowflakesRef = useRef<{ x: number; y: number }[]>([]); // 눈송이
  const giftsRef = useRef<{ x: number; y: number }[]>([]); // 선물
  const rocksRef = useRef<{ x: number; y: number }[]>([]); // 돌멩이
  const giantGiftsRef = useRef<{ x: number; y: number }[]>([]); // 거대 선물

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30); // 타이머 상태
  const { loading, addGameData } = useGameDashboard();
  useEffect(() => {
    // 1초마다 타이머 감소
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // 30초 뒤에 게임 오버 처리
    if (timeLeft <= 0) {
      setIsGameOver(true);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (isGameOver && timeLeft != 30 && score > 0) {
      addGameData("1534c734f1b58051ba80fa960ba2a0be", score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = 350; // 캔버스 가로 크기
    canvas.height = 600; // 캔버스 세로 크기 (하단에 50px 추가)

    // 이미지 리소스
    const snowflakeImage = new Image();
    snowflakeImage.src = "/image/snow.png"; // 눈송이 이미지 주소 입력
    const goldenSnowflakeImage = new Image();
    goldenSnowflakeImage.src = "/image/golden-snow.png"; // 눈송이 이미지 주소 입력
    const giftImage = new Image();
    giftImage.src = "/image/gift.png"; // 선물 이미지 주소 입력
    const rockImage = new Image();
    rockImage.src = "/image/stone.png"; // 돌멩이 이미지 주소 입력
    const santaImage = new Image();
    santaImage.src = "/image/santa.png"; // 산타 이미지 주소 입력
    const playerImage = new Image();
    playerImage.src = "/image/cat.png"; // 플레이어 이미지 주소 입력

    // 플레이어 이동을 위한 기본 속도
    const playerSpeed = 8;
    const acceleration = 0.8; // 속도 변화의 완충 정도

    // 키 입력 처리 함수
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a")
        playerRef.current.targetSpeed = -playerSpeed;
      if (e.key === "ArrowRight" || e.key === "d")
        playerRef.current.targetSpeed = playerSpeed;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "a" ||
        e.key === "ArrowRight" ||
        e.key === "d"
      ) {
        playerRef.current.targetSpeed = 0; // 키 떼면 속도 0으로 설정
      }
    };

    // 터치 이벤트 처리 함수 (모바일에서 터치시)
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touchX = e.touches[0].clientX;
      if (touchX > canvas.width / 2) {
        playerRef.current.targetSpeed = playerSpeed; // 우측으로 이동
      } else {
        playerRef.current.targetSpeed = -playerSpeed; // 좌측으로 이동
      }
    };
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    const handleTouchEnd = () => {
      playerRef.current.targetSpeed = 0; // 터치가 끝나면 이동 멈춤
    };

    // 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    let animationFrameId: number;
    let lastTime = 0;
    const update = (timestamp) => {
      if (santaRef.current.x < -5 || santaRef.current.x > 305) {
        santaRef.current.x = util.randomFloor(50, 250);
      }
      const deltaTime = (timestamp - lastTime) / 20; // 초 단위로 변환
      lastTime = timestamp;
      if (isGameOver) {
        cancelAnimationFrame(animationFrameId);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const backgroundImage = new Image();
      backgroundImage.src = "/image/bg-snow2.jpg"; // 다운로드한 배경 이미지 경로
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Draw game border (흰색)
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      if (santaRef.current.x <= 10 || santaRef.current.x >= canvas.width - 70) {
        santaRef.current.speed = -santaRef.current.speed; // 방향 반전
      }
      santaRef.current.x += santaRef.current.speed * deltaTime; // 일정한 속도로 이동

      // Draw Santa (정사각형 이미지 사용)
      ctx.drawImage(santaImage, santaRef.current.x, santaRef.current.y, 50, 50);

      // 부드러운 속도 전환 (기존 속도에서 목표 속도로 변화)
      if (playerRef.current.speed < playerRef.current.targetSpeed) {
        playerRef.current.speed += acceleration * deltaTime;
        if (playerRef.current.speed > playerRef.current.targetSpeed)
          playerRef.current.speed = playerRef.current.targetSpeed * deltaTime;
      } else if (playerRef.current.speed > playerRef.current.targetSpeed) {
        playerRef.current.speed -= acceleration * deltaTime;
        if (playerRef.current.speed < playerRef.current.targetSpeed)
          playerRef.current.speed = playerRef.current.targetSpeed * deltaTime;
      }

      // 플레이어 위치 업데이트 (speed에 따라 이동)
      playerRef.current.x += playerRef.current.speed * deltaTime;
      // 화면 밖으로 나가지 않도록 제한
      if (playerRef.current.x < 0) playerRef.current.x = 0;
      if (playerRef.current.x > canvas.width - 60)
        playerRef.current.x = canvas.width - 60;

      // Draw Player (정사각형 이미지 사용)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 3;
      ctx.strokeRect(
        playerRef.current.x + 10,
        playerRef.current.y + 10,
        42,
        36
      );
      ctx.drawImage(
        playerImage,
        playerRef.current.x,
        playerRef.current.y,
        60,
        60
      );
      const randomValue = util.random(0, 1);
      // Generate items
      if (randomValue < 0.3 * deltaTime) {
        const type =
          randomValue < 0.03
            ? "golden-snow" // 2.5%
            : randomValue < 0.05
            ? "giant-gift" // 2.5%
            : randomValue < 0.65
            ? "snow" // 60%
            : randomValue < 0.65 + 0.15
            ? "gift" // 15%
            : "rock"; // 20%
        const xPosition = util.random(5, 6) * (canvas.width - 10); // 랜덤 x 위치
        if (type === "snow") {
          snowflakesRef.current.push({ x: xPosition, y: 0 });
        } else if (type === "golden-snow") {
          goldenSnowflakesRef.current.push({ x: xPosition, y: 0 });
        } else if (type === "giant-gift") {
          giantGiftsRef.current.push({
            x: santaRef.current.x + 25,
            y: santaRef.current.y + 30,
          });
        } else if (type === "gift") {
          // 선물은 산타 아래에서 떨어지도록 수정
          giftsRef.current.push({
            x: santaRef.current.x + 25,
            y: santaRef.current.y + 30,
          });
        } else {
          rocksRef.current.push({ x: xPosition, y: 0 });
        }
      }

      // 아이템 처리 함수
      const handleFallingItems = (
        itemsRef,
        image,
        speed,
        size,
        collisionCallback
      ) => {
        itemsRef.current = itemsRef.current.filter((item) => {
          item.y += speed * deltaTime; // Falling speed
          if (item.y > canvas.height) return false; // Remove if out of canvas

          // Draw item
          if (size == "L") {
            ctx.drawImage(image, item.x - 30, item.y - 30, 60, 60);
          } else if (size == "S") {
            ctx.drawImage(image, item.x - 15, item.y - 15, 30, 30);
          }

          // Collision detection
          if (collisionCallback(item)) {
            return false; // Remove collided item
          }

          return true; // Keep item
        });
      };

      // 눈송이
      handleFallingItems(snowflakesRef, snowflakeImage, 3, "S", (snowflake) => {
        if (
          snowflake.y > playerRef.current.y &&
          snowflake.y < playerRef.current.y + 45 &&
          snowflake.x > playerRef.current.x - 30 &&
          snowflake.x < playerRef.current.x + 90
        ) {
          setScore((prev) => Math.floor(prev + util.randomFloor(1, 15)));
          return true; // Collision detected
        }
        return false; // No collision
      });

      // 황금 눈송이
      handleFallingItems(
        goldenSnowflakesRef,
        goldenSnowflakeImage,
        5,
        "L",
        (goldenSnowflake) => {
          if (
            goldenSnowflake.y > playerRef.current.y &&
            goldenSnowflake.y < playerRef.current.y + 45 &&
            goldenSnowflake.x > playerRef.current.x - 30 &&
            goldenSnowflake.x < playerRef.current.x + 90
          ) {
            setScore((prev) => prev + 400);
            return true; // Collision detected
          }
          return false; // No collision
        }
      );

      // 선물
      handleFallingItems(giftsRef, giftImage, 4, "S", (gift) => {
        if (
          gift.y > playerRef.current.y &&
          gift.y < playerRef.current.y + 45 &&
          gift.x > playerRef.current.x &&
          gift.x < playerRef.current.x + 60
        ) {
          setScore((prev) => prev + util.randomFloor(1, 100));
          return true; // Collision detected
        }
        return false; // No collision
      });

      // 거대 선물
      handleFallingItems(giantGiftsRef, giftImage, 5, "L", (giantGift) => {
        if (
          giantGift.y > playerRef.current.y &&
          giantGift.y < playerRef.current.y + 45 &&
          giantGift.x > playerRef.current.x - 30 &&
          giantGift.x < playerRef.current.x + 90
        ) {
          setScore((prev) => prev + util.randomFloor(200, 600));
          return true; // Collision detected
        }
        return false; // No collision
      });
      // 돌멩이
      handleFallingItems(rocksRef, rockImage, 6, "S", (rock) => {
        if (
          rock.y > playerRef.current.y &&
          rock.y < playerRef.current.y + 50 &&
          rock.x > playerRef.current.x + 5 &&
          rock.x < playerRef.current.x + 55
        ) {
          setIsGameOver(true); // Game Over when hit a rock
          return true; // Collision detected
        }
        return false; // No collision
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update(0); // Start the game loop

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("contextmenu", (e) => {
        e.preventDefault();
      });
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isGameOver]);
  const resetGame = () => {
    setIsGameOver(false);
    setTimeLeft(30);
    setScore(0);
    santaRef.current.x = 150;
    playerRef.current.x = 150;
    playerRef.current.targetSpeed = 0;
    playerRef.current.speed = 0;
    snowflakesRef.current = [];
    giftsRef.current = [];
    rocksRef.current = [];
  };
  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            paddingTop: "40vh",
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}>
          <p style={{ color: "#fff" }}>점수를 등록하��� 중....</p>
        </div>
      )}
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        }}>
        {isGameOver ? (
          <>
            <div
              style={{
                width: "100%",
                maxWidth: "350px",
                height: "100dvh",
                maxHeight: "600px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: "50px",
                fontSize: "24px",
                color: "#f09",
                backgroundImage: 'url("/image/bg-snow.jpg")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}>
              <div
                style={{
                  padding: "24px",
                  color: "#ccc",
                  textAlign: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}>
                <h3>패치노트</h3>
                <ul
                  style={{
                    listStyle: "inside",
                    fontSize: "18px",
                  }}>
                  <li>눈송이 : 1~15 pt</li>
                  <li>선물 : 1~99 pt</li>
                  <li>황금 거대 눈송이 : 400 pt</li>
                  <li>거대 선물 : 200~600 pt</li>
                  <li>황금 거대 눈송이가 더이상 x축으로 움직이지 않습니다.</li>
                  <li>황금 거대 눈송이 등장 확률이 2배 증가했습니다.</li>
                </ul>
              </div>
              <p>Touch : [Left/Right] side</p>
              <p>keyboard : [&larr;/&rarr;] or [a/d]</p>
              <button
                onClick={() => {
                  resetGame();
                }}
                style={{
                  marginTop: "36px",
                  padding: "10px",
                  fontSize: "20px",
                }}>
                Game Start
              </button>
            </div>
          </>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              style={{
                width: "350px",
                height: "600px",
                border: "2px solid white",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "calc(50% - 175px)",
                top: "calc(50% - 300px)",
                width: "350px",
                height: "60px",
                marginTop: "10px",
                padding: "3px 12px",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#121212",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "0 0 5px #fff",
              }}>
              <p>{score} pt</p>
              <p>{timeLeft} sec</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
