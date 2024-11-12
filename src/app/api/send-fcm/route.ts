import { NextRequest, NextResponse } from "next/server";
import admin from "@/firebase/admin";

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
  const message: admin.messaging.MulticastMessage = {
    notification: {
      title: data.title,
      body: data.body,
      imageUrl: data.image,
    },
    webpush: {
      fcmOptions: {
        link: data.click_action,
      },
    },
    tokens: tokenList,
  };

  try {
    const res = await admin.messaging().sendMulticast(message);
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
