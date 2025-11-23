
export default function Alphabet({ value, onPick }) {
  const letters = ["#", ...Array.from({length:26},(_,i)=>String.fromCharCode(65+i))];
  return (
    <div className="alpha">
      {letters.map(L => (
        <button
          key={L}
          className={value===L ? "active" : ""}
          onClick={() => onPick(L)}
        >
          {L}
        </button>
      ))}
    </div>
  );
}
