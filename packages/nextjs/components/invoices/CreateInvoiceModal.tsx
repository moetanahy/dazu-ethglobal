import React, { useState } from "react";
import { groupedCurrencies } from "~~/utils/CurrencyUtils";
import { paymentTerms } from "~~/utils/PaymentTermsUtils";
import { WalrusUtils } from "~~/utils/WalrusUtils";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  initialData: {
    payer: string;
    amount: string;
    currency: string;
    paymentTerms: number;
    description: string;
    invoiceFile?: File | null;
  };
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onChange,
  initialData,
}) => {
  const [invoiceData, setInvoiceData] = useState(initialData);
  const [payerError, setPayerError] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  if (!isOpen) return null;

  const validatePayer = (value: string) => {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethereumAddressRegex.test(value)) {
      setPayerError("Please enter a valid Ethereum wallet address");
    } else {
      setPayerError("");
    }
  };

  const handlePayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInvoiceData(prev => ({ ...prev, payer: value }));
    validatePayer(value);
    onChange(e);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
    onChange(e);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setInvoiceData(prev => ({ ...prev, invoiceFile: file }));
        setFileError("");
      } else {
        setFileError("Please upload a PDF file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerError && !fileError) {
      if (invoiceData.invoiceFile) {
        try {
          const fileContent = await invoiceData.invoiceFile.arrayBuffer();
          const blobId = await WalrusUtils.store(new Uint8Array(fileContent));
          console.log("File uploaded to Walrus. Blob ID:", blobId);
          // You might want to add the blobId to the invoice data here
          // setInvoiceData(prev => ({ ...prev, invoiceBlobId: blobId }));
        } catch (error) {
          console.error("Error uploading file to Walrus:", error);
          setFileError("Failed to upload file. Please try again.");
          return;
        }
      }
      await onSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-100 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Invoice</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Payer (Ethereum Address)</label>
            <input
              type="text"
              name="payer"
              value={invoiceData.payer}
              onChange={handlePayerChange}
              className={`w-full p-2 border rounded text-gray-800 bg-white ${payerError ? "border-red-500" : ""}`}
              required
            />
            {payerError && <p className="text-red-500 text-sm mt-1">{payerError}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={invoiceData.amount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-800 bg-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Currency</label>
            <select
              name="currency"
              value={invoiceData.currency}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-800 bg-white"
            >
              <optgroup label="Crypto">
                {groupedCurrencies.crypto.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Fiat">
                {groupedCurrencies.fiat.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Payment Terms</label>
            <select
              name="paymentTerms"
              value={invoiceData.paymentTerms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-800 bg-white"
            >
              {paymentTerms.map(term => (
                <option key={term.value} value={term.value}>
                  {term.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={invoiceData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-800 bg-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Upload Invoice PDF (Optional)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 border rounded text-gray-800 bg-white"
            />
            {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
          </div>
          <div className="flex justify-end">
            <button type="button" className="btn btn-secondary mr-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!!payerError || !!fileError}>
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
