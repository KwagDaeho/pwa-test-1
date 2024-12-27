import { NotionData } from "@/types/NotionData";
import { useState } from "react";
import useGoogleLogin from "./useGoogleLogin";

const useGameDashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NotionData[] | null>(null);
  const { user } = useGoogleLogin();
  // GET 요청 - 데이터베이스에서 데이터 조회
  const fetchGameData = async (databaseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/game-dashboard?database_id=${databaseId}`
      );
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // POST 요청 - 데이터베이스에 데이터 추가
  const addGameData = async (databaseId: string, score: number) => {
    setLoading(true);
    setError(null);
    const date = new Date().toISOString();
    try {
      const name =
        user == null
          ? prompt(
              "Score : " + score + "\n점수를 등록하려면 이름을 입력하세요."
            )
          : user.displayName;

      if (name !== null) {
        const response = await fetch(
          `/api/game-dashboard?database_id=${databaseId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, score, date }),
          }
        );

        const result = await response.json();
        console.log(result);
      } else {
        console.log("점수 등록을 취소하였습니다.");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to add data");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchGameData,
    addGameData,
  };
};

export default useGameDashboard;
