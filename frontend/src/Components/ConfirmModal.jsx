import React from 'react';

export default function ConfirmModal({ 
  show, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger', 'warning', 'info'
}) {
  if (!show) return null;

  const getColors = () => {
    switch(type) {
      case 'danger':
        return {
          icon: '⚠️',
          confirmBg: 'linear-gradient(135deg, #ff6b35, #e85d2a)',
          confirmHover: 'rgba(255, 107, 53, 0.4)'
        };
      case 'warning':
        return {
          icon: '⚡',
          confirmBg: 'linear-gradient(135deg, #ffc107, #ff9800)',
          confirmHover: 'rgba(255, 193, 7, 0.4)'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          confirmBg: 'linear-gradient(135deg, #6496ff, #4a7adf)',
          confirmHover: 'rgba(100, 150, 255, 0.4)'
        };
      default:
        return {
          icon: '⚠️',
          confirmBg: 'linear-gradient(135deg, #ff6b35, #e85d2a)',
          confirmHover: 'rgba(255, 107, 53, 0.4)'
        };
    }
  };

  const colors = getColors();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        .confirm-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.2s ease; font-family: 'Cairo', sans-serif; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .confirm-dialog { background: #2a2a2a; border-radius: 20px; padding: 2rem; max-width: 450px; width: 90%; border: 1px solid rgba(244, 237, 216, 0.1); animation: scaleIn 0.3s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .confirm-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        
        .confirm-icon { width: 50px; height: 50px; background: rgba(255, 107, 53, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }
        
        .confirm-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #f4edd8; letter-spacing: 1px; }
        
        .confirm-message { color: #ccc; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; }
        
        .confirm-actions { display: flex; gap: 1rem; }
        
        .confirm-btn { flex: 1; padding: 0.9rem; border: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; }
        
        .confirm-btn-cancel { background: rgba(153, 153, 153, 0.1); color: #999; border: 2px solid rgba(153, 153, 153, 0.3); }
        
        .confirm-btn-cancel:hover { background: rgba(153, 153, 153, 0.2); border-color: #999; }
        
        .confirm-btn-confirm { background: ${colors.confirmBg}; color: white; box-shadow: 0 4px 15px ${colors.confirmHover}; }
        
        .confirm-btn-confirm:hover { transform: translateY(-2px); box-shadow: 0 6px 20px ${colors.confirmHover}; }
        
        .confirm-btn:active { transform: translateY(0); }
      `}</style>

      <div className="confirm-overlay" onClick={onClose}>
        <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="confirm-header">
            <div className="confirm-icon">{colors.icon}</div>
            <div className="confirm-title">{title}</div>
          </div>
          
          <div className="confirm-message">{message}</div>
          
          <div className="confirm-actions">
            <button className="confirm-btn confirm-btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
            <button className="confirm-btn confirm-btn-confirm" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}