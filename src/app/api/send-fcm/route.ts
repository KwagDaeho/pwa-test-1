import { NextRequest, NextResponse } from "next/server";
import admin from "@/firebase/admin";
import { Message } from "firebase-admin/messaging";

type Notification = {
  title: string;
  body: string;
  image: string;
  click_action: string;
};

const sendFCMNotification = async (
  tokenList: Array<string>,
  data: Notification
) => {
  if (tokenList.length === 0) return;

  // V1 API에서 sendEach을 사용하여 다중 토큰 처리
  const messages: Message[] = tokenList.map((token) => ({
    token: token, // 각 사용자의 토큰
    data: {
      title: data.title,
      body: data.body,
      image: data.image,
    },
    webpush: {
      fcmOptions: {
        link: data.click_action,
      },
    },
  }));

  try {
    const res = await admin.messaging().sendEach(messages);
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error sending FCM notification:", error);
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    const { tokens, notification } = await req.json();
    if (!tokens || !notification) {
      return NextResponse.json(
        { error: "Missing tokens or notification data" },
        { status: 400 }
      );
    }
    const response = await sendFCMNotification(tokens, notification);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send notification", details: String(error) },
      { status: 500 }
    );
  }
}
