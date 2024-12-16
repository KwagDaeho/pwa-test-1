// src/types/NotionData.ts
export interface NotionData {
  id: string;
  properties: {
    Name: {
      id: string;
      type: "title";
      title: Array<{
        type: "text";
        text: {
          content: string;
        };
      }>;
    };
    Score: {
      id: string;
      type: "number";
      number: number;
    };
    // 추가 필드 정의 가능
  };
}
