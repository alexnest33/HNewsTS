import { getDomain } from "../../utils/getDomain";
import { timeAgo } from "../../utils/timeAgo";

type NewsItem = {
  id: number;
  title: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  url?: string;
};

type Props = {
  item: NewsItem;
  onOpenDetails: (id: number) => void;
  onSelectFrom: (domain: string) => void;
};

export const NewsListItem = ({ item, onOpenDetails, onSelectFrom }: Props) => {
  const domain = getDomain(item.url);
  const comments = item.descendants;

  return (
    <li className="hn-item">
      <div className="hn-itemTitleRow">
        <button className="hn-itemTitle" onClick={() => onOpenDetails(item.id)}>
          {item.title}
        </button>

        {domain && item.url && (
          <button
            className="hn-domain"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectFrom(domain);
            }}
            title={`from ${domain}`}
          >
            ({domain})
          </button>
        )}
      </div>

      <div className="hn-meta">
        <span>{item.score} points</span>
        <span className="hn-metaSep">by {item.by}</span>
        <span className="hn-metaSep">{timeAgo(item.time)}</span>
        <span className="hn-metaSep">|</span>

        <button className="hn-comments" onClick={() => onOpenDetails(item.id)}>
          {comments === 0
            ? "discuss"
            : `${comments} comment${comments === 1 ? "" : "s"}`}
        </button>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="hn-source"
            onClick={(e) => e.stopPropagation()}
          >
            source
          </a>
        )}
      </div>
    </li>
  );
};
