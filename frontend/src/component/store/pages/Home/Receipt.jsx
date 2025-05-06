import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useParams, useNavigate } from "react-router-dom";

const Receipt = () => {
  const { orderId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/receipt/${orderId}`)
      .then((res) => setReceipt(res.data));
  }, [orderId]);

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Paw PetCare", 10, 15);
    doc.setFontSize(12);
    doc.text(
      `Receipt No: ${
        receipt.receiptNumber
          ? String(receipt.receiptNumber).padStart(4, "0")
          : receipt._id.slice(-6)
      }`,
      10,
      25
    );
    doc.text(`Date: ${new Date(receipt.date).toLocaleString()}`, 10, 32);
    doc.text(`Cardholder: ${receipt.payment.name}`, 10, 39);

    doc.autoTable({
      startY: 45,
      head: [["Product", "Qty", "Price"]],
      body: receipt.items.map((i) => [
        i.name,
        i.quantity,
        `Rs. ${(i.price * i.quantity).toFixed(2)}`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.text(
      `Total: Rs. ${receipt.total.toFixed(2)}`,
      10,
      doc.lastAutoTable.finalY + 10
    );
    doc.save(
      `Receipt_${
        receipt.receiptNumber
          ? String(receipt.receiptNumber).padStart(4, "0")
          : receipt._id.slice(-6)
      }.pdf`
    );
  };

  if (!receipt)
    return (
      <div className="container py-5 text-center">
        <span className="spinner-border text-primary"></span>
        <p>Loading receipt...</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="container py-5"
    >
      <div
        className="p-4 bg-white rounded shadow text-center"
        style={{ maxWidth: 600, margin: "0 auto" }}
      >
        <h2 className="mb-2" style={{ letterSpacing: 2 }}>Paw PetCare</h2>
        {/* Official Receipt text REMOVED */}
        <div className="mb-3 text-start">
          <div>
            Receipt No:{" "}
            <b style={{
              fontFamily: "'Digital-7', 'Consolas', monospace",
              fontSize: "1.2em",
              letterSpacing: "2px"
            }}>
              {receipt.receiptNumber
                ? String(receipt.receiptNumber).padStart(4, "0")
                : receipt._id.slice(-6)}
            </b>
          </div>
          <div>Date: {new Date(receipt.date).toLocaleString()}</div>
          <div>Cardholder: {receipt.payment.name}</div>
          {/* Card line REMOVED */}
        </div>
        <table className="table table-bordered mb-4">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h5 className="mb-4">
          Total: <b>Rs. {receipt.total.toFixed(2)}</b>
        </h5>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="btn btn-outline-primary mb-2"
          onClick={handleDownload}
        >
          Download PDF
        </motion.button>
        <br />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Go Back to Home
        </motion.button>
      </div>
      {/* Optional: Add digital font for receipt number */}
      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/digital-7');
        `}
      </style>
    </motion.div>
  );
};

export default Receipt;
