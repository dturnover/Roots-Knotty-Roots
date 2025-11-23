

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Alphabet from "./components/Alphabet";
import ResultsTable from "./components/ResultsTable";
import Pager from "./components/Pager";
import { getRecords, getIndex } from "./api/client";

const PAGE_SIZE = 50; // drop to 25 if you want it snappier

export default function App() {
  const [category, setCategory] = useState(null);   // {label, value} or null
  const [letter, setLetter] = useState("A");        // "A".."Z" or "#"
  const [page, setPage] = useState(1);

  // Filters
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [genre, setGenre] = useState("");
  const [hasBside, setHasBside] = useState(false);

  const [data, setData] = useState({ total_count: 0, records: [] });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const year_range = buildYearRange(yearMin, yearMax);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const skip = (page - 1) * PAGE_SIZE;
        const limit = PAGE_SIZE;

        const extra = {};
        if (year_range) extra.year_range = year_range;
        if (genre.trim()) extra.genre = genre.trim();
        if (hasBside) extra.has_b_side = true;

        const res = category
          ? await getIndex({ column: category.value, letter, skip, limit, ...extra })
          : await getRecords({ skip, limit, ...extra });

        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setErr(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [category, letter, page, year_range, genre, hasBside]);

  const totalPages = Math.max(1, Math.ceil((data?.total_count || 0) / PAGE_SIZE));

  return (
    <div className="app">
      <Sidebar
        current={category}
        onSelect={(c) => {
          setCategory(c);
          setLetter("A");
          setPage(1);
        }}
      />
      <main style={{ padding: 16 }}>
        <h1>Roots-Knotty-Roots</h1>

        <TopBar
          category={category}
          total={data?.total_count ?? 0}
          letter={letter}
          onLetter={(L) => { setLetter(L); setPage(1); }}
        />

        <Filters
          yearMin={yearMin} yearMax={yearMax}
          onYearMin={(v) => { setYearMin(v); setPage(1); }}
          onYearMax={(v) => { setYearMax(v); setPage(1); }}
          genre={genre} onGenre={(v) => { setGenre(v); setPage(1); }}
          hasBside={hasBside} onHasBside={(v) => { setHasBside(v); setPage(1); }}
        />

        {err && <p style={{ color: "salmon" }}>{err}</p>}
        {loading ? <p className="muted">Loading…</p> : <ResultsTable rows={data.records} />}

        <Pager page={page} total={totalPages} onChange={setPage} />
      </main>
    </div>
  );
}

function TopBar({ category, total, letter, onLetter }) {
  return (
    <>
      <div className="row">
        <div className="badge">
          <span className="dot" />
          {category ? `Category: ${category.label}` : "All Records"}
        </div>
        <div className="muted">Total: {total}</div>
      </div>

      {category && (
        <Alphabet value={letter} onPick={onLetter} />
      )}
    </>
  );
}

function Filters({ yearMin, yearMax, onYearMin, onYearMax, genre, onGenre, hasBside, onHasBside }) {
  return (
    <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
      <input
        placeholder="Year min (e.g., 1960)"
        value={yearMin}
        onChange={(e) => onYearMin(e.target.value.replace(/\D/g, "").slice(0, 4))}
        style={inputStyle}
      />
      <input
        placeholder="Year max (e.g., 1979)"
        value={yearMax}
        onChange={(e) => onYearMax(e.target.value.replace(/\D/g, "").slice(0, 4))}
        style={inputStyle}
      />
      <input
        placeholder="Genre contains…"
        value={genre}
        onChange={(e) => onGenre(e.target.value)}
        style={{ ...inputStyle, minWidth: 180 }}
      />
      <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={hasBside}
          onChange={(e) => onHasBside(e.target.checked)}
        />
        Has B-side
      </label>
    </div>
  );
}

const inputStyle = {
  padding: 8,
  borderRadius: 8,
  border: "1px solid var(--line)",
  background: "var(--chip)",
  color: "var(--text)",
};

function buildYearRange(min, max) {
  const a = (min || "").trim();
  const b = (max || "").trim();
  if (!a && !b) return "";
  const s = a && a.length === 4 ? a : "0000";
  const e = b && b.length === 4 ? b : "9999";
  return `${s}-${e}`;
}
