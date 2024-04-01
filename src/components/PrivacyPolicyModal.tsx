import React from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, htmlContent }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="pp-modal-content">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <button onClick={onClose}>Acknowledge</button>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
