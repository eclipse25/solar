import { useState } from 'react';

interface SendModalProps {
  onClose: () => void;
  onSend: (data: { lat: number; lng: number; distance: number; message: string }) => void;
}

export default function SendModal({ onClose, onSend }: SendModalProps) {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [distance, setDistance] = useState(1000);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSend({ lat, lng, distance, message });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'black',
        color: 'white',
        padding: 24,
        border: '1px solid white',
        borderRadius: 12,
        zIndex: 1000,
        width: 420,
        boxShadow: '0 0 20px rgba(255,255,255,0.2)',
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Send Message</h2>

      <div style={rowStyle}>
        <label style={labelStyle}>Latitude</label>
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(Number(e.target.value))}
          style={inputStyle}
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Longitude</label>
        <input
          type="number"
          value={lng}
          onChange={(e) => setLng(Number(e.target.value))}
          style={inputStyle}
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Distance</label>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          style={inputStyle}
        />
      </div>

      <div style={{ ...rowStyle, alignItems: 'flex-start' }}>
        <label style={labelStyle}>Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{
            ...inputStyle,
            resize: 'none',
            fontFamily: 'inherit',
            fontSize: '14px',
            padding: '8px',
            height: '100px',
          }}
        />
      </div>

      <div style={{ textAlign: 'right', marginTop: 20 }}>
        <button onClick={handleSend} style={buttonStyle}>Send</button>
        <button onClick={onClose} style={{ ...buttonStyle, marginLeft: 10 }}>Cancel</button>
      </div>
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 12,
};

const labelStyle: React.CSSProperties = {
  minWidth: '80px',
  marginRight: '10px',
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: 'black',
  color: 'white',
  border: '1px solid white',
  borderRadius: 4,
  padding: '6px 10px',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: 'white',
  color: 'black',
  border: 'none',
  padding: '6px 12px',
  borderRadius: 4,
  cursor: 'pointer',
};
