"use client";

import { useEffect, useRef, useState } from "react";

export default function Santa() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const santaRef = useRef({ x: 125, y: 50, speed: 2 }); // 산타 초기 속도
  const playerRef = useRef({ x: 125, y: 450, speed: 0, targetSpeed: 0 }); // 플레이어 초기 속도
  const snowflakesRef = useRef<{ x: number; y: number }[]>([]); // 눈송이
  const giftsRef = useRef<{ x: number; y: number }[]>([]); // 선물
  const rocksRef = useRef<{ x: number; y: number }[]>([]); // 돌멩이
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = 350; // 캔버스 가로 크기
    canvas.height = 550; // 캔버스 세로 크기 (하단에 50px 추가)

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
      const touchX = e.touches[0].clientX;
      if (touchX > canvas.width / 2) {
        playerRef.current.targetSpeed = playerSpeed; // 우측으로 이동
      } else {
        playerRef.current.targetSpeed = -playerSpeed; // 좌측으로 이동
      }
    };

    const handleTouchEnd = () => {
      playerRef.current.targetSpeed = 0; // 터치가 끝나면 이동 멈춤
    };

    // 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    let animationFrameId: number;
    const update = () => {
      if (isGameOver) {
        cancelAnimationFrame(animationFrameId);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw game border (흰색)
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      if (santaRef.current.x <= 0 || santaRef.current.x >= canvas.width - 50) {
        santaRef.current.speed = -santaRef.current.speed; // 방향 반전
      }

      santaRef.current.x += santaRef.current.speed; // 일정한 속도로 이동

      // Draw Santa
      ctx.fillStyle = "red";
      ctx.fillRect(santaRef.current.x, santaRef.current.y, 50, 30);

      // 부드러운 속도 전환 (기존 속도에서 목표 속도로 변화)
      if (playerRef.current.speed < playerRef.current.targetSpeed) {
        playerRef.current.speed += acceleration;
        if (playerRef.current.speed > playerRef.current.targetSpeed)
          playerRef.current.speed = playerRef.current.targetSpeed;
      } else if (playerRef.current.speed > playerRef.current.targetSpeed) {
        playerRef.current.speed -= acceleration;
        if (playerRef.current.speed < playerRef.current.targetSpeed)
          playerRef.current.speed = playerRef.current.targetSpeed;
      }

      // 플레이어 위치 업데이트 (speed에 따라 이동)
      playerRef.current.x += playerRef.current.speed;
      // 화면 밖으로 나가지 않도록 제한
      if (playerRef.current.x < 0) playerRef.current.x = 0;
      if (playerRef.current.x > canvas.width - 50)
        playerRef.current.x = canvas.width - 50;

      // Draw Player
      ctx.fillStyle = "blue";
      ctx.fillRect(playerRef.current.x, playerRef.current.y, 60, 20);

      // Generate items
      if (Math.random() < 0.08) {
        const type =
          Math.random() < 0.4 ? "snow" : Math.random() < 0.45 ? "gift" : "rock";
        const xPosition = 5 + Math.random() * (canvas.width - 10); // 랜덤 x 위치
        if (type === "snow") {
          snowflakesRef.current.push({ x: xPosition, y: 0 });
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

      // Move and draw items
      snowflakesRef.current = snowflakesRef.current.filter((snowflake) => {
        snowflake.y += 3; // Speed of falling snowflakes
        if (snowflake.y > canvas.height) return false;

        // Draw snowflake
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(snowflake.x, snowflake.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Collision detection with player
        if (
          snowflake.y > playerRef.current.y &&
          snowflake.y < playerRef.current.y + 30 &&
          snowflake.x > playerRef.current.x &&
          snowflake.x < playerRef.current.x + 50
        ) {
          setScore((prev) => prev + 1);
          return false; // Remove collided snowflake
        }

        return true;
      });

      giftsRef.current = giftsRef.current.filter((gift) => {
        gift.y += 4; // Speed of falling gifts
        if (gift.y > canvas.height) return false;

        // Draw gift
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(gift.x, gift.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Collision detection with player
        if (
          gift.y > playerRef.current.y &&
          gift.y < playerRef.current.y + 30 &&
          gift.x > playerRef.current.x &&
          gift.x < playerRef.current.x + 50
        ) {
          setScore((prev) => prev + 3); // 선물 점수
          return false; // Remove collided gift
        }

        return true;
      });

      rocksRef.current = rocksRef.current.filter((rock) => {
        rock.y += 5; // Speed of falling rocks
        if (rock.y > canvas.height) return false;

        // Draw rock
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.arc(rock.x, rock.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Collision detection with player
        if (
          rock.y > playerRef.current.y &&
          rock.y < playerRef.current.y + 30 &&
          rock.x > playerRef.current.x &&
          rock.x < playerRef.current.x + 50
        ) {
          setIsGameOver(true);
          return false; // Remove collided rock and stop the game
        }

        return true;
      });

      // Draw score at the bottom center (흰색)
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(
        `Score: ${score}`,
        canvas.width / 2 - 50,
        canvas.height - 20
      );

      animationFrameId = requestAnimationFrame(update);
    };
    update();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [score, isGameOver]);
  const resetGame = () => {
    setScore(0);
    setIsGameOver(false);
    santaRef.current.x = 125;
    santaRef.current.speed = 2;
    playerRef.current.x = 125;
    playerRef.current.speed = 0;
    playerRef.current.targetSpeed = 0;
    snowflakesRef.current = [];
    giftsRef.current = [];
    rocksRef.current = [];
  };
  return (
    <div className="game-container">
      {isGameOver ? (
        <div
          style={{
            height: "calc(100vh - 80px)",
            marginTop: "80px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}>
          <h1>Game Over</h1>
          <p>Score: {score}</p>
          <button onClick={() => resetGame()} style={{ padding: "4px 24px" }}>
            Restart
          </button>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          style={{ display: "block", margin: "50px auto 0" }}
        />
      )}
    </div>
  );
}
