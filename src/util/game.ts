const soundCache = {}; // 사운드 캐시
const audioContext =
  typeof window !== "undefined" &&
  (window.AudioContext || window.webkitAudioContext)
    ? new (window.AudioContext || window.webkitAudioContext)()
    : null; // AudioContext 싱글톤

const sound = (url) => {
  // AudioContext 상태 복구 함수
  const ensureAudioContextRunning = async () => {
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
  };

  const play = async () => {
    await ensureAudioContextRunning();

    // 캐시에서 오디오 버퍼 가져오기
    const buffer = soundCache[url];
    if (!buffer) {
      return;
    }

    // 새로운 소스 노드 생성 및 연결
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = url.includes("coin")
      ? 0.18
      : url.includes("start")
      ? 0.5
      : url.includes("defeat")
      ? 0.3
      : 0.15;

    source.connect(gainNode).connect(audioContext.destination);

    try {
      source.start(0);
      // console.log(`Playing sound: ${url}`);
    } catch (err) {
      console.error("Error starting source node:", err);
    }

    // 사운드 재생 종료
    // source.onended = () => {
    //   console.log(`Playback ended for: ${url}`);
    // };
  };

  // 오디오 로드 함수
  const load = async () => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // 캐시에 오디오 버퍼 저장
      soundCache[url] = audioBuffer;
      console.log(`Sound loaded: ${url}`);
    } catch (err) {
      console.error("Error loading sound:", err);
    }
  };

  return { play, load };
};

const util = {
  isBetween: (value, min, max) => {
    // 특정 값(`value`)이 두 값(`min`, `max`) 사이에 있는지 확인하는 함수
    return (value - min) * (value - max) < 0;
  },
  random: (min, max) => {
    // `min`과 `max` 사이의 임의의 숫자를 생성하는 함수
    return min + Math.random() * (max - min);
  },
  getDistance: (p1, p2) => {
    // 두 점(`p1`, `p2`) 사이의 거리를 계산하는 함수
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  },
  lerp: (value1, value2, amount) => {
    // 두 값(`value1`, `value2`) 사이의 선형 보간을 수행하는 함수
    return value1 + (value2 - value1) * amount;
  },
  isPointInSquare: (x, y, square) => {
    // 특정 점(`x`, `y`)이 정사각형(`square`) 내부에 있는지 확인하는 함수
    return (
      util.isBetween(x, square.position.x, square.position.x + square.size) &&
      util.isBetween(y, square.position.y, square.position.y + square.size)
    );
  },
  splitArray: (array, width) => {
    // 주어진 배열(`array`)을 지정된 크기(`width`)만큼의 행으로 나누는 함수
    const result = [];
    for (let i = 0; i < array.length; i += width)
      result.push(array.slice(i, i + width));
    return result;
  },
};

export { sound, soundCache, util };
