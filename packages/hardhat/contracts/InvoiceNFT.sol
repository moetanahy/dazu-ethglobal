// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceNFT is ERC721, Ownable {

    // Manual counter for invoice IDs
    uint256 private _invoiceIds;

    struct Invoice {
        address payable payee;
        address payer;
        uint256 amount;
        bool paid;
        string description;
        string currencyCode;
        uint256 paymentTerms;
        uint256 creationDate;
        uint256 dueDate;
        uint256 paidDate; // New field for paid date
    }

    // Mapping from tokenId to Invoice data
    mapping(uint256 => Invoice) public invoices;

    constructor(address initialOwner) ERC721("InvoiceNFT", "INV") Ownable(initialOwner) {}

    // Function to create an invoice and mint an NFT
    function createInvoice(
        address payable _payee,
        address _payer,
        uint256 _amount,
        string memory _description,
        string memory _currencyCode,
        uint256 _paymentTerms
    ) public onlyOwner returns (uint256) {
        // Validate payment terms
        require(_paymentTerms == 5 || _paymentTerms == 30 || _paymentTerms == 45, "Invalid payment terms");

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
            payee: _payee,
            payer: _payer,
            amount: _amount,
            paid: false,
            description: _description,
            currencyCode: _currencyCode,
            paymentTerms: _paymentTerms,
            creationDate: creationDate,
            dueDate: dueDate,
            paidDate: 0 // Initialize paidDate to 0
        });

        return newInvoiceId;
    }

    // Function to pay an invoice by the payer
    function payInvoice(uint256 _invoiceId) public payable {
        Invoice storage invoice = invoices[_invoiceId];

        require(invoice.payer == msg.sender, "Only the payer can pay this invoice.");
        require(!invoice.paid, "Invoice already paid.");
        require(msg.value >= invoice.amount, "Insufficient payment.");

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
}
