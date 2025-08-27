import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [girls, setGirls] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    state: "Member",
  });

  // Load data on mount
  useEffect(() => {
    loadGirls();
  }, []);

  async function loadGirls() {
    const res = await axios.get("/api/girls");
    setGirls(res.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post("/api/girls", form);
    setForm({ first_name: "", last_name: "", date_of_birth: "", state: "Member" });
    loadGirls();
  }

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Girls</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="First name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.date_of_birth}
          onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
          required
        />
        <select
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        >
          <option>Registered</option>
          <option>Approved</option>
          <option>Member</option>
          <option>Leaver</option>
          <option>Left</option>
          <option>Rejected</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <ul>
        {girls.map((g) => (
          <li key={g.id}>
            {g.first_name} {g.last_name} — {g.date_of_birth} ({g.state})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
