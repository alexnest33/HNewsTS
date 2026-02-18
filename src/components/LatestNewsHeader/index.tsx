type Feed =
  | "top"
  | "new"
  | "best"
  | "ask"
  | "show"
  | "jobs"
  | "from";

type Props = {
  feed: Feed;
  setFeed: (f: Feed) => void;
  fromSite: string | null;
  onOpenFrom: () => void;
  onRefresh: () => void;
  disableRefresh: boolean;
  isLoading: boolean;
  lastUpdated: number | null;
};

export const LatestNewsHeader = ({
  feed,
  setFeed,
  fromSite,
  onOpenFrom,
  onRefresh,
  disableRefresh,
  isLoading,
  lastUpdated,
}: Props) => {
  return (
    <div className="hn-header">
      <div className="hn-title">Hacker News</div>

      <div className="hn-nav">
        {(["top", "new", "best", "ask", "show", "jobs"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFeed(f)}
            className={`hn-navItem ${f === feed ? "hn-navItem--active" : ""}`}
          >
            {f}
          </button>
        ))}

        {fromSite && (
          <button
            onClick={() => {
              setFeed("from");
              onOpenFrom();
            }}
            className={`hn-navItem ${feed === "from" ? "hn-navItem--active" : ""}`}
            title={`from ${fromSite}`}
          >
            from
          </button>
        )}

        <a
          href="https://news.ycombinator.com/submit"
          target="_blank"
          rel="noreferrer"
          className="hn-navItem hn-navLink"
        >
          submit
        </a>
      </div>

      <button
        onClick={onRefresh}
        disabled={disableRefresh}
        className="hn-refresh"
      >
        {isLoading ? "Refreshing..." : "Refresh"}
      </button>

      {lastUpdated && (
        <span className="hn-updated">
          updated: {new Date(lastUpdated).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
