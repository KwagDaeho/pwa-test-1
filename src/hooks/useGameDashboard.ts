"use client";
import { useState } from "react";

const useGameDashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

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
  const addGameData = async (
    databaseId: string,
    name: string,
    score: number,
    date: string
  ) => {
    setLoading(true);
    setError(null);

    try {
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

      if (response.ok) {
        setData(result.data);
      } else {
        setError(result.error);
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
