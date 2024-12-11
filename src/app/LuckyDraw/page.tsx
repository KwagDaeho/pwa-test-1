"use client"; // 클라이언트 컴포넌트임을 명시

import { useState } from "react";
import Confetti from "react-confetti";
import styles from "./LuckyDraw.module.css"; // CSS 모듈 불러오기

const LuckyDraw = () => {
  const initialProducts = [
    { name: "행 운 상 - 5만원" },
    { name: "16인치 포터블 모니터 ( 터치 )" },
    // { name: "16인치 포터블 모니터" },
    // { name: "스트림 덱" },
    { name: "스트림 덱" },
    { name: "스트림 덱" },
    { name: "온열 고양이 베개 - 자몽" },
    { name: "난방 가습기" },
    { name: "2025 달력 (호그와트)" },
    { name: "2025 달력 (호그와트)" },
    { name: "크리스탈 장미" },
    { name: "타지마할" },
    { name: "콜로세움" },
    { name: "균형잡기 게임" },
    { name: "손 마사지기" },
    { name: "요추베개" },
    { name: "보드게임 종합세트 (중문)" },
    { name: "테이블 축구" },
    { name: "손가락 마우스" },
    { name: "데스노트" },
    { name: "모래시계" },
    { name: "트럼프 카드" },
    { name: "아보카도 손난로" },
    { name: "펭귄 손난로" },
    { name: "펭귄 손난로" },
    { name: "공 던지기 게임 세트" },
    { name: "캐치볼 세트" },
    { name: "캐치볼 세트" },
    { name: "꼬꼬 가족 세트" },
    { name: "아기 오리 세트" },
    { name: "동글 고양이 세트" },
    { name: "눕눕 고양이 세트" },
    { name: "장난감 총" },
    { name: "자석 보관함" },
    { name: "자석 보관함" },
    { name: "후크 걸이" },
    { name: "후크 걸이" },
    { name: "안경거치대 고양이" },
    { name: "안경거치대 고양이" },
    { name: "안경거치대 고양이" },
    { name: "비트코인" },
    { name: "비트코인" },
    { name: "슬롯머신" },
    { name: "슬롯머신" },
    { name: "미니 농구 게임" },
    { name: "미니 농구 게임" },
    { name: "미니 농구 게임" },
    { name: "미니 농구 게임" },
    { name: "변신 공룡알 2개" },
    { name: "변신 공룡알 2개" },
    { name: "가위바위보 머신 1개" },
    { name: "가위바위보 머신 1개" },
    { name: "가위바위보 머신 2개" },
    { name: "반짝반짝 거북이 1개" },
    { name: "반짝반짝 거북이 1개" },
    { name: "반짝반짝 거북이 2개" },
    { name: "반짝반짝 거북이 2개" },
    { name: "반짝반짝 거북이 3개" },
    { name: "반짝반짝 거북이 3개" },
    { name: "반짝반짝 오리 3개" },
    { name: "반짝반짝 오리 3개" },
    { name: "반짝반짝 오리 3개" },
    { name: "반짝반짝 오리 4개" },
    { name: "반짝반짝 오리 4개" },
    { name: "반짝반짝 오리 4개" },
    { name: "반짝반짝 오리 5개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 1개" },
    { name: "키링 2개" },
    { name: "키링 2개" },
    { name: "키링 2개" },
    { name: "키링 2개" },
    { name: "키링 3개" },
    { name: "키링 3개" },
    { name: "키링 3개" },
    { name: "핀뱃지 2개" },
    { name: "핀뱃지 2개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 3개" },
    { name: "핀뱃지 4개" },
    { name: "핀뱃지 4개" },
    { name: "핀뱃지 4개" },
    { name: "핀뱃지 4개" },
    { name: "핀뱃지 5개" },
    { name: "핀뱃지 5개" },
    { name: "핀뱃지 5개" },
    { name: "핀뱃지 5개" },
    // { name: "스트림 덱" }, 효은
    // { name: "온열 고양이 베개 - 깜이" }, 형호
    // { name: "온열 발매트" }, 규연
    // { name: "온열 발바닥 돔" }, 시아
    // { name: "키보드 청소도구 세트" }, 용채
    // { name: "라벨 프린터" }, 용채
    // { name: "기계상어" }, 시아
    // { name: "미니 트럼프 카드" }, 일경
    // { name: "아보카도 손난로" }, 일경
    // { name: "장난감 리볼버" }, 수영
    // { name: "후크 걸이" }, 효은
    // { name: "슬롯머신" },
    // { name: "미니 농구 게임" },
    // { name: "변신 공룡알 2개" },
    // { name: "변신 공룡알 2개" },
    // { name: "가위바위보 머신 2개" },
    // { name: "가위바위보 머신 2개" },
    // { name: "반짝반짝 오리 3개" },
    // { name: "반짝반짝 오리 3개" },
    // { name: "반짝반짝 오리 5개" },
    // { name: "키링 1개" },
    // { name: "키링 2개" },
    // { name: "핀뱃지 2개" },
    // { name: "핀뱃지 2개" },
    // { name: "핀뱃지 2개" },
    // { name: "핀뱃지 2개" },
    // { name: "핀뱃지 3개" },
    // { name: "핀뱃지 4개" },
    // { name: "핀뱃지 4개" },
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
    setTimeout(() => setAnimateText(true), 2000);
    setRemainingProducts(
      remainingProducts.filter((_, index) => index !== randomIndex)
    );

    setTimeout(() => setConfetti(false), 5000);
    setTimeout(() => setAnimateText(false), 4000);
    setTimeout(() => setIsButtonDisabled(false), 5000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>경품 뽑기권을 사용할까요?</h1>
      <button
        onClick={drawGift}
        className={`${styles.button} ${
          isButtonDisabled ? styles.isButtonDisabled : ""
        }`}
        type="button"
        disabled={isButtonDisabled}>
        사용하기
      </button>
      {confetti && <Confetti className={styles.confetti} />}

      <div
        className={`${styles.result} ${animateText ? styles.animateText : ""}`}>
        <h3>추첨 결과</h3>
        <h2>{drawnGift?.name}</h2>
      </div>
      <div className={styles.history}>
        <h2>당첨 내역</h2>
        <p>개발중</p>
        <ol>
          <li>
            <dl>
              {/* <dt>당첨자</dt>
              <dd>김아무개</dd>
              <dt>상품</dt>
              <dd>룰루랄라</dd> */}
            </dl>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default LuckyDraw;
