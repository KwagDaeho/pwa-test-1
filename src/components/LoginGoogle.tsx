"use client";

import { googleLogin } from "@/firebase/loginGoogle";
import useGoogleLogin from "@/hooks/useGoogleLogin";

const LoginGoogle = () => {
  const { user, loginLoading, googleLogout } = useGoogleLogin();
  if (loginLoading) {
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
          paddingTop: "40vh",
          textAlign: "center",
          backgroundColor: "rgba(0,0,0,0.8)",
        }}>
        <p style={{ color: "#ccc" }}>로그인 정보 확인 중....</p>
      </div>
    );
  }
  return (
    <>
      {user == null ? (
        <div
          style={{
            position: "fixed",
            right: "0px",
            top: "0px",
            padding: "12px 18px",
            backgroundColor: "rgba(255,255,255,0.4)",
            color: "#232323",
          }}
          onClick={googleLogin}>
          Google Login
        </div>
      ) : (
        <div
          style={{
            position: "fixed",
            right: "0px",
            top: "0px",
            padding: "5px 12px",
            backgroundColor: "rgba(255,255,255,0.4)",
            color: "#232323",
          }}
          onClick={googleLogout}>
          Logout
        </div>
      )}
    </>
  );
};

export default LoginGoogle;
