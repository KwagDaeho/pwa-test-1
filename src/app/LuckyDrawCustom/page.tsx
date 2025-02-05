"use client"; // 클라이언트 컴포넌트임을 명시

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import styles from "./LuckyDrawCustom.module.css"; // CSS 모듈 불러오기
import { util } from "@/util/game";

export default function LuckyDrawCustom() {
  const [drawnGift, setDrawnGift] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 초기값을 true로 설정
  const [winnerName, setWinnerName] = useState(""); // 이름 입력용 state
  const [winners, setWinners] = useState([]); // 당첨자 목록 state
  const [showSlotMachine, setShowSlotMachine] = useState(true);
  const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 추가
  const [shuffledProducts, setShuffledProducts] = useState<string[]>([]);
  const [prizeInput, setPrizeInput] = useState(""); // 입력 필드 초기값 설정
  const [prizes, setPrizes] = useState<string[]>(["당첨 내용을 입력해주세요."]); // 초기값 설정
  const [showModal, setShowModal] = useState(false); // 모달 상태 관리
  const [isReady, setIsReady] = useState(false); // 준비 완료 상태 추가
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태 추가
  const [showDrawButton, setShowDrawButton] = useState(false); // 추첨 버튼 표시 상태 추가
  // 페이지 렌더링 시 슬롯머신에 기본 상품 노출
  useEffect(() => {
    setShuffledProducts(Array(50).fill("당첨 내용을 입력해주세요.")); // 슬롯머신에 기본값 노출
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const getPrizeButton = window.document.getElementById("button_get_prize");
        if (getPrizeButton) {
          getPrizeButton.click();
        } else {
          window.document.getElementById("button_add_prize").click();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // prizes가 업데이트될 때마다 shuffledProducts를 업데이트
  useEffect(() => {
    if (prizes.length === 0) {
      setShuffledProducts(Array(50).fill("모든 추첨이 끝났습니다.")); // 슬롯머신에 기본값 노출
    } else {
      setShuffledProducts(getSlotMachineProducts());
      setIsButtonDisabled(prizes[0] === "당첨 내용을 입력해주세요.");
    }
  }, [prizes]);
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = util.randomIndex(i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const getSlotMachineProducts = () => {
    const randomProducts = shuffleArray(prizes);
    return Array(50)
      .fill(null)
      .map(() => randomProducts[util.randomIndex(randomProducts.length)]); // 랜덤으로 섞인 상품을 50개 생성
  };

  const drawGift = () => {
    if (isButtonDisabled || !winnerName.trim() || prizes.length === 0) return;

    setIsButtonDisabled(true);
    setShowSlotMachine(false);

    // 랜덤으로 당첨 목록에서 선택
    const selectedGift = prizes[util.randomIndex(prizes.length)];

    // 폭죽을 더 일찍 시작 (슬롯머신이 거의 다 사라질 무렵)
    setConfetti(true);

    // 결과는 기존 타이밍 유지
    setTimeout(() => {
      setDrawnGift(selectedGift);
      setAnimateText(true);

      setTimeout(() => {
        setWinners((prev) => [
          ...prev, // 기존 항목들을 앞에 유지
          {
            // 새로운 항목을 맨 뒤에 추가
            name: winnerName,
            gift: selectedGift,
          },
        ]);
        // 당첨된 상품 제거
        setPrizes((prev) => {
          const newPrizes = prev.filter((prize) => prize !== selectedGift);
          return newPrizes;
        });
      }, 3800);

      setTimeout(() => {
        setAnimateText(false);
        setTimeout(() => {
          setAnimationKey((prev) => prev + 1);
          setShowSlotMachine(true);
          setWinnerName("");
          if (prizes.length !== 1) setIsButtonDisabled(false);
        }, 500);
      }, 4000);

      setTimeout(() => setConfetti(false), 5000);
    }, 1500);
  };

  const addPrize = () => {
    if (prizeInput.trim()) {
      setPrizes((prev) => {
        const updatedPrizes = [...prev, prizeInput];
        // "당첨 내용을 입력해주세요."가 있을 경우 제거
        return updatedPrizes.filter((prize) => prize !== "당첨 내용을 입력해주세요.");
      });
      setPrizeInput(""); // 입력 필드 초기화
      setIsButtonDisabled(false); // 당첨내역이 추가되면 버튼 활성화
    }
  };

  const handleReady = () => {
    // 당첨내역이 없으면 버튼 비활성화
    if (prizes.length === 0) return;

    setIsAnimating(true); // 애니메이션 시작
    setTimeout(() => {
      setIsReady(true); // 준비 완료 상태로 변경
      setIsAnimating(false); // 애니메이션 종료
      setShowDrawButton(true); // 추첨 버튼 표시
    }, 800); // 애니메이션 지속 시간과 일치
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>추첨하기!!</h1>

      {!isReady && (
        <div className={styles.buttonContainer}>
          <input
            type="text"
            value={prizeInput}
            onChange={(e) => setPrizeInput(e.target.value)}
            placeholder="당첨 내용을 입력하세요"
            className={styles.nameInput}
          />

          <button
            id="button_add_prize"
            onClick={addPrize}
            className={`${styles.button} ${isAnimating ? styles.fadeOut : ""}`}
            style={{ animationDelay: isAnimating ? "0s" : "0s" }} // 첫 번째 버튼
            type="button">
            당첨내역 추가
          </button>

          <button
            onClick={() => setShowModal(true)}
            className={`${styles.button} ${isAnimating ? styles.fadeOut : ""}`}
            style={{ animationDelay: isAnimating ? "0.1s" : "0s" }} // 두 번째 버튼
            type="button">
            당첨내역 확인
          </button>

          <button
            onClick={handleReady}
            className={`${styles.button} ${isAnimating ? styles.fadeOut : ""} ${
              isButtonDisabled ? styles.isButtonDisabled : ""
            }`}
            style={{ animationDelay: isAnimating ? "0.2s" : "0s" }} // 세 번째 버튼
            type="button"
            disabled={isButtonDisabled}>
            준비 완료
          </button>
        </div>
      )}

      {isReady && (
        <div className={styles.buttonContainer}>
          <input
            type="text"
            value={winnerName}
            onChange={(e) => setWinnerName(e.target.value)}
            placeholder="이름을 입력하세요"
            className={styles.nameInput}
          />

          {showDrawButton && ( // showDrawButton이 true일 때만 추첨 버튼 표시
            <button
              id="button_get_prize"
              onClick={drawGift}
              className={`${styles.button} ${styles.fadeIn} ${isButtonDisabled ? styles.isButtonDisabled : ""}`}
              type="button"
              disabled={isButtonDisabled}>
              추첨
            </button>
          )}
        </div>
      )}

      {/* 모달창 */}
      {showModal && (
        <div className={styles.modal}>
          <h2>당첨목록</h2>
          <ul>
            {prizes.map((prize, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {prize}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowModal(false)}>닫기</button>
        </div>
      )}

      {/* 슬롯머신 */}
      <div className={`${styles.slotMachine} ${showSlotMachine ? styles.show : styles.hide}`}>
        <div key={animationKey} className={styles.scrollingList}>
          {shuffledProducts.map((product, index) => (
            <div key={index} className={styles.productItem}>
              {product}
            </div>
          ))}
        </div>
      </div>

      {/* 결과 화면 */}
      <div className={`${styles.result} ${animateText ? styles.animateText : ""}`}>
        <h3>추첨 결과</h3>
        <h2>{drawnGift}</h2>
      </div>

      {confetti && <Confetti className={styles.confetti} />}

      <div className={styles.history}>
        <h2>당첨 내역</h2>
        <ul className={styles.winnersList}>
          {winners.map((winner, index) => (
            <li key={index}>
              {winner.name} - {winner.gift}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
