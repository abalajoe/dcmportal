import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
const SignatureModal = ({
  isOpen,
  onClose,
  charges,
  pages,
  currency,
  image,
  images1,
  accountNo,
  stDate,
  enDate,
  captureSignature,
  retrievedSignature,
  handleSignatureApproval,
  handleSignatureRejection,
  storedSignature,
  captureEnabled,
  retrieveEnabled,
}) => {
  const [base64Image, setBase64Image] = useState(null);
  const imageBoxRef = useRef(null);
  const [idNo, setIdNo] = useState("");
  const [image1, setImage1] = useState(null);
  const [captured, setCaptured] = useState(false);
  const [retrieved, setRetrieved] = useState(false);

  useEffect(() => {
    // Load the HTML content
    
    fetch("/SignaturePadSdk/SigCaptX-Wizard.html")
      .then((response) => response.text())
      .then((html) => console.log(html))
      .catch((error) => console.error("Error loading HTML:", error));

    // Dynamically load required scripts in order
    const scriptUrls = [
      "/SignaturePadSdk/wgssSigCaptX.js",
      "/SignaturePadSdk/base64.js",
      "/SignaturePadSdk/SigCaptX-Wizard-Main.js",
      "/SignaturePadSdk/SigCaptX-Wizard-PadDefs.js",
      "/SignaturePadSdk/SigCaptX-Utils.js",
      "/SignaturePadSdk/SigCaptX-SessionControl.js",
     //"/SignaturePadSdk/SigCaptX-Globals.js",
    ];
    
    const loadScriptsSequentially = async () => {
      for (const url of scriptUrls) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = url;
          script.async = true;
          script.onload = () => {
            console.log(`${url} loaded`);
            resolve();
          };
          script.onerror = () => {
            console.error(`Error loading script ${url}`);
            reject();
          };
          document.body.appendChild(script);
        });
      }

      // Call a method from one of the loaded scripts if needed
      if (
        window.wizardEventController &&
        window.wizardEventController.body_onload
      ) {
        window.wizardEventController.body_onload();
      }
    };

    loadScriptsSequentially();

    // Cleanup function to remove scripts
    return () => {
      scriptUrls.forEach((url) => {
        const script = document.querySelector(`script[src="${url}"]`);
        if (script) {
          document.body.removeChild(script);
        }
      });
    };
    
  }, [base64Image]);
  
const storeSignature = () => {
  const url = `${process.env.REACT_APP_SIGN_URL}/store`;
  const curUser = localStorage.getItem("curUserEmail");
      const cleanedDateStringStart = stDate.replace(
      /\b(\d+)(st|nd|rd|th)\b/,
      "$1"
    );
    const dateStart = new Date(cleanedDateStringStart);
    const formattedDateStart = dateStart.toISOString().replace("Z", "+00:00");
    const cleanedDateStringEnd = enDate.replace(/\b(\d+)(st|nd|rd|th)\b/, "$1");
    const dateEnd = new Date(cleanedDateStringEnd);
    const formattedDateEnd = dateEnd.toISOString().replace("Z", "+00:00");

  if (imageBoxRef.current) {
    html2canvas(imageBoxRef.current)
      .then((canvas) => {
        let signatureData = canvas
          .toDataURL("image/png")
          .replace("data:image/png;base64,", "");

        // Ensure proper base64 padding
        // const padding = (4 - (signatureData.length % 4)) % 4;
        // signatureData += '='.repeat(padding); // Add padding

        console.log("Signature Data Length:", signatureData.length); // Debugging
        console.log("Signature Data:", signatureData); // Debugging
        console.log("Signature Data:", signatureData);

        console.log("charges:", charges);
        console.log("Pages:", pages);

        const payload = {
          accountNumber: accountNo,
          charges: charges,
          numPages: pages,
          currency:currency,
          signature: signatureData,
          curUser: curUser,
          startDt: formattedDateStart,
          endDt: formattedDateEnd,
          AccountNo: accountNo
          // other payload data...
        };
        console.log("AccountNo:", payload.AccountNo); // Debugging
        axios.post(url, payload)
          .then((response) => {
            console.log("Response:", response.data);
            if(response.data.status === '000'){
              setCaptured(true); // Set captured to true on success
            }
          })
          .catch((error) => {
            console.error("Error storing signature:", error);
          });
      })
      .catch((error) => {
        console.error("Error capturing the image:", error);
      });
  }
};

  const fetchSignature = () => {
    console.log(`Fetching signature for account: ${accountNo}`);

    axios
      .get(
        `${process.env.REACT_APP_SIGN_URL}/retrieve?accountNumber=${accountNo}`
      )
      .then((response) => {
        const data = response.data;
        // console.log("Response from SOA: ", data);
        console.log("Captured", captured)
        console.log("Retrieved", retrieved)
        const signatureImage = `data:image/png;base64,${data}`;
        
        if (data) {
          setRetrieved(true);
          console.log("Retrieved after", retrieved)
          // console.log("Signature fetched successfully: ", signatureImage);
          console.log("Retrieved clicked with captured:", captured, "retrieved:", retrieved);
          setImage1(signatureImage);
        } else {
          alert("No signature found for this account.");
        }
      })
      .catch(() => {
        alert("Sorry, service unavailable. Try again later.");
      });
  };
  const addBase64Padding = (base64String) => {
    const padding = (4 - (base64String.length % 4)) % 4;
    return base64String + '='.repeat(padding);
  };
  const handleButtonClick = () => {
    // console.log(
    //   "window.wizardEventController ====>" + window.wizardEventController
    // );
    // console.log(
    //   "window.wizardEventController.start_stop ====>" +
    //     window.wizardEventController.start_stop
    // );
    if (
      window.wizardEventController &&
      window.wizardEventController.start_stop
    ) {
      window.wizardEventController.start_stop(3); // Call start_stop function
    }
      setCaptured(true);
    console.log("Captured clicked with captured:", captured, "retrieved:", retrieved);
  };

  if (!isOpen) {
    return null;
  }

  return (
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <h2 style={{ color: "#0b3e27", fontWeight: "700", marginBottom: "20px" }}>
            SIGNATURE
          </h2>

          <table style={tableStyle}>

            <tbody>
            <tr>
              <td style={tdLabelStyle}>Account Number:</td>
              <td style={tdValueStyle}>{accountNo}</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>Period start:</td>
              <td style={tdValueStyle}>{stDate}</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>Period end:</td>
              <td style={tdValueStyle}>{enDate}</td>
            </tr>
            </tbody>
          </table>
          {/* Hidden inputs required by Wacom SigCaptX SDK */}
          <input type="hidden" id="accountNoHidden" value={accountNo || ""} />
          <input type="hidden" id="stDateHidden" value={stDate || ""} />
          <input type="hidden" id="enDateHidden" value={enDate || ""} />

          {/* The SDK needs these checkboxes and radio buttons */}
          <input type="checkbox" id="chkDisplayWizard" defaultChecked style={{ display: "none" }} />
          <input type="checkbox" id="chkLargeCheckbox" style={{ display: "none" }} />
          <input type="checkbox" id="chkSigText" style={{ display: "none" }} />

          {/* Radio buttons for button source selection */}
          <input type="radio" name="buttontype" id="standard" value="standard" defaultChecked style={{ display: "none" }} />
          <input type="radio" name="buttontype" id="utf8" value="utf8" style={{ display: "none" }} />
          <input type="radio" name="buttontype" id="local" value="local" style={{ display: "none" }} />
          <input type="radio" name="buttontype" id="remote" value="remote" style={{ display: "none" }} />

          {/* Textarea used internally by SDK for logging */}
          <textarea id="txtDisplay" style={{ display: "none" }}></textarea>

          {/* The Start Wizard button that triggers the SDK */}
          <input
              type="button"
              id="btnStartStopWizard"
              value="Start Wizard"
              style={{ display: "none" }}
              onClick={handleButtonClick}
          />

          <hr style={sectionDivider} />

          <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
          >
            <div>
              <h4 style={{ color: "#0b3e27" }}>Captured Signature</h4>
              <div
                  ref={imageBoxRef}
                  id="imageBox"
                  style={{
                    height: "35mm",
                    width: "60mm",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#fafafa",
                  }}
              ></div>
            </div>

            <div>
              <h4 style={{ color: "#0b3e27" }}>Retrieved Signature</h4>
              {image1 ? (
                  <img
                      src={image1}
                      alt="Base64 Signature"
                      style={{
                        height: "35mm",
                        width: "60mm",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                  />
              ) : (
                  <div
                      style={{
                        height: "35mm",
                        width: "60mm",
                        border: "1px dashed #ccc",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#888",
                        fontSize: "0.9rem",
                      }}
                  >
                    No image
                  </div>
              )}
            </div>
          </div>

          <hr style={sectionDivider} />

          <div style={buttonGroupStyle}>
            <button style={captureBtn} disabled={!captureEnabled} onClick={handleButtonClick}>
              Capture Signature
            </button>
            <button style={retrieveBtn} onClick={fetchSignature}>
              Retrieve Signature
            </button>
          </div>

          <hr style={sectionDivider} />

          <div style={buttonGroupStyle}>
            <button style={rejectBtn} onClick={handleSignatureRejection}>
              Reject
            </button>
            <button
                style={approveBtn(captured && retrieved)}
                disabled={!(captured && retrieved)}
                onClick={() => {
                  storeSignature();
                  handleSignatureApproval();
                }}
            >
              Approve
            </button>
            <button style={closeBtn} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
  );
};

// const modalStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// };

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(3px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  color: "#333",
  padding: "30px 40px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "700px",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
  fontFamily: "Segoe UI, Roboto, sans-serif",
};

const tableStyle = {
  width: "100%",
  marginBottom: "15px",
  textAlign: "left",
  borderCollapse: "collapse",
};

const tdLabelStyle = {
  fontWeight: "bold",
  padding: "6px 10px",
  width: "40%",
  color: "#0b3e27",
};

const tdValueStyle = {
  padding: "6px 10px",
  color: "#444",
};

const sectionDivider = {
  border: "none",
  borderTop: "1px solid #ccc",
  margin: "20px 0",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "15px",
  marginTop: "20px",
};

const buttonStyle = {
  borderRadius: "6px",
  padding: "8px 16px",
  minWidth: "120px",
  fontWeight: "500",
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "0.2s",
};

const captureBtn = {
  ...buttonStyle,
  border: "1px solid #0b6623",
  color: "#0b6623",
  background: "#e8f5ee",
};

const retrieveBtn = {
  ...buttonStyle,
  border: "1px solid #004085",
  color: "#004085",
  background: "#e3f2fd",
};

const rejectBtn = {
  ...buttonStyle,
  border: "1px solid #dc3545",
  color: "#dc3545",
  background: "#fdecec",
};

const approveBtn = (enabled) => ({
  ...buttonStyle,
  border: "1px solid #198754",
  color: enabled ? "#198754" : "#888",
  background: enabled ? "#e6f4ea" : "#f2f2f2",
  cursor: enabled ? "pointer" : "not-allowed",
});

const closeBtn = {
  ...buttonStyle,
  border: "1px solid #6c757d",
  color: "#6c757d",
  background: "#f8f9fa",
};

export default SignatureModal;
