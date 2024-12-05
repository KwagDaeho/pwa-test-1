import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// Notion API 클라이언트 설정
const notion = new Client({
  auth: "secret_3s0jxVi3BlFEN6n4skZlaAkeGqjly7eqYvVGuC9volX",
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const databaseId = url.searchParams.get("database_id"); // 쿼리 파라미터로 DB ID 받기

  if (!databaseId) {
    return NextResponse.json(
      { success: false, error: "Database ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await notion.databases.query({ database_id: databaseId });
    const data = response.results;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data from Notion:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const databaseId = url.searchParams.get("database_id"); // 쿼리 파라미터로 DB ID 받기

  if (!databaseId) {
    return NextResponse.json(
      { success: false, error: "Database ID is required" },
      { status: 400 }
    );
  }

  const { name, score, date } = await request.json();

  if (!name || !score || !date) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: name, score, date" },
      { status: 400 }
    );
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Score: {
          number: score,
        },
        Date: {
          date: {
            start: date,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Error adding data to Notion:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
