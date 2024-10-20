"use client";

import React, { useEffect, useState } from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import WalletName from "~~/components/WalletName";
import CreateInvoiceModal from "~~/components/invoices/CreateInvoiceModal";
import { Invoice, useInvoiceUtils } from "~~/utils/InvoiceUtils";
import { WalrusUtils } from "~~/utils/WalrusUtils";
import { notification } from "~~/utils/scaffold-eth";

const PayButton: React.FC<{ invoice: Invoice; onPaymentComplete: () => void }> = ({ invoice, onPaymentComplete }) => {
  const { payInvoice, isPayingInvoice } = useInvoiceUtils();

  const handlePay = async () => {
    try {
      await payInvoice(invoice.invoiceId!, invoice.amount);
      notification.success("Payment successful!");
      onPaymentComplete();
    } catch (error) {
      console.error("Payment failed:", error);
      notification.error("Payment failed. Please try again.");
    }
  };

  return (
    <button className="btn btn-primary btn-sm" onClick={handlePay} disabled={isPayingInvoice}>
      {isPayingInvoice ? "Paying..." : "Pay"}
    </button>
  );
};

const ApproveRejectButtons: React.FC<{ invoice: Invoice; onActionComplete: () => void }> = ({
  invoice,
  onActionComplete,
}) => {
  const { approveInvoice, rejectInvoice, isApprovingInvoice, isRejectingInvoice } = useInvoiceUtils();

  const handleApprove = async () => {
    try {
      await approveInvoice(invoice.invoiceId!);
      notification.success("Invoice approved successfully!");
      onActionComplete();
    } catch (error) {
      console.error("Approval failed:", error);
      notification.error("Approval failed. Please try again.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectInvoice(invoice.invoiceId!);
      notification.success("Invoice rejected successfully!");
      onActionComplete();
    } catch (error) {
      console.error("Rejection failed:", error);
      notification.error("Rejection failed. Please try again.");
    }
  };

  if (invoice.status !== 0) return null; // Only show for pending invoices

  return (
    <>
      <button className="btn btn-primary btn-sm mr-2" onClick={handleApprove} disabled={isApprovingInvoice}>
        {isApprovingInvoice ? "Approving..." : "Approve"}
      </button>
      <button className="btn btn-secondary btn-sm" onClick={handleReject} disabled={isRejectingInvoice}>
        {isRejectingInvoice ? "Rejecting..." : "Reject"}
      </button>
    </>
  );
};

const InvoicesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "receivable" | "payable">("all");
  const [invoices, setInvoices] = useState<readonly Invoice[]>([]);
  const [invoiceData, setInvoiceData] = useState({
    payer: "",
    amount: "",
    currency: "USD",
    paymentTerms: 30,
    description: "",
  });

  const { address, isConnected } = useAccount();
  const {
    retrievePayableInvoices,
    retrieveReceivableInvoices,
    getPayablesAndReceivables,
    createInvoice,
    payInvoice,
    approveInvoice,
    rejectInvoice,
  } = useInvoiceUtils();

  useEffect(() => {
    if (address) {
      fetchInvoices();
    }
  }, [address, activeTab]);

  const fetchInvoices = () => {
    let fetchedInvoices: readonly Invoice[] = [];
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
        // if (result.payables && result.receivables) {
        fetchedInvoices = [...result.payables, ...result.receivables] as readonly Invoice[];
        // } else {
        // console.error("Unexpected format from getPayablesAndReceivables:", result);
        // fetchedInvoices = [];
        // }
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
    try {
      await createInvoice(
        invoiceData.payer,
        invoiceData.amount,
        invoiceData.description,
        invoiceData.currency,
        invoiceData.paymentTerms,
      );
      setIsModalOpen(false);
      fetchInvoices(); // Refresh the invoice list
    } catch (error) {
      console.error("Failed to create invoice:", error);
      // Handle error (e.g., show error message)
    }
  };

  const renderTableHeader = () => {
    const commonHeaders = [
      "ID",
      "Amount",
      "Currency",
      "Terms",
      "Creation Date",
      "Due Date",
      "Status",
      "Payment Status",
    ];

    switch (activeTab) {
      case "receivable":
        return ["Payer", "Payee", ...commonHeaders];
      case "payable":
        return ["Payee", "Payer", ...commonHeaders, "Actions"];
      default: // "all"
        return ["Payer", "Payee", ...commonHeaders, "Actions"];
    }
  };

  const formatAmount = (amount: string) => {
    const parsedAmount = parseFloat(amount) / 1e18;
    return parsedAmount
      .toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      })
      .replace(/\.?0+$/, "");
  };

  const renderTableRow = (invoice: Invoice) => {
    const commonCells = [
      <td key="id" className="px-4 py-2 border-b">
        {invoice.invoiceId?.toString() || "N/A"}
      </td>,
      <td key="amount" className="px-4 py-2 border-b">
        {formatAmount(invoice.amount.toString())}
      </td>,
      <td key="currency" className="px-4 py-2 border-b">
        {invoice.currencyCode}
      </td>,
      <td key="terms" className="px-4 py-2 border-b">
        {invoice.paymentTerms.toString()} days
      </td>,
      <td key="creation" className="px-4 py-2 border-b">
        {new Date(Number(invoice.creationDate) * 1000).toLocaleDateString()}
      </td>,
      <td key="due" className="px-4 py-2 border-b">
        {new Date(Number(invoice.dueDate) * 1000).toLocaleDateString()}
      </td>,
      <td key="status" className="px-4 py-2 border-b">
        {invoice.status === 0
          ? "Pending"
          : invoice.status === 1
          ? "Approved"
          : invoice.status === 2
          ? "Rejected"
          : invoice.status === 3
          ? "Auto-Approved"
          : "Paid"}
      </td>,
      <td key="paymentStatus" className="px-4 py-2 border-b">
        {invoice.paid ? "Paid" : "Unpaid"}
      </td>,
    ];

    const payerCell = (
      <td key="payer" className="px-4 py-2 border-b">
        <WalletName address={invoice.payer} />
      </td>
    );

    const payeeCell = (
      <td key="payee" className="px-4 py-2 border-b">
        <WalletName address={invoice.payee} />
      </td>
    );

    const actionCell = (
      <td key="action" className="px-4 py-2 border-b">
        {invoice.status === 1 && !invoice.paid && (
          <PayButton invoice={invoice} onPaymentComplete={handlePaymentComplete} />
        )}
        {invoice.payer === address && invoice.status === 0 && (
          <ApproveRejectButtons invoice={invoice} onActionComplete={handlePaymentComplete} />
        )}
      </td>
    );

    switch (activeTab) {
      case "receivable":
        return [payerCell, payeeCell, ...commonCells];
      case "payable":
        return [payeeCell, payerCell, ...commonCells, actionCell];
      default: // "all"
        return [payerCell, payeeCell, ...commonCells, actionCell];
    }
  };

  const handlePaymentComplete = () => {
    fetchInvoices(); // Refresh the invoice list after payment
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto mt-10 text-center">
        <h1 className="text-4xl font-bold mb-6">Invoices</h1>
        <p className="mb-4">Please connect your wallet to view and manage invoices.</p>
        {/* <DynamicWidget /> */}
      </div>
    );
  }

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
          All Invoices
        </a>
        <a
          className={`tab ${activeTab === "receivable" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("receivable")}
        >
          Receivables
        </a>
        <a className={`tab ${activeTab === "payable" ? "tab-active" : ""}`} onClick={() => setActiveTab("payable")}>
          Payables
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr>
              {renderTableHeader().map((header, index) => (
                <th key={index} className="px-4 py-2 text-left border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index} className="hover:bg-base-200">
                {renderTableRow(invoice)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        initialData={invoiceData}
      />
    </div>
  );
};

export default InvoicesPage;
