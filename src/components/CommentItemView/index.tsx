import { useState } from "react";
import type { CommentItem } from "../../rtk/slices/newsDetailsSlice";
import { fetchChildComments } from "../../rtk/slices/newsDetailsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { formatDate } from "../../utils/formatDate";

type Props = {
  comment: CommentItem;
  level?: number;
};

export const CommentItemView = ({ comment, level = 0 }: Props) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const { childrenByParent, childrenStatusByParent } = useAppSelector(
    (s) => s.details
  );

  const children = childrenByParent[comment.id];
  const childrenStatus = childrenStatusByParent[comment.id];

  const onToggleChildren = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    if (children) {
      setIsOpen(true);
      return;
    }

    dispatch(fetchChildComments({ parentId: comment.id, kids: comment.kids }));
    setIsOpen(true);
  };

  const leftPadding = Math.min(level * 16, 80);

  return (
    <li className="cmt-item" style={{ marginLeft: leftPadding }}>
      <div className="cmt-head">
        <span>👤 {comment.by}</span>
        <span className="cmt-headSep">🕒 {formatDate(comment.time)}</span>
      </div>

      <div
        className="cmt-text"
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />

      {comment.kids.length > 0 && (
        <div className="cmt-actions">
          <button
            className="cmt-toggle"
            onClick={onToggleChildren}
            disabled={childrenStatus === "loading"}
          >
            {childrenStatus === "loading"
              ? "Загрузка..."
              : isOpen
              ? `Скрыть ответы (${comment.kids.length})`
              : `Показать ответы (${comment.kids.length})`}
          </button>
        </div>
      )}

      {isOpen && children && children.length > 0 && (
        <ul className="cmt-children">
          {children.map((child) => (
            <CommentItemView
              key={child.id}
              comment={child}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
