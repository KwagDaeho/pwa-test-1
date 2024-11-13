importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js"
);
self.addEventListener("install", () => {
  self.skipWaiting(); // 서비스 워커를 즉시 활성화
});

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
console.log(messaging);

let notificationLink = "/";
self.addEventListener("push", function (event) {
  const data = event.data.json().notification;
  notificationLink = data.click_url;

  // 알림 표시
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.image,
  });
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const redirectUrl = notificationLink; // 리다이렉트할 절대 경로

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      const client = clientList.find(
        (client) =>
          client.url === redirectUrl && client.visibilityState === "visible"
      );

      if (client) {
        // 이미 열려 있는 창이 있다면 포커스를 주고, 해당 클라이언트에 메시지 전송
        return client.focus().then((focusedClient) => {
          if ("navigate" in focusedClient) {
            // 클라이언트에게 URL을 전달하여 리다이렉트
            focusedClient.postMessage(redirectUrl);
          }
        });
      } else {
        // 새 창을 열고 메시지 전달
        return clients.openWindow(redirectUrl).then((newClient) => {
          newClient.postMessage(redirectUrl);
        });
      }
    })
  );

  // 알림 닫기
  notification.close();
});
