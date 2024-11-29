"use client"; // 클라이언트 컴포넌트임을 명시

import { useState } from "react";
import Confetti from "react-confetti";

const LuckyDraw = () => {
  const initialProducts = [
    { name: "16인치 포터블 모니터 ( 터치 )" },
    { name: "현금 5만원 ( 황상문 수석님 감사합니다 !!!! )" },
    { name: "스트림 덱" },
    { name: "온열 고양이 베개 - 깜이" },
    { name: "온열 고양이 베개 - 자몽" },
    { name: "난방 가습기" },
    { name: "라벨 프린터" },
    { name: "2025 달력 (호그와트)" },
    { name: "키보드 청소도구 세트" },
    { name: "무선 충전식 에어건" },
    { name: "크리스탈 장미" },
    { name: "균형잡기 게임" },
    { name: "보드게임 종합세트 (중문)" },
    { name: "테이블 축구" },
    { name: "손가락 마우스" },
    { name: "데스노트" },
    { name: "트럼프 카드" },
    { name: "미니 트럼프 카드" },
    { name: "캐치볼 세트" },
    { name: "캐치볼 세트" },
    { name: "벽에 붙이는 고리" },
    { name: "벽에 붙이는 고리" },
    { name: "장난감 총" },
    { name: "장난감 총" },
    { name: "슬롯머신" },
    { name: "슬롯머신" },
    { name: "자석 보관함" },
    { name: "자석 보관함" },
    { name: "c to c 케이블 1개" },
    { name: "c to c 케이블 1개" },
    { name: "c to c 케이블 2개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 2개" },
    { name: "키링 2개" },
    { name: "키링 3개" },
    { name: "핀뱃지 1개" },
    { name: "핀뱃지 1개" },
    { name: "핀뱃지 1개" },
    { name: "핀뱃지 1개" },
    { name: "핀뱃지 1개" },
    { name: "핀뱃지 2개" },
    { name: "핀뱃지 2개" },
    { name: "핀뱃지 2개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 4개" },
    { name: "핀뱃지 4개" },
    { name: "핀뱃지 5개" },
    { name: "미니 농구 게임 1개" },
    { name: "미니 농구 게임 1개" },
    { name: "미니 농구 게임 1개" },
    { name: "미니 농구 게임 2개" },
    { name: "미니 농구 게임 2개" },
    { name: "반짝반짝 거북이 1개" },
    { name: "반짝반짝 거북이 1개" },
    { name: "반짝반짝 거북이 1개" },
    { name: "반짝반짝 거북이 2개" },
    { name: "반짝반짝 거북이 2개" },
    { name: "반짝반짝 거북이 3개" },
    { name: "변신하는 공룡알 1개" },
    { name: "변신하는 공룡알 1개" },
    { name: "변신하는 공룡알 1개" },
    { name: "변신하는 공룡알 1개" },
    { name: "변신하는 공룡알 2개" },
    { name: "변신하는 공룡알 2개" },
    { name: "가위바위보 머신 1개" },
    { name: "가위바위보 머신 1개" },
    { name: "가위바위보 머신 1개" },
    { name: "가위바위보 머신 2개" },
    { name: "가위바위보 머신 2개" },
  ];

  const [remainingProducts, setRemainingProducts] = useState(initialProducts);
  const [drawnGift, setDrawnGift] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const drawGift = () => {
    if (isButtonDisabled) return;

    setIsButtonDisabled(true); // 버튼 비활성화

    const randomIndex = Math.floor(Math.random() * remainingProducts.length);
    const selectedGift = remainingProducts[randomIndex];

    setDrawnGift(selectedGift);
    setConfetti(true);
    setAnimateText(true);
    setRemainingProducts(
      remainingProducts.filter((_, index) => index !== randomIndex)
    );

    setTimeout(() => setConfetti(false), 5000);
    setTimeout(() => setAnimateText(false), 3000);
    setTimeout(() => setIsButtonDisabled(false), 5000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>경품 뽑기권을 사용할까요?</h1>
      <button
        onClick={drawGift}
        className="button"
        type="button"
        style={{
          ...styles.button,
          ...(isButtonDisabled ? styles.buttonDisabled : {}),
        }}
        disabled={isButtonDisabled}>
        경품 뽑기
      </button>

      {confetti && <Confetti style={styles.confetti} />}

      <div
        style={{
          ...styles.result,
          ...(animateText ? styles.animateText : {}),
        }}>
        <h3>= 추첨 결과 =</h3>
        <h2>{drawnGift?.name}</h2>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    paddingTop: "30dvh",
    textAlign: "center",
    overflow: "hidden",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#ccc",
  },
  result: {
    fontSize: "2rem",
    marginTop: "30px",
    opacity: 0,
    transform: "scale(0.2)",
    transition: "transform 1.5s, opacity 1.5s",
    transitionDelay: "1s",
  },
  animateText: {
    opacity: 1,
    transform: "scale(1)",
  },
  confetti: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  button: {
    padding: "1em 2em",
    fontSize: "1.25rem",
    backgroundColor: "#cd3f64",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    color: "#888",
    cursor: "not-allowed",
  },
};

export default LuckyDraw;
