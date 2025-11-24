



export default function Pager({ page, total, onChange }) {
  return (
    <div className="pager">
      <button disabled={page<=1} onClick={() => onChange(page-1)}>Prev</button>
      <span className="muted">{page} / {total || 1}</span>
      <button disabled={page>=total} onClick={() => onChange(page+1)}>Next</button>
    </div>
  );
}
