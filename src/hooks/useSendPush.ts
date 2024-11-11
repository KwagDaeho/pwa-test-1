import axios from "axios";

const useSendPush = () => {
  const sendPush = async ({
    title,
    body,
    click_action,
    token,
  }: {
    title: string;
    body: string;
    click_action: string;
    token: string;
  }) => {
    const message = {
      data: {
        title,
        body,
        image: "/icon512_rounded.png",
        click_action,
      },
    };

    // Axios 요청에 토큰 추가
    axios.request({
      method: "POST",
      url: window?.location?.origin + "/api/send-fcm",
      data: { message, tokens: [token] }, // 토큰 포함
    });
  };

  return sendPush;
};

export default useSendPush;
