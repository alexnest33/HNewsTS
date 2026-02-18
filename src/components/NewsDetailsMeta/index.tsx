import { formatDate } from "../../utils/formatDate";

type Props = {
  author: string;
  time: number;
  commentsCount: number;
};

export const NewsDetailsMeta = ({ author, time, commentsCount }: Props) => {
  return (
    <div className="nd-meta">
      <span>Автор: {author}</span>
      <span className="nd-metaSep">Дата: {formatDate(time)}</span>
      <span className="nd-metaSep">Комментариев: {commentsCount}</span>
    </div>
  );
};
