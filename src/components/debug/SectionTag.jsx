export default function SectionTag({ activeId }) {
  if (!activeId) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: '15px',
      right: '15px',
      background: '#000',
      color: '#FFD700',
      padding: '6px 10px',
      fontSize: '16px',
      fontWeight: 'bold',
      zIndex: 1000000,
      border: '2px solid #FFD700',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      pointerEvents: 'none',
    }}>
      {'#' + activeId}
    </div>
  );
}