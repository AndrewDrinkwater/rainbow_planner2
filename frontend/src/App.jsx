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
    <div className="container">
      <h1>Girls</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn">Add</button>
      </form>

      <table className="girls-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {girls.map((g) =>
            editingId === g.id ? (
              <tr key={g.id}>
                <td>
                  <input
                    placeholder="First name"
                    value={editForm.first_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, first_name: e.target.value })
                    }
                    required
                  />
                </td>
                <td>
                  <input
                    placeholder="Last name"
                    value={editForm.last_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                    required
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={editForm.date_of_birth}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        date_of_birth: e.target.value,
                      })
                    }
                    required
                  />
                </td>
                <td>
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
                </td>
                <td className="actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => saveEdit(g.id)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={g.id}>
                <td>{g.first_name}</td>
                <td>{g.last_name}</td>
                <td>{g.date_of_birth}</td>
                <td>{g.state}</td>
                <td className="actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => viewRecord(g.id)}
                  >
                    Record
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => startEdit(g)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteGirl(g.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {record && (
        <div className="record-card">
          <h2>
            Record for {record.first_name} {record.last_name}
          </h2>
          <p>Date of Birth: {record.date_of_birth}</p>
          <p>State: {record.state}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setRecord(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
