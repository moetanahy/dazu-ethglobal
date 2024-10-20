// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceNFT is ERC721, Ownable {

    // Manual counter for invoice IDs
    uint256 private _invoiceIds;

    enum InvoiceStatus { Pending, Approved, Rejected, AutomaticallyApproved, Cancelled }

    struct Invoice {
        uint256 invoiceId;
        address payable payee;
        address payer;
        uint256 amount;
        bool paid;
        string description;
        string currencyCode;
        uint256 paymentTerms;
        uint256 creationDate;
        uint256 dueDate;
        uint256 paidDate;
        InvoiceStatus status;
        string blobId;
    }

    // Mapping from tokenId to Invoice data
    mapping(uint256 => Invoice) public invoices;

    // Mapping from wallet address to an array of invoice IDs
    mapping(address => uint256[]) private walletInvoices;

    constructor(address initialOwner) ERC721("InvoiceNFT", "INV") Ownable(initialOwner) {}

    // Function to create an invoice and mint an NFT
    function createInvoice(
        address _payer,
        uint256 _amount,
        string memory _description,
        string memory _currencyCode,
        uint256 _paymentTerms
    ) public returns (uint256) {
        // Validate payment terms
        require(_paymentTerms == 5 || _paymentTerms == 30 || _paymentTerms == 45, "Invalid payment terms");
        // Ensure the payer is not the same as the payee (msg.sender)
        require(_payer != msg.sender, "Cannot create an invoice to yourself");

        // Increment invoice ID manually
        _invoiceIds += 1;
        uint256 newInvoiceId = _invoiceIds;

        // Mint the NFT to the payer
        _mint(_payer, newInvoiceId);

        // Calculate the due date
        uint256 creationDate = block.timestamp;
        uint256 dueDate = creationDate + (_paymentTerms * 1 days);

        // Store invoice details in the mapping
        invoices[newInvoiceId] = Invoice({
            invoiceId: newInvoiceId,
            payee: payable(msg.sender),
            payer: _payer,
            amount: _amount,
            paid: false,
            description: _description,
            currencyCode: _currencyCode,
            paymentTerms: _paymentTerms,
            creationDate: creationDate,
            dueDate: dueDate,
            paidDate: 0,
            status: InvoiceStatus.Pending,
            blobId: ""
        });

        // Add invoice ID to both payee's and payer's walletInvoices
        walletInvoices[msg.sender].push(newInvoiceId);
        walletInvoices[_payer].push(newInvoiceId);

        return newInvoiceId;
    }

    // Function to set the blobId for an invoice
    function setBlobId(uint256 _invoiceId, string memory _blobId) public {
        Invoice storage invoice = invoices[_invoiceId];
        
        // Ensure only the payee (invoice creator) can set the blobId
        require(invoice.payee == msg.sender, "Only the payee can set the blobId");
        
        // Ensure the invoice exists
        require(invoice.invoiceId != 0, "Invoice does not exist");
        
        // Set the blobId
        invoice.blobId = _blobId;
        
        // Optionally, you could emit an event here to log the blobId update
        // emit BlobIdSet(_invoiceId, _blobId);
    }

    // Function to pay an invoice by the payer
    function payInvoice(uint256 _invoiceId) public payable {
        Invoice storage invoice = invoices[_invoiceId];

        require(invoice.payer == msg.sender, "Only the payer can pay this invoice.");
        require(!invoice.paid, "Invoice already paid.");
        require(msg.value >= invoice.amount, "Insufficient payment.");
        require(invoice.status == InvoiceStatus.Approved || invoice.status == InvoiceStatus.AutomaticallyApproved, "Invoice not approved.");

        // Mark the invoice as paid and set the paid date
        invoice.paid = true;
        invoice.paidDate = block.timestamp;

        // Transfer the payment to the payee
        invoice.payee.transfer(msg.value);
    }

    // Function to check if an invoice is overdue
    function isInvoiceOverdue(uint256 _invoiceId) public view returns (bool) {
        Invoice storage invoice = invoices[_invoiceId];
        return !invoice.paid && block.timestamp > invoice.dueDate;
    }

    // Function to get the payment status of an invoice
    function getInvoiceStatus(uint256 _invoiceId) public view returns (string memory) {
        if (_invoiceId == 0 || _invoiceId > _invoiceIds) {
            return "None";
        }
        
        Invoice storage invoice = invoices[_invoiceId];
        if (invoice.paid) {
            return "Paid";
        } else if (block.timestamp > invoice.dueDate) {
            return "Overdue";
        } else {
            return "Pending";
        }
    }

    // Optional: Function to allow the NFT invoice to be transferred to another party
    function transferInvoice(address _to, uint256 _invoiceId) public {
        require(ownerOf(_invoiceId) == msg.sender, "You don't own this invoice NFT.");
        safeTransferFrom(msg.sender, _to, _invoiceId);
    }

    // Optional: Return metadata URI (like from IPFS)
    function tokenURI(uint256 _invoiceId) public view override returns (string memory) {
        // Generate or fetch off-chain metadata URL for the invoice
        return "https://my-invoice-metadata.com/"; // Replace with your metadata link (e.g., IPFS or centralized URL)
    }    

    // Function to get invoice from invoiceID
    function getInvoice(uint256 _invoiceId) public view returns (Invoice memory) {
        require(_invoiceId > 0 && _invoiceId <= _invoiceIds, "Invalid invoice ID");
        return invoices[_invoiceId];
    }

    // Function to retrieve all payable invoices for a particular wallet
    function getPayableInvoicesFor(address _wallet) public view returns (Invoice[] memory) {
        uint256[] memory invoiceIds = walletInvoices[_wallet];
        Invoice[] memory payableInvoices = new Invoice[](invoiceIds.length);
        uint256 payableCount = 0;

        for (uint256 i = 0; i < invoiceIds.length; i++) {
            Invoice memory invoice = invoices[invoiceIds[i]];
            if (invoice.payer == _wallet) {
                payableInvoices[payableCount] = invoice;
                payableCount++;
            }
        }

        // Resize the array to remove empty slots
        assembly {
            mstore(payableInvoices, payableCount)
        }

        return payableInvoices;
    }

    // Function to retrieve all receivable invoices for a particular wallet
    function getReceivableInvoicesFor(address _wallet) public view returns (Invoice[] memory) {
        uint256[] memory invoiceIds = walletInvoices[_wallet];
        Invoice[] memory receivableInvoices = new Invoice[](invoiceIds.length);
        uint256 receivableCount = 0;

        for (uint256 i = 0; i < invoiceIds.length; i++) {
            Invoice memory invoice = invoices[invoiceIds[i]];
            if (invoice.payee == _wallet) {
                receivableInvoices[receivableCount] = invoice;
                receivableCount++;
            }
        }

        // Resize the array to remove empty slots
        assembly {
            mstore(receivableInvoices, receivableCount)
        }

        return receivableInvoices;
    }

    // Function to retrieve all payable and receivable invoices for a particular wallet
    function getPayablesAndReceivablesFor(address _wallet) public view returns (Invoice[] memory payables, Invoice[] memory receivables) {
        uint256[] memory invoiceIds = walletInvoices[_wallet];
        Invoice[] memory payableInvoices = new Invoice[](invoiceIds.length);
        Invoice[] memory receivableInvoices = new Invoice[](invoiceIds.length);
        uint256 payableCount = 0;
        uint256 receivableCount = 0;

        for (uint256 i = 0; i < invoiceIds.length; i++) {
            Invoice memory invoice = invoices[invoiceIds[i]];
            if (invoice.payer == _wallet) {
                payableInvoices[payableCount] = invoice;
                payableCount++;
            } else if (invoice.payee == _wallet) {
                receivableInvoices[receivableCount] = invoice;
                receivableCount++;
            }
        }

        // Resize the arrays to remove empty slots
        assembly {
            mstore(payableInvoices, payableCount)
            mstore(receivableInvoices, receivableCount)
        }

        return (payableInvoices, receivableInvoices);
    }

    // Function to approve an invoice
    function approveInvoice(uint256 _invoiceId) public {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.payer == msg.sender, "Only the payer can approve this invoice.");
        require(invoice.status == InvoiceStatus.Pending, "Invoice is not in pending status.");
        
        uint256 approvalDeadline = invoice.creationDate + 7 days;
        
        if (block.timestamp <= approvalDeadline) {
            invoice.status = InvoiceStatus.Approved;
        } else {
            invoice.status = InvoiceStatus.AutomaticallyApproved;
        }
    }

    // Function to reject an invoice
    function rejectInvoice(uint256 _invoiceId) public {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.payer == msg.sender, "Only the payer can reject this invoice.");
        require(invoice.status == InvoiceStatus.Pending, "Invoice is not in pending status.");
        
        uint256 approvalDeadline = invoice.creationDate + 7 days;
        
        if (block.timestamp <= approvalDeadline) {
            invoice.status = InvoiceStatus.Rejected;
        } else {
            invoice.status = InvoiceStatus.AutomaticallyApproved;
        }
    }

    // Function to check and update invoice status
    function checkInvoiceStatus(uint256 _invoiceId) public {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.status == InvoiceStatus.Pending, "Invoice is not in pending status.");
        
        uint256 approvalDeadline = invoice.creationDate + 7 days;
        
        if (block.timestamp > approvalDeadline) {
            invoice.status = InvoiceStatus.AutomaticallyApproved;
        }
    }

    // Function to allow a payee to cancel an invoice
    function cancelInvoice(uint256 _invoiceId) public {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.payee == msg.sender, "Only the payee can cancel this invoice.");
        require(invoice.status == InvoiceStatus.Pending, "Invoice can only be cancelled if it's pending.");

        invoice.status = InvoiceStatus.Cancelled;

        // Burn the NFT
        _burn(_invoiceId);

        // Remove the invoice ID from both payee's and payer's walletInvoices
        removeFromWalletInvoices(invoice.payee, _invoiceId);
        removeFromWalletInvoices(invoice.payer, _invoiceId);
    }

    // TODO not sure I agree with this
    // Helper function to remove an invoice ID from a wallet's invoice list
    function removeFromWalletInvoices(address wallet, uint256 invoiceId) private {
        uint256[] storage walletInvoiceIds = walletInvoices[wallet];
        for (uint256 i = 0; i < walletInvoiceIds.length; i++) {
            if (walletInvoiceIds[i] == invoiceId) {
                walletInvoiceIds[i] = walletInvoiceIds[walletInvoiceIds.length - 1];
                walletInvoiceIds.pop();
                break;
            }
        }
    }
}
