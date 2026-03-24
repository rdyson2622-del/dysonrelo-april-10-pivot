export default function SectionTag({ currentId }) {
  if (!currentId) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#000',
      color: '#FFD700',
      padding: '4px 8px',
      fontSize: '14px',
      fontWeight: 'bold',
      zIndex: 999999,
      border: '1px solid #FFD700',
      borderRadius: '4px',
      pointerEvents: 'none',
    }}>
      #{currentId}
    </div>
  );
}