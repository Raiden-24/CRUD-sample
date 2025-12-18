import { useEffect, useState } from 'react';

const TYPES = ['Machine', 'Vessel', 'Tank', 'Mixer'];
const STATUS = ['Active', 'Inactive', 'Under Maintenance'];

export default function EquipmentForm({ initial, onCancel, onSave }) {
  const [values, setValues] = useState({
    name: '',
    type: TYPES[0],
    status: STATUS[0],
    lastCleanedDate: '',
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (initial) {
      setValues({
        name: initial.name || '',
        type: initial.type || TYPES[0],
        status: initial.status || STATUS[0],
        lastCleanedDate: initial.lastCleanedDate || '',
      });
    }
  }, [initial]);

  function validate(v) {
    const errs = [];
    if (!v.name.trim()) errs.push('Name is required');
    if (!TYPES.includes(v.type)) errs.push('Type is invalid');
    if (!STATUS.includes(v.status)) errs.push('Status is invalid');
    if (!v.lastCleanedDate) errs.push('Last Cleaned Date is required');
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (errs.length === 0) {
      onSave(values);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Name</label>
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Equipment name"
        />
      </div>
      <div className="form-row">
        <label>Type</label>
        <select name="type" value={values.type} onChange={handleChange}>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label>Status</label>
        <select name="status" value={values.status} onChange={handleChange}>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label>Last Cleaned Date</label>
        <input
          type="date"
          name="lastCleanedDate"
          value={values.lastCleanedDate}
          onChange={handleChange}
        />
      </div>
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((e, i) => (
            <div key={i} className="error">
              {e}
            </div>
          ))}
        </div>
      )}
      <div className="form-actions">
        <button type="submit">{initial ? 'Update' : 'Add'}</button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

