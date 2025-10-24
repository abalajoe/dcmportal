import React from "react";

const ConfirmModal = ({  data,show, onClose, onConfirm, onWaive, onDeny }) => {
  if (!show) {
    return null;
  }

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h2>Debit Customer Account</h2>
        <p>{data.description}</p>
        <p>Are you sure you want to proceed with the transaction?</p>
        <div style={buttonContainerStyle}>
          <button onClick={onConfirm} style={confirmButtonStyle}>Accept</button>
          <button onClick={onWaive} style={waiveButtonStyle}>Waive</button> 
          <button onClick={onDeny} style={denyButtonStyle}>Deny</button>
        </div>
      </div>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "5px",
  width: "300px",
  textAlign: "center",
};

const waiveButtonStyle = {
  backgroundColor: 'yellow',
  color: 'black',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '0 10px',
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "20px",
};

const confirmButtonStyle = {
  backgroundColor: "green",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
};

const denyButtonStyle = {
  backgroundColor: "red",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
};

export default ConfirmModal;
