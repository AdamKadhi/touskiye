import React from 'react';

// SVG Icons
const AlertTriangleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const ZapIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const InfoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

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

  const getConfig = () => {
    switch(type) {
      case 'danger':
        return {
          icon: <AlertTriangleIcon />,
          iconBg: 'rgba(231, 76, 60, 0.1)',
          iconColor: '#E74C3C',
          confirmBg: 'linear-gradient(135deg, #E74C3C, #C0392B)',
          confirmShadow: 'rgba(231, 76, 60, 0.3)'
        };
      case 'warning':
        return {
          icon: <ZapIcon />,
          iconBg: 'rgba(243, 156, 18, 0.1)',
          iconColor: '#F39C12',
          confirmBg: 'linear-gradient(135deg, #F39C12, #E67E22)',
          confirmShadow: 'rgba(243, 156, 18, 0.3)'
        };
      case 'info':
        return {
          icon: <InfoIcon />,
          iconBg: 'rgba(93, 173, 226, 0.1)',
          iconColor: '#5DADE2',
          confirmBg: 'linear-gradient(135deg, #5DADE2, #3498DB)',
          confirmShadow: 'rgba(93, 173, 226, 0.3)'
        };
      default:
        return {
          icon: <AlertTriangleIcon />,
          iconBg: 'rgba(231, 76, 60, 0.1)',
          iconColor: '#E74C3C',
          confirmBg: 'linear-gradient(135deg, #E74C3C, #C0392B)',
          confirmShadow: 'rgba(231, 76, 60, 0.3)'
        };
    }
  };

  const config = getConfig();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');
        
        /* Overlay */
        .confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(44, 62, 80, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Dialog */
        .confirm-dialog {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 2rem;
          max-width: 450px;
          width: 90%;
          border: 1px solid #E9ECEF;
          animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 20px 60px rgba(44, 62, 80, 0.2);
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Header */
        .confirm-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .confirm-icon {
          width: 56px;
          height: 56px;
          background: ${config.iconBg};
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${config.iconColor};
          flex-shrink: 0;
        }
        
        .confirm-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2C3E50;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        
        /* Message */
        .confirm-message {
          color: #6C757D;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        
        /* Actions */
        .confirm-actions {
          display: flex;
          gap: 1rem;
        }
        
        .confirm-btn {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }
        
        /* Cancel Button */
        .confirm-btn-cancel {
          background: #F1F3F5;
          color: #6C757D;
          border: 2px solid #E9ECEF;
        }
        
        .confirm-btn-cancel:hover {
          background: #E9ECEF;
          border-color: #ADB5BD;
          color: #2C3E50;
        }
        
        /* Confirm Button */
        .confirm-btn-confirm {
          background: ${config.confirmBg};
          color: white;
          box-shadow: 0 4px 15px ${config.confirmShadow};
          border: none;
        }
        
        .confirm-btn-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px ${config.confirmShadow};
        }
        
        .confirm-btn:active {
          transform: translateY(0);
        }
        
        /* Responsive */
        @media (max-width: 480px) {
          .confirm-dialog {
            padding: 1.5rem;
          }
          
          .confirm-title {
            font-size: 1.25rem;
          }
          
          .confirm-icon {
            width: 48px;
            height: 48px;
          }
          
          .confirm-actions {
            flex-direction: column;
          }
          
          .confirm-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="confirm-overlay" onClick={onClose}>
        <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="confirm-header">
            <div className="confirm-icon">{config.icon}</div>
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