"use client";

import React, { useState } from "react";
import CreateInvoiceModal from "~~/components/invoices/CreateInvoiceModal";

type InvoiceType = "receivables" | "payables";

interface Invoice {
  id: string;
  payer: string;
  amount: string;
  currency: string;
  paymentTerms: number;
  type: InvoiceType;
}

const InvoicesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<InvoiceType | "all">("all");
  const [invoiceData, setInvoiceData] = useState({
    payer: "",
    amount: "",
    currency: "USD",
    paymentTerms: 30,
  });

  // Mock data for invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "1", payer: "0x1234...", amount: "100", currency: "USDC", paymentTerms: 30, type: "receivables" },
    { id: "2", payer: "0x5678...", amount: "200", currency: "ETH", paymentTerms: 14, type: "payables" },
    // Add more mock invoices as needed
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      ...invoiceData,
      type: "receivables", // Assuming new invoices are always receivables
    };
    setInvoices(prev => [...prev, newInvoice]);
    setIsModalOpen(false);
    // Here you would typically send the data to your backend or smart contract
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (activeTab === "all") return true;
    return invoice.type === activeTab;
  });

  const getDisplayType = (type: InvoiceType) => {
    return type === "receivables" ? "Sent" : "Received";
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Invoices</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Create New Invoice
        </button>
      </div>

      <div className="tabs tabs-boxed mb-4">
        <a className={`tab ${activeTab === "all" ? "tab-active" : ""}`} onClick={() => setActiveTab("all")}>
          All
        </a>
        <a
          className={`tab ${activeTab === "receivables" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("receivables")}
        >
          Sent
        </a>
        <a className={`tab ${activeTab === "payables" ? "tab-active" : ""}`} onClick={() => setActiveTab("payables")}>
          Received
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Payer</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Payment Terms</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.payer}</td>
                <td>{invoice.amount}</td>
                <td>{invoice.currency}</td>
                <td>{invoice.paymentTerms} days</td>
                <td>{getDisplayType(invoice.type)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
