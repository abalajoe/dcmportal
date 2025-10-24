import React from "react";

const ModalComponent = ({ data, show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h2>{data.title}</h2>
        <p>{data.description}</p>
        <button onClick={onClose}>Close</button>
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

export default ModalComponent;
