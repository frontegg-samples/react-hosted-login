import { useState } from "react";
import validateDeviceCode from "../utils/validateDeviceCode";

interface VerifyDeviceModalProps {
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const VerifyDeviceModal = ({ onClose, onSubmit }: VerifyDeviceModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const validationError = validateDeviceCode(code);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit(code.trim().toUpperCase());
    onClose();
  };

  const handleClose = () => {
    setCode("");
    setError("");
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop" onClick={handleClose} />
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Verify Device</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <img src="/icons/close.svg" alt="Close" />
          </button>
        </div>

        <p className="modal-description">
          Enter the code displayed on your device to authorize it.
        </p>

        <label className="modal-label">Device Code</label>
        <input
          className={`modal-input ${error ? "modal-input-error" : ""}`}
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="XXXX-XXXX"
        />
        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button className="secondary-button" onClick={handleClose}>
            Cancel
          </button>
          <button className="secondary-button" onClick={handleClose}>
            x
          </button>
          <button className="primary-button" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default VerifyDeviceModal;