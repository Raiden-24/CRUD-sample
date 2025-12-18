import { useEffect, useState } from 'react';
import EquipmentTable from './components/EquipmentTable';
import EquipmentForm from './components/EquipmentForm';
import './index.css';
import './styles.css';

function App() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const API = 'http://localhost:3001/api/equipment';

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch(API);
    const data = await res.json();
    setItems(data);
  }

  async function add(values) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = await res.json();
      alert((err.errors || [err.error]).join('\\n'));
      return;
    }
    const created = await res.json();
    setItems((prev) => [...prev, created]);
    setShowForm(false);
  }

  async function update(values) {
    const res = await fetch(`${API}/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = await res.json();
      alert((err.errors || [err.error]).join('\\n'));
      return;
    }
    const updated = await res.json();
    setItems((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditing(null);
    setShowForm(false);
  }

  async function remove(e) {
    if (!confirm(`Delete "${e.name}"?`)) return;
    const res = await fetch(`${API}/${e.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      alert((err.errors || [err.error]).join('\\n'));
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== e.id));
  }

  return (
    <div className="container">
      <h1>Equipment Tracker</h1>
      {!showForm && (
        <div className="toolbar">
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            Add Equipment
          </button>
        </div>
      )}
      {showForm ? (
        <EquipmentForm
          initial={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={(vals) => (editing ? update(vals) : add(vals))}
        />
      ) : (
        <EquipmentTable
          items={items}
          onEdit={(e) => {
            setEditing(e);
            setShowForm(true);
          }}
          onDelete={remove}
        />
      )}
    </div>
  );
}

export default App;
