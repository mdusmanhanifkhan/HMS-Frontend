// // import helpingHandLogo from '../../assets/images/helping-hand.jpeg'

// // type Procedure = {
// //   id: number
// //   name: string
// //   fee: number
// // }

// // type Department = {
// //   id: number
// //   name: string
// // }

// // type WelfareRecord = {
// //   discountPercentage?: number
// // }

// // type Patient = {
// //   id: number
// //   name: string
// //   age: number | string
// //   phoneNumber?: string
// //   procedure?: Procedure
// //   department?: Department
// //   welfareRecord?: WelfareRecord
// // }

// // type ReceiptTemplateProps = {
// //   patient: Patient
// // }

// // const ReceiptTemplate = ({ patient }: ReceiptTemplateProps) => {
// //   const today = new Date()
// //   const invoiceNo = `INV/${today.getFullYear()}/${patient.id || '0000'}`
// //   const discount = patient.welfareRecord?.discountPercentage ?? 0
// //   const originalFee = patient.procedure?.fee ?? 0
// //   const discounted = originalFee - (originalFee * discount) / 100

// //   return `
// //   <html>
// //     <head>
// //       <title>Patient Receipt</title>
// //       <style>
// //         body { font-family: Arial, sans-serif; background: #d9f0ff; margin: 0; padding: 20px; }
// //         .receipt-container { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
// //         .header { background: #1b87c9; color: white; display: flex; align-items: center; justify-content: space-between; padding: 15px 25px; }
// //         .header img { height: 60px; }
// //         .header-center { text-align: center; font-size: 12px; line-height: 1.4; }
// //         .receipt-body { padding: 20px; background: #eaf6ff; }
// //         h3 { text-align: center; text-decoration: underline; margin-top: 0; }
// //         table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
// //         th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
// //         th { background: #cce6f9; }
// //         .totals { text-align: right; margin-top: 10px; font-size: 14px; }
// //         .urdu-note { text-align: right; font-family: 'Noto Nastaliq Urdu', serif; font-size: 14px; margin-top: 20px; }
// //       </style>
// //     </head>
// //     <body>
// //       <div class="receipt-container">
// //         <div class="header" style="display: flex; flex-direction: column; align-items: center; background: #1b87c9; color: white; padding: 15px;">
// //     <div style="display: flex; justify-content: space-between; width: 100%; max-width: 700px; align-items: center;">
// //       <img src="../../assets/images/helping-hand.jpeg" alt="Helping Hand logo" style="height: 60px;" />
// //       <img src="../../assets/images/kindr-logo.jpeg" alt="KINDR logo" style="height: 60px;" />
// //     </div>
// //     <div style="text-align: center; margin-top: 10px;">
// //       <h2 style="margin: 0; font-size: 16px; color: #000; font-weight:bold">
// //         Karachi Institute of Neurological Diseases and Rehabilitation - KINDR OPD SLIP
// //       </h2>
// //     </div>
// //   </div>
// //         <div class="receipt-body">
       

// //           <div style="display:flex;justify-content:space-between;margin-top:10px;">
// //             <div>
// //               <p><strong>Invoice Date:</strong> ${today.toLocaleDateString()}</p>
// //               <p><strong>Invoice No:</strong> ${invoiceNo}</p>
// //             </div>
// //             <div>
// //               <p><strong>MR No:</strong> MR${patient.id || ''}</p>
// //               <p><strong>Patient:</strong> ${patient.name}</p>
// //               <p><strong>Age:</strong> ${patient.age}</p>
// //               <p><strong>Mobile:</strong> ${patient.phoneNumber || '-'}</p>
// //             </div>
// //           </div>

// //           <table>
// //             <thead>
// //               <tr>
// //                 <th>Date</th>
// //                 <th>Service</th>
// //                 <th>Description</th>
// //                 <th>Amount</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               <tr>
// //                 <td>${today.toLocaleDateString()}</td>
// //                 <td>${patient.department?.name || '-'}</td>
// //                 <td>${patient.procedure?.name || '-'}</td>
// //                 <td>${originalFee}</td>
// //               </tr>
// //             </tbody>
// //           </table>

// //           <div class="totals">
// //             <p>Subtotal: ${originalFee}</p>
// //             <p>Total Discount: -${discount}%</p>
// //             <p><strong>Total Payable: Rs. ${discounted.toFixed(2)}</strong></p>
// //           </div>

// //           <p class="urdu-note">
// //             تمام طبی او پی ڈی خدمات 31 دسمبر 2025 تک ہیلپنگ ہینڈ فار ایچ ایس ڈی کے تعاون سے مفت ہیں۔
// //           </p>
// //         </div>
// //       </div>
// //     </body>
// //   </html>`
// // }

// // export default ReceiptTemplate


// import helpingHandLogo from '../../assets/images/helping-hand.jpeg'

// type Procedure = {
//   id: number
//   name: string
//   fee: number
// }

// type Department = {
//   id: number
//   name: string
// }

// type WelfareRecord = {
//   discountPercentage?: number
// }

// type Patient = {
//   id: number
//   name: string
//   age: number | string
//   phoneNumber?: string
//   procedure?: Procedure
//   department?: Department
//   doctor?: string
//   welfareRecord?: WelfareRecord
// }

// type ReceiptTemplateProps = {
//   patient: Patient
// }

// const ReceiptTemplate = ({ patient }: ReceiptTemplateProps) => {
//   const today = new Date()
//   const invoiceNo = `INV/${today.getFullYear()}/${patient.id || '0000'}`
//   const discount = patient.welfareRecord?.discountPercentage ?? 0
//   const originalFee = patient.procedure?.fee ?? 0
//   const discounted = originalFee - (originalFee * discount) / 100

//   const formatDate = (date: Date) => {
//     const day = String(date.getDate()).padStart(2, '0')
//     const month = date.toLocaleString('default', { month: 'short' })
//     const year = String(date.getFullYear()).slice(-2)
//     return `${day}-${month}-${year}`
//   }

//   return `
//   <html>
//     <head>
//       <title>KIND-R Receipt</title>
//       <style>
//         body { font-family: monospace; font-size: 12px; margin: 0; padding: 10px; }
//         .receipt-container { width: 280px; margin: auto; }
//         .header { text-align: center; }
//         .header img { height: 50px; margin-bottom: 5px; }
//         .details, .charges, .totals { width: 100%; margin-top: 5px; }
//         .details p, .totals p { margin: 2px 0; }
//         table { width: 100%; border-collapse: collapse; margin-top: 5px; }
//         th, td { border-bottom: 1px dashed #000; padding: 2px 0; text-align: left; }
//         th { text-align: left; }
//         .totals { text-align: right; }
//         .center { text-align: center; }
//       </style>
//     </head>
//     <body>
//       <div class="receipt-container">
//         <div class="header">
//           <img src="../../assets/images/helping-hand.jpeg" alt="Helping Hand Logo" />
//           <img src="../../assets/images/kindr-logo.jpeg" alt="KIND-R Logo" />
//           <p><strong>KIND-R</strong></p>
//           <p>Karachi Institute of Neurological Diseases and Rehabilitation - KINDR OPD SLIP</p>
//         </div>

//         <div class="details">
//           <p>Date: ${formatDate(today)}</p>
//           <p>Receipt No.: ${invoiceNo}</p>
//           <p>M.R #: MR${patient.id || ''}</p>
//           <p>Patient Name: ${patient.name}</p>
//           <p>Age: ${patient.age}</p>
//           <p>Department: ${patient.department?.name || '-'}</p>
//           <p>Doctor: ${patient.doctor || '-'}</p>
//           <p>Services: ${patient.procedure?.name || '-'}</p>
//           <p>Charges: Rs. ${originalFee}</p>
//         </div>

//         <table class="charges">
//           <thead>
//             <tr>
//               <th>S#</th>
//               <th>Item Description</th>
//               <th>Report Issue Date</th>
//               <th>QTY</th>
//               <th>Rate</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>1</td>
//               <td>${patient.procedure?.name || '-'}</td>
//               <td>${formatDate(today)}</td>
//               <td>1</td>
//               <td>${originalFee}</td>
//               <td>${originalFee}</td>
//             </tr>
//           </tbody>
//         </table>

//         <div class="totals">
//           <p>Subtotal: Rs. ${originalFee}</p>
//           <p>Discount: -${discount}%</p>
//           <p><strong>Net Amount: Rs. ${discounted.toFixed(2)}</strong></p>
//         </div>

//         <div class="center">
//           <p>تمام طبی او پی ڈی خدمات 31 دسمبر 2025 تک ہیلپنگ ہینڈ فار ایچ ایس ڈی کے تعاون سے مفت ہیں۔</p>
//         </div>
//       </div>
//     </body>
//   </html>
//   `
// }

// export default ReceiptTemplate
import helpingHandLogo from '../../assets/images/helping-hand.jpeg'
import kindrLogo from '../../assets/images/kindr-logo.jpeg'

type Procedure = {
  id: number
  name: string
  fee: number
}
//commit

type Department = {
  id: number
  name: string
}

type WelfareRecord = {
  discountPercentage?: number
}

type Patient = {
  id: number
  name: string
  age: number | string
  phoneNumber?: string
  procedure?: Procedure
  department?: Department
  welfareRecord?: WelfareRecord
  doctorName?: string
}

type ReceiptTemplateProps = {
  patient: Patient
}

const ReceiptTemplate = ({ patient }: ReceiptTemplateProps) => {
  const today = new Date()
  
  // Format Date: 27-Dec-25 (Current Date 2025)
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  }).replace(/ /g, '-')

  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = String(today.getFullYear()).slice(-2)
  const receiptNo = `${year}/${month}/${String(patient.id).padStart(5, '0')}`

  const discount = patient.welfareRecord?.discountPercentage ?? 0
  const originalFee = patient.procedure?.fee ?? 0
  const discountAmount = (originalFee * discount) / 100
  const netAmount = originalFee - discountAmount


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
        
        .info-table { width: 100%; margin: 10px 0; }
        .info-table td { padding: 2px 0; }
        
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
          <img src="${helpingHandLogo}" style="height: 45px; width: auto;" />
          <img src="${kindrLogo}" style="height: 45px; width: auto;" />
        </div>

        <div class="center" style="font-size: 10px; margin-bottom: 10px;">
          KARACHI INSTITUTE OF NEUROLOGICAL<br/>DISEASES AND REHABILITATION
        </div>

        <div class="line"></div>

        <!-- Patient Info -->
        <table class="info-table">
          <tr><td class="bold">Date:</td><td>${formattedDate}</td></tr>
          <tr><td class="bold">Receipt No:</td><td>${receiptNo}</td></tr>
          <tr><td class="bold">M.R #:</td><td>MR-${patient.id}</td></tr>
          <tr><td class="bold">Patient:</td><td>${patient.name}</td></tr>
          <tr><td class="bold">Age/Sex:</td><td>${patient.age}</td></tr>
          <tr><td class="bold">Department:</td><td>${patient.department?.name || '-'}</td></tr>
          <tr><td class="bold">Doctor:</td><td>${patient.doctorName || 'General OPD'}</td></tr>
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
          <div class="amount-row"><span>Discount:</span><span>-${discountAmount.toFixed(2)}</span></div>
          <div class="amount-row bold" style="font-size: 14px;">
            <span>Net Amount:</span><span>Rs. ${netAmount.toFixed(2)}</span>
          </div>
        </div>

        <!-- Amount in words -->
        <div style="margin-top: 10px; font-style: italic; font-size: 11px;">
          <span class="bold">In Words:</span> Rs. ${netAmount.toFixed(0)} Only.
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

export default ReceiptTemplate;
