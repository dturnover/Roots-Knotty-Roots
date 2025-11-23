
import { useState } from "react";

export default function ResultsTable({ rows }) {
  const [open, setOpen] = useState(() => new Set());
  if (!rows?.length) return <p className="muted">No results</p>;

  const toggle = (id) => {
    const n = new Set(open);
    n.has(id) ? n.delete(id) : n.add(id);
    setOpen(n);
  };

  const dash = (v) => {
    const s = v == null ? "" : String(v).trim();
    return s.length ? s : "—";
  };

  const prettyLabel = (k) => ({
    id: "ID",
    artist: "Artist",
    artist_credit: "Artist Credit",
    title: "Title",
    title_credit: "Title Credit",
    matrix_number: "Matrix #",
    format: "Format",
    country: "Country",
    label: "Label",
    label_number: "Label #",
    producer: "Producer",
    year: "Year",
    riddim: "Riddim",
    version: "Version",
    b_side_artist: "B-side Artist",
    b_side_artist_credit: "B-side Artist Credit",
    b_side_title: "B-side Title",
    b_side_title_credit: "B-side Title Credit",
    b_side_matrix_number: "B-side Matrix #",
    b_side_label_number: "B-side Label #",
    song_origin: "Origin",
    notes: "Notes",
    genre: "Genre",
    aadditions: "Additions",
  }[k] || k);

  const baseCols = ["", "artist", "title", "label", "producer", "country", "year"];

  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: 40 }}></th>
          <th>Artist</th>
          <th>Title</th>
          <th>Label</th>
          <th>Producer</th>
          <th>Country</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const isOpen = open.has(r.id);
          return (
            <FragmentRow
              key={r.id}
              r={r}
              isOpen={isOpen}
              onToggle={() => toggle(r.id)}
              dash={dash}
              prettyLabel={prettyLabel}
              baseCols={baseCols}
            />
          );
        })}
      </tbody>
    </table>
  );
}

function FragmentRow({ r, isOpen, onToggle, dash, prettyLabel, baseCols }) {
  // Everything except base table columns + id goes in the details panel
  const exclude = new Set(["id", "artist", "title", "label", "label_number", "producer", "country", "year"]);
  const entries = Object.entries(r)
    .filter(([k, v]) => !exclude.has(k) && String(v ?? "").trim().length)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <tr>
        <td>
          <button className="rowbtn" onClick={onToggle} aria-expanded={isOpen}>
            <span className={`chev ${isOpen ? "open" : ""}`}>▶</span>
          </button>
        </td>
        <td>{dash(r.artist)}</td>
        <td>{dash(r.title)}</td>
        <td>{r.label || r.label_number || "—"}</td>
        <td>{dash(r.producer)}</td>
        <td>{dash(r.country)}</td>
        <td>{dash(r.year)}</td>
      </tr>
      {isOpen && (
        <tr className="details">
          <td colSpan={7}>
            <div className="details-inner">
              {/* Show label_number explicitly if label missing */}
              {!r.label && r.label_number && (
                <div className="kv"><b>Label #</b><span>{r.label_number}</span></div>
              )}
              {entries.map(([k, v]) => (
                <div className="kv" key={k}><b>{prettyLabel(k)}</b><span>{String(v)}</span></div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
