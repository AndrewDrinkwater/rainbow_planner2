import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const empty = {
    first_name: "",
    last_name: "",
    date_of_birth: "",
    state: "Member",
  };

  const [girls, setGirls] = useState([]);
  const [form, setForm] = useState({ ...empty });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ ...empty });
  const [record, setRecord] = useState(null);

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
    setForm({ ...empty });
    loadGirls();
  }

  function startEdit(g) {
    setEditingId(g.id);
    setEditForm({
      first_name: g.first_name,
      last_name: g.last_name,
      date_of_birth: g.date_of_birth,
      state: g.state,
    });
  }

  async function saveEdit(id) {
    await axios.patch(`/api/girls/${id}`, editForm);
    setEditingId(null);
    setEditForm({ ...empty });
    loadGirls();
  }

  async function deleteGirl(id) {
    await axios.delete(`/api/girls/${id}`);
    if (record && record.id === id) setRecord(null);
    loadGirls();
  }

  async function viewRecord(id) {
    const res = await axios.get(`/api/girls/${id}`);
    setRecord(res.data);
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
            {editingId === g.id ? (
              <>
                <input
                  placeholder="First name"
                  value={editForm.first_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, first_name: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Last name"
                  value={editForm.last_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, last_name: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  value={editForm.date_of_birth}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date_of_birth: e.target.value })
                  }
                  required
                />
                <select
                  value={editForm.state}
                  onChange={(e) =>
                    setEditForm({ ...editForm, state: e.target.value })
                  }
                >
                  <option>Registered</option>
                  <option>Approved</option>
                  <option>Member</option>
                  <option>Leaver</option>
                  <option>Left</option>
                  <option>Rejected</option>
                </select>
                <button type="button" onClick={() => saveEdit(g.id)}>
                  Save
                </button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                {g.first_name} {g.last_name} — {g.date_of_birth} ({g.state})
                <button type="button" onClick={() => viewRecord(g.id)}>
                  Record
                </button>
                <button type="button" onClick={() => startEdit(g)}>
                  Edit
                </button>
                <button type="button" onClick={() => deleteGirl(g.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {record && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
            maxWidth: "400px",
          }}
        >
          <h2>
            Record for {record.first_name} {record.last_name}
          </h2>
          <p>Date of Birth: {record.date_of_birth}</p>
          <p>State: {record.state}</p>
          <button type="button" onClick={() => setRecord(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
