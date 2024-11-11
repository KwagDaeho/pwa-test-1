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
  const title = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon512_rounded.png",
  };

  // 알림 표시
  self.registration.showNotification(title, notificationOptions);
});

// 알림 클릭 시 앱 열기
self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const redirectUrl = "/"; // 앱의 루트 URL로 변경 가능

  // 알림 클릭 시 앱을 여는 동작
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // 앱이 이미 열려 있으면 포커스를 주고, 그렇지 않으면 새 창을 엶
      const client = clientList.find(
        (client) =>
          client.url === redirectUrl && client.visibilityState === "visible"
      );
      if (client) {
        return client.focus();
      } else {
        return clients.openWindow(redirectUrl);
      }
    })
  );

  // 알림 닫기
  notification.close();
});
