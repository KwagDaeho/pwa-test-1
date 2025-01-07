"use client"; // 클라이언트 컴포넌트임을 명시

import { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import styles from "./LuckyDraw.module.css"; // CSS 모듈 불러오기
import { util } from "@/util/game";

const initialProducts = [
  { name: "16인치 포터블 모니터" },
  { name: "스트림 덱" },
  { name: "스트림 덱" },
  { name: "스트림 덱" },
  { name: "난방 가습기" },
  { name: "반중력 가습기" },
  { name: "2025 달력 (호그와트)" },
  { name: "타지마할" },
  { name: "콜로세움" },
  { name: "에펠탑" },
  { name: "밸런스 게임" },
  { name: "목 어깨 마사지기" },
  { name: "요추베개" },
  { name: "방한 터치 장갑" },
  { name: "보드게임 종합세트 (중문)" },
  { name: "테이블 축구" },
  { name: "실내 농구대" },
  { name: "빙글빙글 톱니 미로" },
  { name: "손목 지지대" },
  { name: "빈티지 자동차" },
  { name: "스포츠카" },
  { name: "구닥다리 자동차" },
  { name: "지구" },
  { name: "데스노트" },
  { name: "모래시계" },
  { name: "크리스탈 장미" },
  { name: "깜이 쿠션" },
  { name: "깜이 인형" },
  { name: "USB A type 허브" },
  { name: "트럼프 카드" },
  { name: "펭귄 손난로" },
  { name: "펭귄 손난로" },
  { name: "공 던지기 게임 세트" },
  { name: "캐치볼 세트" },
  { name: "아기 오리 세트" },
  { name: "흰둥이 키링" },
  { name: "고양이 스펀지 세트" },
  { name: "자석 보관함" },
  { name: "후크 걸이" },
  { name: "안경거치대 고양이" },
  { name: "안경거치대 고양이" },
  // { name: "행 운 상 - 5만원" }, 혜린
  // { name: "16인치 포터블 모니터 ( 터치 )" }, 시아
  // { name: "스트림 덱" }, 시아
  // { name: "스트림 덱" }, 효은
  // { name: "온열 고양이 베개 - 깜이" }, 형호
  // { name: "온열 고양이 베개 - 자몽" }, 팀장님
  // { name: "온열 발매트" }, 규연
  // { name: "온열 발바닥 돔" }, 시아
  // { name: "키보드 청소도구 세트" }, 용채
  // { name: "2025 달력 (호그와트)" }, 시아
  // { name: "손 마사지기" }, 지영
  // { name: "손가락 마우스" }, 일경
  // { name: "아보카도 손난로" }, 효은
  // { name: "캐치볼 세트" }, 용채
  // { name: "꼬꼬 가족 세트" }, 재균
  // { name: "동글 고양이 세트" }, 규연
  // { name: "눕눕 고양이 세트" }, 혜지
  // { name: "장난감 총" }, 규연
  // { name: "라벨 프린터" }, 용채
  // { name: "기계상어" }, 시아
  // { name: "미니 트럼프 카드" }, 일경
  // { name: "아보카도 손난로" }, 일경
  // { name: "장난감 리볼버" }, 수영
  // { name: "자석 보관함" }, 혜지
  // { name: "후크 걸이" }, 형호
  // { name: "후크 걸이" }, 효은
  // { name: "안경거치대 고양이" }, 영모
  // { name: "슬롯머신" },
  // { name: "슬롯머신" },
  // { name: "미니 농구 게임" },
  // { name: "미니 농구 게임" },
  // { name: "미니 농구 게임" },
  // { name: "변신 공룡알 2개" },
  // { name: "변신 공룡알 2개" },
  // { name: "가위바위보 머신 1개" },
  // { name: "가위바위보 머신 2개" },
  // { name: "가위바위보 머신 2개" },
  // { name: "반짝반짝 오리 3개" },
  // { name: "반짝반짝 오리 3개" },
  // { name: "반짝반짝 오리 3개" },
  // { name: "반짝반짝 오리 3개" },
  // { name: "반짝반짝 오리 4개" },
  // { name: "반짝반짝 오리 5개" },
  // { name: "키링 1개" },
  // { name: "키링 1개" },
  // { name: "키링 1개" },
  // { name: "키링 2개" },
  // { name: "핀뱃지 2개" },
  // { name: "핀뱃지 2개" },
  // { name: "핀뱃지 2개" },
  // { name: "핀뱃지 2개" },
  // { name: "핀뱃지 3개" },
  // { name: "핀뱃지 3개" },
  // { name: "핀뱃지 3개" },
  // { name: "핀뱃지 3개" },
  // { name: "핀뱃지 3개" },
  // { name: "핀뱃지 3개" },
  // { name: "핀뱃지 3개" },
  // { name: "핀뱃지 4개" },
  // { name: "핀뱃지 4개" },
  // { name: "핀뱃지 4개" },
];
const LuckyDraw = () => {
  const [remainingProducts, setRemainingProducts] = useState(initialProducts);
  const [drawnGift, setDrawnGift] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [winnerName, setWinnerName] = useState(""); // 이름 입력용 state
  const [winners, setWinners] = useState([]); // 당첨자 목록 state
  const [showSlotMachine, setShowSlotMachine] = useState(true);
  const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 추가
  const [shuffledProducts, setShuffledProducts] = useState<
    typeof remainingProducts
  >([]);

  const drawGift = () => {
    if (isButtonDisabled || !winnerName.trim()) return;

    setIsButtonDisabled(true);
    setShowSlotMachine(false);

    const selectedGift =
      remainingProducts[util.randomIndex(remainingProducts.length)];

    setConfetti(true);

    setTimeout(() => {
      setDrawnGift(selectedGift);
      setAnimateText(true);

      setTimeout(() => {
        setWinners((prev) => [
          ...prev,
          {
            name: winnerName,
            gift: selectedGift.name,
          },
        ]);
      }, 3800);

      setTimeout(() => {
        setAnimateText(false);
        setTimeout(() => {
          setAnimationKey((prev) => prev + 1);
          setShowSlotMachine(true);
          setWinnerName("");
          setIsButtonDisabled(false);
        }, 500);
      }, 4000);

      setTimeout(() => setConfetti(false), 5000);
    }, 1500);

    setRemainingProducts(
      remainingProducts.filter((item) => item.name !== selectedGift.name)
    );
  };

  const shuffleArray = useCallback((array: typeof remainingProducts) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = util.randomIndex(i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  useEffect(() => {
    setShuffledProducts(shuffleArray(remainingProducts));
  }, [remainingProducts, shuffleArray]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>경품 뽑기권을 사용할까요?</h1>

      <input
        type="text"
        value={winnerName}
        onChange={(e) => setWinnerName(e.target.value)}
        placeholder="이름을 입력하세요"
        className={styles.nameInput}
      />

      <button
        onClick={drawGift}
        className={`${styles.button} ${
          isButtonDisabled || !winnerName.trim() ? styles.isButtonDisabled : ""
        }`}
        type="button"
        disabled={isButtonDisabled || !winnerName.trim()}>
        사용하기
      </button>

      {/* 슬롯머신 */}
      <div
        className={`${styles.slotMachine} ${
          showSlotMachine ? styles.show : styles.hide
        }`}>
        <div key={animationKey} className={styles.scrollingList}>
          {[...shuffledProducts, ...shuffledProducts, ...shuffledProducts].map(
            (product, index) => (
              <div key={index} className={styles.productItem}>
                {product.name}
              </div>
            )
          )}
        </div>
      </div>

      {/* 결과 화면 */}
      <div
        className={`${styles.result} ${animateText ? styles.animateText : ""}`}>
        <h3>추첨 결과</h3>
        <h2>{drawnGift?.name}</h2>
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
};
export default LuckyDraw;
