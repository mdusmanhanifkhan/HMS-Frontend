type Procedure = {
  id: number;
  name: string;
  fee: number;
};

type Department = {
  id: number;
  name: string;
};

type WelfareRecord = {
  discountPercentage?: number;
};

type Patient = {
  id: number;
  name: string;
  age: number | string;
  phoneNumber?: string;
  procedure?: Procedure;
  department?: Department;
  welfareRecord?: WelfareRecord;
};

type ReceiptTemplateProps = {
  patient: Patient;
};

const ReceiptTemplate = ({ patient }: ReceiptTemplateProps) => {
  const today = new Date();
  const invoiceNo = `INV/${today.getFullYear()}/${patient.id || "0000"}`;
  const discount = patient.welfareRecord?.discountPercentage ?? 0;
  const originalFee = patient.procedure?.fee ?? 0;
  const discounted = originalFee - (originalFee * discount) / 100;

  return `
  <html>
    <head>
      <title>Patient Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; background: #d9f0ff; margin: 0; padding: 20px; }
        .receipt-container { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
        .header { background: #1b87c9; color: white; display: flex; align-items: center; justify-content: space-between; padding: 15px 25px; }
        .header img { height: 60px; }
        .header-center { text-align: center; font-size: 12px; line-height: 1.4; }
        .receipt-body { padding: 20px; background: #eaf6ff; }
        h3 { text-align: center; text-decoration: underline; margin-top: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
        th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
        th { background: #cce6f9; }
        .totals { text-align: right; margin-top: 10px; font-size: 14px; }
        .urdu-note { text-align: right; font-family: 'Noto Nastaliq Urdu', serif; font-size: 14px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <img src="/logo-left.png" alt="Helping Hand" />
          <div class="header-center">
            <h2>KINDR - Karachi Institute of Neurological Diseases and Rehabilitation</h2>
            <p>P8-17, Sector 3A, Blk 3, Gulzar Hijri Scheme-33 Main Super Highway, Karachi<br/>Phone: 021-34172053</p>
          </div>
          <img src="/logo-right.png" alt="KINDR" />
        </div>
        <div class="receipt-body">
          <h3>Patient Receipt</h3>

          <div style="display:flex;justify-content:space-between;margin-top:10px;">
            <div>
              <p><strong>Invoice Date:</strong> ${today.toLocaleDateString()}</p>
              <p><strong>Invoice No:</strong> ${invoiceNo}</p>
            </div>
            <div>
              <p><strong>MR No:</strong> MR${patient.id || ""}</p>
              <p><strong>Patient:</strong> ${patient.name}</p>
              <p><strong>Age:</strong> ${patient.age}</p>
              <p><strong>Mobile:</strong> ${patient.phoneNumber || "-"}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${today.toLocaleDateString()}</td>
                <td>${patient.department?.name || "-"}</td>
                <td>${patient.procedure?.name || "-"}</td>
                <td>${originalFee}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <p>Subtotal: ${originalFee}</p>
            <p>Total Discount: -${discount}%</p>
            <p><strong>Total Payable: Rs. ${discounted.toFixed(2)}</strong></p>
          </div>

          <p class="urdu-note">
            تمام طبی او پی ڈی خدمات 31 دسمبر 2025 تک ہیلپنگ ہینڈ فار ایچ ایس ڈی کے تعاون سے مفت ہیں۔
          </p>
        </div>
      </div>
    </body>
  </html>`;
};

export default ReceiptTemplate;
