// InvoiceUtils.ts
//useScaffoldWriteContract
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export interface Invoice {
  invoiceId: bigint | null;
  payee: string;
  payer: string;
  amount: bigint;
  paid: boolean;
  description: string;
  currencyCode: string;
  paymentTerms: bigint;
  creationDate: bigint;
  dueDate: bigint;
  paidDate: bigint;
  status: number;
}

export const useInvoiceUtils = () => {
  const { address } = useAccount();

  const { data: payableInvoices, isLoading: isLoadingPayables } = useScaffoldReadContract({
    contractName: "InvoiceNFT",
    functionName: "getPayableInvoicesFor",
    args: [address],
  });

  const { data: receivableInvoices, isLoading: isLoadingReceivables } = useScaffoldReadContract({
    contractName: "InvoiceNFT",
    functionName: "getReceivableInvoicesFor",
    args: [address],
  });

  const { data: payablesAndReceivables, isLoading: isLoadingPayablesAndReceivables } = useScaffoldReadContract({
    contractName: "InvoiceNFT",
    functionName: "getPayablesAndReceivablesFor",
    args: [address],
  });

  const { writeContractAsync: createInvoiceWrite, isPending: isCreatingInvoice } =
    useScaffoldWriteContract("InvoiceNFT");

  const createInvoice = async (
    payer: string,
    amount: string,
    description: string,
    currencyCode: string,
    paymentTerms: number,
  ) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      const amountInWei = parseEther(amount);
      const tx = await createInvoiceWrite({
        functionName: "createInvoice",
        args: [payer, amountInWei, description, currencyCode, BigInt(paymentTerms)],
      });
      return tx;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  };

  const retrievePayableInvoices = () => {
    if (isLoadingPayables || !address) {
      return { payableInvoices: [], isLoading: true };
    }
    return { payableInvoices: payableInvoices as Invoice[], isLoading: false };
  };

  const retrieveReceivableInvoices = () => {
    if (isLoadingReceivables || !address) {
      return { receivableInvoices: [], isLoading: true };
    }
    return { receivableInvoices: receivableInvoices as Invoice[], isLoading: false };
  };

  const getPayablesAndReceivables = () => {
    if (isLoadingPayablesAndReceivables || !address || !payablesAndReceivables) {
      return { payables: [], receivables: [], isLoading: true };
    }

    // Check if payablesAndReceivables is an array with two elements
    if (Array.isArray(payablesAndReceivables) && payablesAndReceivables.length === 2) {
      const [payables, receivables] = payablesAndReceivables;
      return {
        payables: Array.isArray(payables) ? payables : [],
        receivables: Array.isArray(receivables) ? receivables : [],
        isLoading: false,
      };
    }

    // If the data is not in the expected format, return empty arrays
    console.error("Unexpected format for payablesAndReceivables:", payablesAndReceivables);
    return { payables: [], receivables: [], isLoading: false };
  };

  return {
    retrievePayableInvoices,
    retrieveReceivableInvoices,
    getPayablesAndReceivables,
    createInvoice,
    isCreatingInvoice,
  };
};
