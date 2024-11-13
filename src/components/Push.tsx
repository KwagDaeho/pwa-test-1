"use client";

import { useEffect, useState } from "react";
import {
  getMessaging,
  onMessage,
  getToken,
  isSupported,
  Messaging,
} from "firebase/messaging";
import { firebaseApp } from "@/firebase";
import useSendPush from "@/hooks/useSendPush";

// Push 컴포넌트
export default function Push() {
  const [permission, setPermission] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const sendPush = useSendPush();
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      // 클라이언트에서만 Notification을 사용할 수 있도록 설정
      setPermission(Notification.permission);
    }
  }, []);

  // 메시징 객체를 가져오는 함수
  const messaging = async (): Promise<Messaging | null> => {
    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // 푸시 토큰을 가져오는 함수
  const getPushToken = async (messagingInstance: Messaging): Promise<void> => {
    try {
      const token = await getToken(messagingInstance, {
        vapidKey:
          "BAoxgrzIdQPE90qpBuUoCNMN-eUKRGDumVGyMiz4zqwbNncR1yJXg36T1OE7TWJhIHaDVNmCGY5DAwRkkwBWQbI",
      });
      if (token) {
        console.log("FCM Token:", token);
        setToken(token);
        // 토큰을 서버나 DB에 저장하여 나중에 사용할 수 있도록 합니다.
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      console.error("An error occurred while retrieving token:", err);
    }
  };

  // 백그라운드 푸시 알림 권한을 요청하는 함수
  const requestPermission = async (): Promise<void> => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      return;
    }
    const currentPermission = Notification.permission;
    if (currentPermission === "granted") {
      return;
    } else {
      const newPermission = await Notification.requestPermission();
      setPermission(newPermission);
      console.log("permission", newPermission);
    }
  };

  // `useEffect`로 인앱 알림 처리
  useEffect(() => {
    // 클라이언트 사이드에서만 Notification을 사용하도록 처리
    if (typeof window !== "undefined") {
      const onMessageListener = async () => {
        const messagingResolve = await messaging();
        if (messagingResolve) {
          // 푸시 알림 권한을 확인하고 수신 처리
          onMessage(messagingResolve, (payload) => {
            console.log("payload", payload);
            const title = payload.data.title;
            alert("TITLE : " + title + "   ...PUSH..");
          });
          // 푸시 알림을 위한 토큰을 가져옴
          await getPushToken(messagingResolve);
        }
      };

      // 컴포넌트가 마운트될 때 알림을 수신하도록 설정
      onMessageListener();
    }
  }, []); // dependency array가 빈 배열이면 컴포넌트가 마운트될 때 한 번만 실행됨

  // 권한 상태에 따른 버튼 또는 메시지 표시
  const renderPermissionMessage = () => {
    if (permission === "denied") {
      return (
        <div>
          <p>
            푸시 알림이 차단되어있어요.
            <br />
            백그라운드 알림을 받으시려면
            <br />
            브라우저 설정에서 알림을 허용해주세요.
          </p>
        </div>
      );
    }
    return (
      <div>
        <button
          style={{ width: "100%", padding: "8px" }}
          onClick={requestPermission}>
          푸시 알림 켜기
        </button>
      </div>
    );
  };

  return (
    <div>
      <div>🔔{permission}🔔</div>
      {renderPermissionMessage()}
      <button
        style={{
          width: "100%",
          padding: "8px",
          backgroundColor: "transparent",
          border: "1px solid #c90",
        }}
        onClick={() =>
          sendPush({
            title: "버튼 클릭",
            body: "버튼 클릭 시 푸시 알림",
            click_url: "/",
            tokens: [token],
          })
        }>
        푸시 알림 TEST
      </button>
    </div>
  );
}
