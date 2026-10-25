import { useEffect, useState } from "react";
import { price } from "./Bikes.jsx";

const empty = { name: "", brand: "", type: "City", price: "", description: "", imageUrl: "" };
const TYPES = ["Road", "Mountain", "City", "Electric", "Kids"];

export default function Admin() {
  const [key, setKey] = useState(sessionStorage.getItem("adminKey") || "");
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [bikes, setBikes] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState("");

  const headers = { "Content-Type": "application/json", "x-admin-key": key };
  const load = () => fetch("/api/bikes").then((r) => r.json()).then(setBikes);

  // Verify a saved key on page load
  useEffect(() => {
    if (!key) return;
    fetch("/api/admin/check", { headers }).then((r) => {
      if (r.ok) { setAuthed(true); load(); } else { sessionStorage.removeItem("adminKey"); setKey(""); }
    });
  }, [key]);

  const login = (e) => {
    e.preventDefault();
    sessionStorage.setItem("adminKey", keyInput);
    setKey(keyInput);
    setMsg(keyInput ? "" : "Enter the admin key.");
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/bikes", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.message);
    setForm(empty);
    setMsg(`Listed “${data.name}”.`);
    load();
  };

  const remove = async (b) => {
    if (!confirm(`Remove “${b.name}” from the listing?`)) return;
    await fetch(`/api/bikes/${b._id}`, { method: "DELETE", headers });
    setMsg(`Removed “${b.name}”.`);
    load();
  };

  if (!authed) {
    return (
      <section className="narrow">
        <h1>Admin</h1>
        <form onSubmit={login} className="form">
          <label>Admin key
            <input type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
          </label>
          <button className="primary">Sign in</button>
          {key && !authed ? null : msg && <p className="note">{msg}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="admin">
      <div>
        <h1>List a bike</h1>
        <form onSubmit={add} className="form">
          <label>Name<input required value={form.name} onChange={set("name")} /></label>
          <label>Brand<input required value={form.brand} onChange={set("brand")} /></label>
          <div className="row">
            <label>Type
              <select value={form.type} onChange={set("type")}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>Price (₹)<input required type="number" min="0" value={form.price} onChange={set("price")} /></label>
          </div>
          <label>Photo link<input type="url" placeholder="https://…" value={form.imageUrl} onChange={set("imageUrl")} /></label>
          <label>Description<textarea rows="3" value={form.description} onChange={set("description")} /></label>
          <button className="primary">Publish listing</button>
          {msg && <p className="note">{msg}</p>}
        </form>
      </div>

      <div>
        <h1>Current listings ({bikes.length})</h1>
        {bikes.length === 0 && <p className="note">Nothing listed yet. Add your first bike.</p>}
        <ul className="list">
          {bikes.map((b) => (
            <li key={b._id}>
              <span><strong>{b.name}</strong><br />{b.brand} · {price(b.price)}</span>
              <button className="danger" onClick={() => remove(b)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
