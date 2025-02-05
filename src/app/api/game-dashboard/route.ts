import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { NotionPostScoreData } from "@/types/NotionData";

const NotionClient = (() => {
  let instance: Client | null = null;
  return {
    getInstance: () => {
      if (!instance) {
        instance = new Client({
          auth: "secret_3s0jxVi3BlFEN6n4skZlaAkeGqjly7eqYvVGuC9volX", // 환경 변수 사용
        });
      }
      return instance;
    },
  };
})();
const notion = NotionClient.getInstance();
const RequestHandlers = {
  GET: async (request: Request) => {
    const databaseId = new URL(request.url).searchParams.get("database_id");
    if (!databaseId) return errorResponse("Database ID is required", 400);
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [
          { property: "Score", direction: "descending" },
          { property: "Date", direction: "ascending" },
        ],
        page_size: 100,
      });
      return NextResponse.json({ success: true, data: response.results });
    } catch (error) {
      return errorResponse(error.message, 500);
    }
  },
  POST: async (request: Request) => {
    const databaseId = new URL(request.url).searchParams.get("database_id");
    if (!databaseId) return errorResponse("Database ID is required", 400);

    const { name, score, date }: NotionPostScoreData = await request.json();
    if (!name || !score || !date) return errorResponse("Missing required fields", 400);
    try {
      const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Name: { title: [{ text: { content: name } }] },
          Score: { number: score },
          Date: { date: { start: date } },
        },
      });
      return NextResponse.json({ success: true, data: response });
    } catch (error) {
      return errorResponse(error.message, 500);
    }
  },
};

const errorResponse = (message: string, status: number) => {
  return NextResponse.json({ success: false, error: message }, { status });
};

export async function GET(request: Request) {
  return RequestHandlers.GET(request);
}
export async function POST(request: Request) {
  return RequestHandlers.POST(request);
}
