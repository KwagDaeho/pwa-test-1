import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

// 다운로드한 Firebase 서비스 계정 키 파일을 프로젝트에 추가하고, 해당 파일을 import 합니다.
const serviceAccount: ServiceAccount = {
  projectId: "pwa-push-test-a894c",
  privateKey:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDF3mSFqiqDSZG3\nw7qpeXtvRmCxJoXD71QlQroHFUpHSv2Rjt3CoD9wGPTQcabhzoVKCHMFHteM0tkL\n0zq4Gh3Y+pc4XdHeTFRg61V83sGeqKFT8DEBs/HNSDJYb5VaiZf0AfjM9IirajnT\nbgobVBk1U7oB0cChI6TMarDw/zPbkmHXeIippzqKHETK8cqnnc7c3+epPdTb/JdU\n7ONUNdm/YhQWoLYhapKsSliZBuOk/drdoQHAFXxF6qZ02IvRRFjoWGjPs3AY/t0L\n1h2Buz82lRzjWlYdc99FUZsfepQaYkiaiz5di5ZYxjDri6+xV6Escq2NDJfQBIAr\nJ3C6cRXfAgMBAAECggEAWkESXgvb/22f25AahTJF9OBHu5ZkPpbcrXBN1WxHKNTS\na8IccinRNesURD4LDoW6s6W9/VBvpqsIWMX9SzuScMYBEzNsRrdPZ7QAlwgujhXC\nHLz7RZkUSvxLBp7DI/yOBL2fhLFn47R88u2HC6clJndt6WWJNZdCFQH3er4Vo+nI\nQS9hDiebDgyDo3zr3/gDR7E+gRoyOyVRisCn4yy8Udiu8/KGTmNxHCZPOk9tvEbf\nzjL/H8ufblFty5DT6zq69dU88WitLvfy96DBBkMTh5Ii+emZ5YdLL2RyrfrQnTi3\nDDKqdAyH/F6z/TUNcNKri0rwpIqiQ2JYDvhL5KhZ9QKBgQDtDEr6z8onnO29A7bt\nTwJKFC5sFnv9Dq/CcvCyMiNkoighxaLD8sGwwSUo7tDY4IcTE909Drbgify5bgr9\nGy+GjxR3luzOjn0p5DtxMkrAMVTc244yoBetWpr5gGy0c8/pExaLXfCfsmObnhTS\nwGcrchsq7XHlH6H+UxPGS9lI2wKBgQDVsDWoWelTq9kzIUbvt129928XNj7owD1w\n4Q789cIMX+zLFbSXV9uSPaLY4h0jaX/CQEV4zYVOUGz+XSiaWmjY8B0nnguaQIcW\nQxvoN8BUP2fncl9XoP4BQqls6YHhp35r8FALjd/xrfZeaOo9sOcsc9756pt96AFd\nbsHI5vRETQKBgQC0k1y623df3ces6Rt8g2d3DxCd/jLNf1achfqdhFw52N1BfNCU\n/GRYRYoNOH+X9tJu0f8C+CaPvg3rI8zzKrZ1hqFMyIf0gc8PDnHJtUoERpAi/o3A\nOvxObmsIDbDBdke3gXb3C8S1oqsGbNHoCfGNwwq3FNJifEpm9tplgHoxaQKBgQCY\nZjeefaFevy0EvjLtPAVrOlDMaS+sp44qNxiNaGigkrk6jZxiY5KBVdwSehD19IPd\nciEZ6tmr5MgXETGoA9rK/VSNsLXtqR+uzOXWVAyjCSV9d6Bvyq3dEEHtHww2d1I+\ngQFVfDW/E6al5oVIwiXdGjZoXt3OieyPSjKCqdSD8QKBgG27SLLgmb5OPxK8oIoW\n7NzCNpMDjlCQhNkW6xxh2KItScN9ITz/CvhV2VwVyWlrtYiwfIEHmnC3nFlofsT8\n+N9+qQzS5jjO9RWo0idYWk+1CThE0Ao3NJFPBKKEwYkLsp3qq6vNYp0PUGrpx5Q7\nQrjlJ2yJJjeVhdsQ5wCR8HrN\n-----END PRIVATE KEY-----\n".replace(
      /\\n/g,
      "\n"
    ),
  clientEmail:
    "firebase-adminsdk-gpy3x@pwa-push-test-a894c.iam.gserviceaccount.com",
};

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app(); // 이미 초기화된 앱이 있다면 그 앱을 사용
}

export default admin;
