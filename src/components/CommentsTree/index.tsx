import { useAppSelector } from "../../hooks/hooks";
import { CommentItemView } from "../CommentItemView";

export const CommentsTree = () => {
  const { rootComments, rootStatus, rootError } = useAppSelector(
    (s) => s.details
  );

  if (rootStatus === "loading" && rootComments.length === 0) {
    return <div>Загрузка комментариев...</div>;
  }

  if (rootStatus === "failed") {
    return (
      <div style={{ color: "crimson" }}>
        Ошибка: {rootError ?? "Неизвестная ошибка"}
      </div>
    );
  }

  if (rootStatus === "succeeded" && rootComments.length === 0) {
    return <div>Комментариев нет</div>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {rootComments.map((c) => (
        <CommentItemView key={c.id} comment={c} />
      ))}
    </ul>
  );
};