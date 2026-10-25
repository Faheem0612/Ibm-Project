import { useEffect, useState } from "react";

export const price = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function Bikes() {
  const [bikes, setBikes] = useState(null);
  const [type, setType] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/bikes")
      .then((r) => r.json())
      .then(setBikes)
      .catch(() => setError("Couldn’t load bikes. Check that the server is running."));
  }, []);

  if (error) return <p className="note">{error}</p>;
  if (!bikes) return <p className="note">Loading bikes…</p>;

  const types = ["All", ...new Set(bikes.map((b) => b.type))];
  const shown = type === "All" ? bikes : bikes.filter((b) => b.type === type);

  return (
    <section>
      <h1>Bikes for sale</h1>
      <div className="filters">
        {types.map((t) => (
          <button key={t} className={t === type ? "chip on" : "chip"} onClick={() => setType(t)}>
            {t}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="note">No bikes listed yet. An admin can add one from the Admin tab.</p>
      ) : (
        <div className="grid">
          {shown.map((b) => (
            <article className="bike" key={b._id}>
              <div className="photo">
                {b.imageUrl ? <img src={b.imageUrl} alt={b.name} /> : <span>No photo</span>}
              </div>
              <div className="info">
                <p className="brand">{b.brand} · {b.type}</p>
                <h2>{b.name}</h2>
                {b.description && <p className="desc">{b.description}</p>}
                <p className="price">{price(b.price)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
