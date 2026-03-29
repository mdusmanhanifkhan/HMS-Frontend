import helpingHandLogoBase64 from '../assets/images/helping-hand.jpeg'
import kindrLogoBase64 from '../assets/images/kindr-logo.jpeg'

type SaleItem = {
  medicineName: string
  qty: number
  price: number
  discountPercent?: number
  discountAmount?: number
  total: number
}

type SaleReceiptProps = {
  customerName: string
  saleNo: string
  saleDate?: Date
  items: SaleItem[]
  subTotal: number
  totalDiscount: number
  netTotal: number
  remarks?: string
}

const SaleReceiptTemplate = ({
  customerName,
  saleNo,
  saleDate = new Date(),
  items,
  subTotal,
  totalDiscount,
  netTotal,
  remarks
}: SaleReceiptProps) => {
  const formattedDate = saleDate
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    })
    .replace(/ /g, '-')

  return `
  <html>
    <head>
      <style>
        html, body {
          margin:0; padding:0; width:100%; background:#fff;
          font-family: 'Courier New', Courier, monospace; font-size:12px;
        }
        .receipt-main {
          width: 88mm;
          margin:0 auto;
          padding:5px;
          box-sizing: border-box;
          color:#000;
        }
        .logo-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .logo-row img {
          height: 60px;
          width: auto;
        }
        .center { text-align:center; }
        .bold { font-weight:bold; }
        .line { border-top:1px dashed #000; margin:8px 0; }
        .info-table, .items-table { width:100%; border-collapse:collapse; }
        .info-table td { padding:2px 0; font-size:12px; }
        .info-table td:first-child { font-weight:bold; }
        .info-table td:last-child { text-align:right; }
        .items-table th, .items-table td { padding:4px 2px; font-size:12px; text-align:left; }
        .items-table th { border-bottom:1px solid #000; }
        .items-table td:nth-child(1), .items-table td:nth-child(3), .items-table td:nth-child(4), .items-table td:nth-child(5), .items-table td:nth-child(6) { text-align:right; }
        .totals-box { margin-top:10px; width:100%; }
        .amount-row { display:flex; justify-content:space-between; padding:2px 0; }
        .footer { margin-top:10px; font-size:10px; text-align:center; }
      </style>
    </head>
    <body>
      <div class="receipt-main">

        <!-- Logos -->
        <div class="logo-row">
          <img src="${helpingHandLogoBase64}" alt="Helping Hand Logo"/>
          <img src="${kindrLogoBase64}" alt="Kindr Logo"/>
        </div>

        <!-- Header -->
        <div class="center bold" style="font-size:12px; margin-bottom:10px;">
           KARACHI INSTITUTE OF NEUROLOGICAL<br/>DISEASES AND REHABILITATION
        </div>

        <!-- Info Table -->
        <table class="info-table">
          <tr><td>Date:</td><td>${formattedDate}</td></tr>
          <tr><td>Sale No:</td><td>${saleNo}</td></tr>
          <tr><td>Customer:</td><td>${customerName}</td></tr>
          ${remarks ? `<tr><td>Remarks:</td><td>${remarks}</td></tr>` : ''}
        </table>

        <div class="line"></div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>S#</th>
              <th>Medicine</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Disc</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr>
                <td>${(index+1).toString().padStart(2,'0')}</td>
                <td>${item.medicineName}</td>
                <td>${item.qty}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.discountAmount?.toFixed(2) || '0.00'}</td>
                <td>${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="line"></div>

        <!-- Totals -->
        <div class="totals-box">
          <div class="amount-row"><span>Sub Total:</span><span>${subTotal.toFixed(2)}</span></div>
          <div class="amount-row"><span>Total Discount:</span><span>${totalDiscount.toFixed(2)}</span></div>
          <div class="amount-row bold" style="font-size:14px;">
            <span>Net Total:</span><span>Rs. ${netTotal.toFixed(2)}</span>
          </div>
        </div>

        <!-- Amount in words -->
        <div style="margin-top:10px; font-style:italic; font-size:11px;">
          <span class="bold">In Words:</span> Rs. ${netTotal.toFixed(2)} Only.
        </div>

        <div class="footer">
          Powered by <strong>Kindr</strong>
        </div>

      </div>
    </body>
  </html>
  `
}

export default SaleReceiptTemplate
export type { SaleItem, SaleReceiptProps }