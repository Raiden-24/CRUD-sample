export default function EquipmentTable({ items, onEdit, onDelete }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Type</th>
          <th>Status</th>
          <th>Last Cleaned</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan="6" className="empty">
              No equipment yet
            </td>
          </tr>
        ) : (
          items.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.type}</td>
              <td>{e.status}</td>
              <td>{e.lastCleanedDate}</td>
              <td>
                <button onClick={() => onEdit(e)}>Edit</button>
                <button className="danger" onClick={() => onDelete(e)}>
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

