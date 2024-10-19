"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import CreateInvoiceModal from "~~/components/invoices/CreateInvoiceModal";
import { Invoice, useInvoiceUtils } from "~~/utils/InvoiceUtils";

const InvoicesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "receivable" | "payable">("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceData, setInvoiceData] = useState({
    payer: "",
    amount: "",
    currency: "USD",
    paymentTerms: 30,
    description: "",
  });

  const { address } = useAccount();
  const { retrievePayableInvoices, retrieveReceivableInvoices, getPayablesAndReceivables } = useInvoiceUtils();

  useEffect(() => {
    if (address) {
      fetchInvoices();
    }
  }, [address, activeTab]);

  const fetchInvoices = () => {
    let fetchedInvoices: Invoice[] = [];
    let isLoading = false;

    switch (activeTab) {
      case "payable":
        ({ payableInvoices: fetchedInvoices, isLoading } = retrievePayableInvoices());
        break;
      case "receivable":
        ({ receivableInvoices: fetchedInvoices, isLoading } = retrieveReceivableInvoices());
        break;
      case "all":
        const result = getPayablesAndReceivables();
        console.log("Raw result from getPayablesAndReceivables:", result);
        if (result.payables && result.receivables) {
          fetchedInvoices = [...result.payables, ...result.receivables];
        } else {
          console.error("Unexpected format from getPayablesAndReceivables:", result);
          fetchedInvoices = [];
        }
        isLoading = result.isLoading;
        break;
    }

    if (!isLoading) {
      console.log("Fetched invoices:", fetchedInvoices);
      setInvoices(fetchedInvoices);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement createInvoice functionality
    setIsModalOpen(false);
    fetchInvoices(); // Refresh the invoice list
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
          className={`tab ${activeTab === "receivable" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("receivable")}
        >
          Receivable
        </a>
        <a className={`tab ${activeTab === "payable" ? "tab-active" : ""}`} onClick={() => setActiveTab("payable")}>
          Payable
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Payee</th>
              <th className="px-4 py-2 text-left border-b">Payer</th>
              <th className="px-4 py-2 text-left border-b">Amount</th>
              <th className="px-4 py-2 text-left border-b">Currency</th>
              <th className="px-4 py-2 text-left border-b">Payment Terms</th>
              <th className="px-4 py-2 text-left border-b">Creation Date</th>
              <th className="px-4 py-2 text-left border-b">Due Date</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index} className="hover:bg-base-200">
                <td className="px-4 py-2 border-b">{invoice.payee}</td>
                <td className="px-4 py-2 border-b">{invoice.payer}</td>
                <td className="px-4 py-2 border-b">{invoice.amount.toString()}</td>
                <td className="px-4 py-2 border-b">{invoice.currencyCode}</td>
                <td className="px-4 py-2 border-b">{invoice.paymentTerms.toString()} days</td>
                <td className="px-4 py-2 border-b">
                  {new Date(Number(invoice.creationDate) * 1000).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b">{new Date(Number(invoice.dueDate) * 1000).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">{invoice.paid ? "Paid" : "Pending"}</td>
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
