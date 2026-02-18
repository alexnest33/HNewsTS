import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { detailsNewsById, fetchRootComments } from "../../rtk/slices/newsDetailsSlice";
import { CommentsTree } from "../../components/CommentsTree";
import { NewsDetailsHeader } from "../../components/NewsDetailsHeader";
import { NewsDetailsMeta } from "../../components/NewsDetailsMeta";
import { AddCommentBox } from "../../components/AddCommentBox";

export const NewsDetailsPage = () => {
  const { id } = useParams();
  const newsId = Number(id);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { item, status, error, rootStatus } = useAppSelector((s) => s.details);

  useEffect(() => {
    if (!id || Number.isNaN(newsId)) return;
    dispatch(detailsNewsById(newsId));
  }, [dispatch, id, newsId]);

  useEffect(() => {
    if (!item) return;
    dispatch(fetchRootComments(item.kids ?? []));
  }, [dispatch, item?.id]);

  const onBack = () => navigate("/");

  const onRefreshComments = () => {
    dispatch(fetchRootComments(item?.kids ?? []));
  };

  const onSubmitComment = () => {
    alert(
      "Отправка комментариев через API Hacker News не поддерживается без авторизации на сайте."
    );
  };

  if (!id || Number.isNaN(newsId)) {
    return (
      <div className="nd-page">
        Некорректный id. <button className="nd-backBtn" onClick={onBack}>Назад</button>
      </div>
    );
  }

  if (status === "loading" && !item) {
    return <div className="nd-page">Загрузка новости...</div>;
  }

  if (status === "failed") {
    return (
      <div className="nd-page">
        Ошибка: {error ?? "Неизвестная ошибка"}{" "}
        <button className="nd-backBtn" onClick={onBack}>Назад</button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="nd-page">
        Нет данных. <button className="nd-backBtn" onClick={onBack}>Назад</button>
      </div>
    );
  }

  return (
    <div className="nd-page">
      <NewsDetailsHeader
        onBack={onBack}
        onRefreshComments={onRefreshComments}
        isRefreshing={rootStatus === "loading"}
      />

      <h2 className="nd-title">{item.title}</h2>

      <NewsDetailsMeta
        author={item.by}
        time={item.time}
        commentsCount={item.descendants ?? 0}
      />

      {item.url && (
        <div className="nd-linkWrap">
          <a className="nd-link" href={item.url} target="_blank" rel="noreferrer">
            Открыть новость
          </a>
        </div>
      )}

      <h3 className="nd-sectionTitle">Комментарии</h3>
      <CommentsTree />

      <AddCommentBox onSubmit={onSubmitComment} />
    </div>
  );
};

export default NewsDetailsPage;
