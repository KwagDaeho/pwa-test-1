"use client";

import axios from "axios";

interface PushNotification {
  title: string;
  body: string;
  click_url: string;
  tokens: string[];
}
const useSendPush = () => {
  const sendPush = async ({
    title,
    body,
    click_url,
    tokens,
  }: PushNotification) => {
    const message = {
      data: {
        title,
        body,
        click_url,
        image: window?.location?.origin + "/icon512_rounded.png",
      },
    };
    try {
      const postURL = window?.location?.origin + "/api/send-fcm";
      await axios.request({
        method: "POST",
        url: postURL,
        data: {
          tokens: tokens, // 올바른 키 사용
          notification: message.data, // `notification`으로 변경
        },
      });
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };

  return sendPush;
};

export default useSendPush;
