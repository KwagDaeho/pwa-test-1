"use client";

import { useEffect } from "react";
import useGameDashboard from "@/hooks/useGameDashboard";

export default function LeaderBoard() {
  const { data, loading, error, fetchGameData } = useGameDashboard();
  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = () => {
    fetchGameData("1534c734f1b58051ba80fa960ba2a0be");
  };

  return (
    <>
      {/* 데이터 표시 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}>
        <h2>[ Game : Santa ]</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {data && (
          <>
            <ol>
              {data
                .sort(function (a, b) {
                  return b.properties.Score.number - a.properties.Score.number;
                })
                .slice(0, 10)
                .map((item, index: number) => {
                  return (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        gap: "20px",
                        borderBottom: `${
                          index < 3 ? "2px solid #f90" : "2px solid #ccc"
                        }`,
                        padding: "4px 24px",
                      }}>
                      <span style={{ width: "240px" }}>
                        <b>{item.properties.Name.title[0].text.content}</b> 님{" "}
                      </span>
                      <span>{item.properties.Score.number} 점</span>
                    </li>
                  );
                })}
            </ol>
          </>
        )}
        <button onClick={handleFetchData} disabled={loading}>
          새로고침
        </button>
      </div>
    </>
  );
}
