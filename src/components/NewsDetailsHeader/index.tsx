type Props = {
  onBack: () => void;
  onRefreshComments: () => void;
  isRefreshing: boolean;
};

export const NewsDetailsHeader = ({
  onBack,
  onRefreshComments,
  isRefreshing,
}: Props) => {
  return (
    <div className="nd-topbar">
      <button className="nd-backBtn" onClick={onBack}>
        ← Назад
      </button>

      <button
        className="nd-refreshBtn"
        onClick={onRefreshComments}
        disabled={isRefreshing}
      >
        {isRefreshing ? "Обновляю..." : "Обновить комментарии"}
      </button>
    </div>
  );
};
