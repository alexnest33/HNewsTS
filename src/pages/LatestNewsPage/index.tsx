import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { latestNews } from "../../rtk/slices/latestNewsSlice";
import { useNavigate } from "react-router";
import { LatestNewsHeader } from "../../components/LatestNewsHeader";
import { NewsListItem } from "../../components/NewsListItem";

type Feed =
  | "top"
  | "new"
  | "best"
  | "ask"
  | "show"
  | "jobs"
  | "from";

export const LatestNewsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [feed, setFeed] = useState<Feed>("top");
  const [fromSite, setFromSite] = useState<string | null>(null);

  const { items, status, error, lastUpdated } = useAppSelector(
    (state) => state.lastNews
  );

  useEffect(() => {
    if (feed === "from") return;
    dispatch(latestNews({ feed }));
  }, [dispatch, feed]);

  const onRefresh = () => {
    if (feed === "from") return;
    dispatch(latestNews({ feed }));
  };

const openFromPage = () => {
  if (!fromSite) return;
  window.open(`https://news.ycombinator.com/from?site=${fromSite}`, "_blank");
};


  const onOpenDetails = (id: number) => {
    navigate(`/news/${id}`);
  };

  const onSelectFrom = (domain: string) => {
    setFromSite(domain);
    setFeed("from");
    openFromPage();
  };

  return (
    <div className="hn-page">
      <LatestNewsHeader
        feed={feed}
        setFeed={setFeed}
        fromSite={fromSite}
        onOpenFrom={openFromPage}
        onRefresh={onRefresh}
        disableRefresh={status === "loading" || feed === "from"}
        isLoading={status === "loading"}
        lastUpdated={lastUpdated}
      />

      {feed === "from" && fromSite && (
        <div style={{ marginTop: 12 }}>
          from: <b>{fromSite}</b>{" "}
          <button className="hn-comments" onClick={openFromPage}>
            open on Hacker News
          </button>
        </div>
      )}

      {status === "failed" && (
        <div className="hn-error">Error: {error ?? "Unknown error"}</div>
      )}

      {status === "loading" && items.length === 0 && feed !== "from" && (
        <div className="hn-loading">Loading...</div>
      )}

      {feed !== "from" && (
        <ol className="hn-list">
          {items.map((item) => (
            <NewsListItem
              key={item.id}
              item={item}
              onOpenDetails={onOpenDetails}
              onSelectFrom={onSelectFrom}
            />
          ))}
        </ol>
      )}
    </div>
  );
};
