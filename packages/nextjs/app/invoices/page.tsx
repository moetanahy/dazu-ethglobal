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
  creationDate: number; // New field for creation date
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
    {
      id: "1",
      payer: "0x1234...",
      amount: "100",
      currency: "USDC",
      paymentTerms: 30,
      type: "receivables",
      creationDate: Date.now(),
    },
    {
      id: "2",
      payer: "0x5678...",
      amount: "200",
      currency: "ETH",
      paymentTerms: 14,
      type: "payables",
      creationDate: Date.now() - 86400000,
    }, // 1 day ago
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
      creationDate: Date.now(), // Set the creation date to the current timestamp
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
        <table className="table w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">ID</th>
              <th className="px-4 py-2 text-left border-b">Payer</th>
              <th className="px-4 py-2 text-left border-b">Amount</th>
              <th className="px-4 py-2 text-left border-b">Currency</th>
              <th className="px-4 py-2 text-left border-b">Payment Terms</th>
              <th className="px-4 py-2 text-left border-b">Type</th>
              <th className="px-4 py-2 text-left border-b">Creation Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className="hover:bg-base-200">
                <td className="px-4 py-2 border-b">{invoice.id}</td>
                <td className="px-4 py-2 border-b">{invoice.payer}</td>
                <td className="px-4 py-2 border-b">{invoice.amount}</td>
                <td className="px-4 py-2 border-b">{invoice.currency}</td>
                <td className="px-4 py-2 border-b">{invoice.paymentTerms} days</td>
                <td className="px-4 py-2 border-b">{getDisplayType(invoice.type)}</td>
                <td className="px-4 py-2 border-b">{new Date(invoice.creationDate).toLocaleDateString()}</td>
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
