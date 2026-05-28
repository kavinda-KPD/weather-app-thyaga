import { useState } from 'react';
import './AddCity.css';

interface Props {
  onAdd: (cityName: string) => Promise<void>;
}

export default function AddCity({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    try {
      await onAdd(trimmed);
      setValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'City not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-city-wrapper">
      <div className="add-city-bar">
        <input
          className="add-city-input"
          type="text"
          placeholder="Add a city… (e.g. Paris, Colombo)"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={loading}
        />
        <button
          className="add-city-btn"
          onClick={handleSubmit}
          disabled={loading || !value.trim()}
        >
          {loading ? <span className="spinner" /> : '+ Add'}
        </button>
      </div>
      {error && <p className="add-city-error">{error}</p>}
    </div>
  );
}
