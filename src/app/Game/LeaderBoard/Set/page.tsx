"use client";

import { useEffect } from "react";
import useGameDashboard from "@/hooks/useGameDashboard";
import LeaderBoardListTable from "@/components/Table/LeaderBoardListTable";

export default function LeaderBoard() {
  const { data, loading, error, fetchGameData } = useGameDashboard();
  useEffect(() => {
    fetchGameData("1534c734f1b5802dbb36c2d48eea6b01");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* 데이터 표시 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          paddingBlock: "24px",
        }}>
        <h2>[ Set ]</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {data && <LeaderBoardListTable data={data} />}
        <button
          onClick={() => fetchGameData("1534c734f1b5802dbb36c2d48eea6b01")}
          disabled={loading}>
          새로고침
        </button>
      </div>
    </>
  );
}
