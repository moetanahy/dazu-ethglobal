import React from "react";
import { groupedCurrencies } from "~~/utils/CurrencyUtils";
import { paymentTerms } from "~~/utils/PaymentTermsUtils";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: {
    payer: string;
    amount: string;
    currency: string;
    paymentTerms: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
  handleInputChange,
  handleSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-100 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Invoice</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Payer</label>
            <input
              type="text"
              name="payer"
              value={invoiceData.payer}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-800 bg-white"
              required
            />
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
          <div className="flex justify-end">
            <button type="button" className="btn btn-secondary mr-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
