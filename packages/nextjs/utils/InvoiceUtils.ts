// InvoiceUtils.ts
//useScaffoldWriteContract
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export interface Invoice {
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

  const retrievePayablesAndReceivables = () => {
    if (isLoadingPayablesAndReceivables || !address) {
      return { payables: [], receivables: [], isLoading: true };
    }
    const [payables, receivables] = payablesAndReceivables as [Invoice[], Invoice[]];
    return { payables, receivables, isLoading: false };
  };

  return {
    retrievePayableInvoices,
    retrieveReceivableInvoices,
    retrievePayablesAndReceivables,
  };
};
