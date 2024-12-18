import { NotionData } from "@/types/NotionData";

export default function LeaderBoardListTable({ data }: { data: NotionData[] }) {
  return (
    <ol>
      {data.map((item, index: number) => {
        return (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-around",
              gap: "20px",
              borderBottom: `${
                index == 0
                  ? "4px solid #ffd700"
                  : index == 1
                  ? "3px solid #BEBEBE"
                  : index == 2
                  ? "3px solid #CD7F32"
                  : "2px solid #999"
              }`,
              padding: `${
                index == 0
                  ? "30px 24px 18px 60px"
                  : index < 3
                  ? "18px 24px 12px 48px"
                  : "4px 24px"
              }`,
              backgroundImage: `url(${
                index == 0
                  ? "/image/rank-1.png"
                  : index == 1
                  ? "/image/rank-2.png"
                  : index == 2
                  ? "/image/rank-3.png"
                  : ""
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${index == 0 ? "60px" : "40px"}`,
              backgroundPosition: "0 50%",
              fontSize: `${index == 0 ? "1.5em" : index < 3 ? "1.2em" : "1em"}`,
            }}>
            <span style={{ width: "30%", minWidth: "200px" }}>
              <b>
                {index > 2 && index + ". "}
                {item.properties.Name.title[0].text.content}
              </b>{" "}
              님{" "}
            </span>
            <span>{item.properties.Score.number} 점</span>
          </li>
        );
      })}
    </ol>
  );
}
