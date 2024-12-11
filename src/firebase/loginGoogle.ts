// googleLogin.ts
import { auth } from "./";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const googleLogin = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 로그인한 사용자의 정보 출력
    console.log("User Info:", user);
    // 예: user.displayName, user.email 등을 활용
  } catch (error) {
    console.error("Login failed:", error.message);
  }
};

export { googleLogin };
