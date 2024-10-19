// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _invoiceIds; // Counter for NFT IDs

    struct Invoice {
        address payable payee;
        address payer;
        uint256 amount;
        bool paid;
        string description;
    }

    // Mapping from tokenId to Invoice data
    mapping(uint256 => Invoice) public invoices;

    constructor() ERC721("InvoiceNFT", "INV") {}

    // Function to create an invoice and mint an NFT
    function createInvoice(
        address payable _payee,
        address _payer,
        uint256 _amount,
        string memory _description
    ) public onlyOwner returns (uint256) {
        _invoiceIds.increment();  // Increment invoice ID
        uint256 newInvoiceId = _invoiceIds.current();  // Get current invoice ID

        // Mint the NFT to the payer
        _mint(_payer, newInvoiceId);

        // Store invoice details in the mapping
        invoices[newInvoiceId] = Invoice({
            payee: _payee,
            payer: _payer,
            amount: _amount,
            paid: false,
            description: _description
        });

        return newInvoiceId;
    }

    // Function to pay an invoice by the payer
    function payInvoice(uint256 _invoiceId) public payable {
        Invoice storage invoice = invoices[_invoiceId];

        require(invoice.payer == msg.sender, "Only the payer can pay this invoice.");
        require(!invoice.paid, "Invoice already paid.");
        require(msg.value >= invoice.amount, "Insufficient payment.");

        // Mark the invoice as paid
        invoice.paid = true;

        // Transfer the payment to the payee
        invoice.payee.transfer(msg.value);
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
