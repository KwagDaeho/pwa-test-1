import { useState, useEffect } from "react";
import { auth } from "@/firebase/index"; // Firebase 설정 파일 import
import {
  // GoogleAuthProvider,
  // signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

type User = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

const useGoogleLogin = () => {
  const [user, setUser] = useState<User | null>(null); // 로그인된 사용자 정보 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 (로그인 정보 확인 중일 때)
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // // 로그인 처리
  // const googleLogin = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     setLoading(true); // 로그인 시작 시 로딩 상태로 변경
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     setUser({
  //       displayName: user.displayName,
  //       email: user.email,
  //       photoURL: user.photoURL,
  //     });
  //   } catch (err) {
  //     setError("로그인 실패: " + err.message); // 로그인 실패 시 에러 메시지 설정
  //   } finally {
  //     setLoading(false); // 로그인 완료 후 로딩 상태 종료
  //   }
  // };

  // 로그아웃 처리
  const googleLogout = async () => {
    try {
      await signOut(auth); // Firebase에서 로그아웃 처리
      setUser(null); // 사용자 정보 초기화
    } catch (err) {
      setError("로그아웃 실패: " + err.message);
    }
  };

  // 로그인 상태 추적 (onAuthStateChanged)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null); // 로그아웃된 경우 사용자 정보 초기화
      }
      setLoading(false); // 상태 업데이트 후 로딩 종료
    });

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => unsubscribe();
  }, []);

  return { user, loading, error, googleLogout };
};

export default useGoogleLogin;
