importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBJ31XuUe28bUefVKtL7lZ40Cp3WAR1o2I",
  authDomain: "pwa-push-test-a894c.firebaseapp.com",
  projectId: "pwa-push-test-a894c",
  storageBucket: "pwa-push-test-a894c.firebasestorage.app",
  messagingSenderId: "908737115834",
  appId: "1:908737115834:web:1a2ee9329dedd81da9b483",
  measurementId: "G-EV4H58NWR9",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 푸시 메시지 처리
messaging.onBackgroundMessage((payload) => {
  // 푸시 알림 데이터 가져오기
  const title = payload.notification.title + " (Background PUSH)";
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon512_rounded.png",
  };

  // 알림 표시
  self.registration.showNotification(title, notificationOptions);
});
