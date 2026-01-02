import helpingHandLogoBase64 from '../../assets/images/helping-hand.jpeg'
import kindrLogoBase64 from '../../assets/images/kindr-logo.jpeg'

type Procedure = {
  id: number
  name: string
  fee: number
}

type Department = {
  id: number
  name: string
}

type WelfareRecord = {
  discountPercentage?: number
}

type Doctor = {
  id: number
  name: string
}

type Patient = {
  id: number
  name: string
  age: number | string
  phoneNumber?: string | null
  procedure?: Procedure
  department?: Department
  welfareRecord?: WelfareRecord
  doctor?: Doctor
  patientId?: number
  discountPercentage?: number
  fees?: string
  netFees?: number
}

type ReceiptTemplateProps = {
  patient: Patient
}

const ReceiptTemplate = ({ patient }: ReceiptTemplateProps) => {
  const today = new Date()

  const formattedDate = today
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    })
    .replace(/ /g, '-')

  const originalFee = patient.procedure?.fee ?? 0

  return `
  <html>
    <head>
      <title>KINDR Receipt</title>
      <style>
        /* Thermal Printer Center Alignment */
        html, body { 
          margin: 0; 
          padding: 0; 
          width: 100%; 
          display: flex; 
          justify-content: center; 
          background-color: #f0f0f0; /* Visual aid for browser only */
        }
        
        .receipt-main { 
           width: 80mm; 
          min-height: 210mm; 
          max-height: 210mm;
          background: white; 
          padding: 10px; 
          font-family: 'Courier New', Courier, monospace; 
          font-size: 12px; 
          color: #000;
          box-sizing: border-box;
        }

        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 8px 0; }
        
        .logo-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 5px;
        }
        
        .info-table {
  width: 100%;
  margin: 10px 0;
}

.info-table tr {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-table td {
  padding: 2px 0;
  font-size: 12px;
}

/* Left column */
.info-table td:first-child {
  font-weight: bold;
}

/* Right column fully right-aligned */
.info-table td:last-child {
  text-align: right;
  flex-shrink: 0;
}

        
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th { border-bottom: 1px solid #000; text-align: left; }
        
        .totals-box { margin-top: 10px; width: 100%; }
        .amount-row { display: flex; justify-content: space-between; padding: 2px 0; }
        
        .urdu-text { 
          direction: rtl; 
          font-size: 14px; 
          margin: 15px 0; 
          font-family: 'Arial', sans-serif; 
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="receipt-main">
        <!-- Top Logos -->
        <div class="logo-row">
         <img src="${helpingHandLogoBase64}" style="height: 45px; width: auto;" />
         <img src="${kindrLogoBase64}" style="height: 45px; width: auto;" />
        </div>

        <div class="center bold" style="font-size: 10px; margin-bottom: 10px;">
          KARACHI INSTITUTE OF NEUROLOGICAL<br/>DISEASES AND REHABILITATION
        </div>

        <div class="line"></div>

        <!-- Patient Info -->
        <table class="info-table">
          <tr><td class="bold">Date:</td><td>${formattedDate}</td></tr>
          <tr><td class="bold">M.R #:</td><td>MR-${patient.patientId}</td></tr>
          <tr><td class="bold">Patient:</td><td>${patient.name}</td></tr>
          <tr><td class="bold">Age:</td><td>${patient.age}</td></tr>
          <tr><td class="bold">Department:</td><td>${patient.department?.name || '-'}</td></tr>
          <tr><td class="bold">Doctor:</td><td>${patient.doctor?.name || 'General OPD'}</td></tr>
        </table>

        <div class="line"></div>

        <!-- Services -->
        <table class="items-table">
          <thead>
            <tr>
              <th width="15%">S#</th>
              <th width="55%">Description</th>
              <th width="30%" style="text-align:right">Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01</td>
              <td>${patient.procedure?.name || 'Service'}<br/><small>Qty: 1</small></td>
              <td style="text-align:right">${originalFee.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="line"></div>

        <!-- Totals -->
        <div class="totals-box">
          <div class="amount-row"><span>Total Amount:</span><span>${originalFee.toFixed(2)}</span></div>
          <div class="amount-row"><span>Discount:</span><span>${patient.discountPercentage} %</span></div>
          <div class="amount-row bold" style="font-size: 14px;">
            <span>Net Amount:</span><span>Rs. ${patient.netFees}</span>
          </div>
        </div>

        <!-- Amount in words -->
        <div style="margin-top: 10px; font-style: italic; font-size: 11px;">
          <span class="bold">In Words:</span> Rs. ${patient.netFees} Only.
        </div>

        <div class="line"></div>

        <!-- OPD Free Note -->
        <div class="urdu-text">
          تمام طبی او پی ڈی خدمات فروری 2026 تک ہیلپنگ ہینڈ کے تعاون سے مفت ہیں۔
        </div>

        <div class="center" style="margin-top: 15px;">
          <div class="bold" style="font-size: 13px;">Thank you for visiting KIND-R </div>
          <small>Software by KINDR IT Dept</small>
        </div>
      </div>
    </body>
  </html>`
}

export default ReceiptTemplate
export type { Patient }
