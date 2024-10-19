//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract InvoiceManager {
    struct Invoice {
        address payee;
        address payer;
        uint amount;
        bool paid;
        string details;
    }

    mapping(uint => Invoice) public invoices;
    uint[] public invoiceIds;
    uint public nextInvoiceId;

    function createInvoice(address _payee, uint _amount, string memory _details) public {
        invoices[nextInvoiceId] = Invoice(_payee, msg.sender, _amount, false, _details);
        nextInvoiceId++;
    }

    function payInvoice(uint _invoiceId) public payable {
        Invoice storage invoice = invoices[_invoiceId];
        require(!invoice.paid, "Invoice already paid");
        require(msg.value >= invoice.amount, "Insufficient payment");

        invoice.paid = true;
        payable(invoice.payee).transfer(msg.value);
    }

    function getInvoices() public view returns (uint[] memory) {
        return invoiceIds;
    }
}
