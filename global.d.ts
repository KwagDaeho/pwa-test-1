declare global {
  interface Window {
    postGameScore: function; // addBirdData가 함수일 경우
    webkitAudioContext?: typeof AudioContext;
  }
}

export {}; // 이 파일을 모듈로 취급하기 위해 필요
