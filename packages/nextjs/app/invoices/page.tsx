"use client";

import React, { useState } from "react";
import CreateInvoiceModal from "~~/components/invoices/CreateInvoiceModal";

const InvoicesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    payer: "",
    amount: "",
    currency: "USD",
    paymentTerms: 30,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Invoice data:", invoiceData);
    setIsModalOpen(false);
    // Here you would typically send the data to your backend or smart contract
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Invoices</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Create New Invoice
        </button>
      </div>
      <p>This is the invoices page. Add your content here.</p>

      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoiceData={invoiceData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default InvoicesPage;
