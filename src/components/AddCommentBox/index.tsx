type Props = {
  onSubmit: () => void;
};

export const AddCommentBox = ({ onSubmit }: Props) => {
  return (
    <div className="nd-addComment">
      <h3 className="nd-sectionTitle">Add comment</h3>

      <textarea className="nd-textarea" placeholder="Write a comment..." />

      <div className="nd-addCommentActions">
        <button className="nd-addBtn" onClick={onSubmit}>
          Add comment
        </button>
      </div>
    </div>
  );
};
