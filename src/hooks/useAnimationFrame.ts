import { useEffect, useRef } from "react";

export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
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
