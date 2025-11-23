
import { CATEGORIES } from "../constants/categories";

export default function Sidebar({ current, onSelect }) {
  return (
    <aside>
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          className={`btn ${current?.value === cat.value ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat.label}
        </button>
      ))}
    </aside>
  );
}
