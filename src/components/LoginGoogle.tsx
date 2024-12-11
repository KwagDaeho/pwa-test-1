import { googleLogin } from "@/firebase/loginGoogle";

const LoginGoogle = () => {
  return (
    <div
      style={{
        position: "fixed",
        left: "0",
        top: "0",
        zIndex: "9999",
        width: "100dvw",
        height: "100dvh",
        backgroundColor: "rgba(0,0,0,0.7)",
      }}>
      <div
        style={{
          position: "fixed",
          left: "calc(50% - 90px)",
          top: "calc(50% - 20px)",
          width: "180px",
          height: "40px",
          padding: "5px 12px",
          backgroundColor: "rgba(255,255,255,0.9)",
          color: "#232323",
          borderRadius: "10px",
          textAlign: "center",
          lineHeight: "30px",
        }}
        onClick={googleLogin}>
        Google Login
      </div>
    </div>
  );
};

export default LoginGoogle;
