"use client";

import { googleLogin } from "@/firebase/loginGoogle";
import useGoogleLogin from "@/hooks/useGoogleLogin";

const LoginGoogle = () => {
  const { user, googleLogout } = useGoogleLogin();
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
