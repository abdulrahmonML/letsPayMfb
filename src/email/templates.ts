interface TransferEmailTemplateParams {
  transactionRef: string;
  amount: number;
  recipientName: string;
  recipientAccountNumber: string;
  recipientBank: string;
  newBalance: number;
  timestamp: Date;
}

const transferEmailTemplate = ({
  transactionRef,
  amount,
  recipientName,
  recipientAccountNumber,
  recipientBank,
  newBalance,
  timestamp,
}: TransferEmailTemplateParams): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #0f172a;
        font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
        color: #0f172a;
      }

      .wrapper {
        max-width: 480px;
        margin: 40px auto;
        padding: 0 16px;
      }

      .card {
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      }

      .header {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        text-align: center;
        padding: 32px 20px;
      }

      .check {
        font-size: 32px;
        margin-bottom: 10px;
      }

      .header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }

      .amount {
        text-align: center;
        padding: 28px 20px 12px;
        font-size: 32px;
        font-weight: 700;
        color: #0f172a;
      }

      .status {
        text-align: center;
        font-size: 12px;
        color: #16a34a;
        font-weight: 600;
        margin-bottom: 20px;
      }

      .section {
        padding: 20px;
      }

      .row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        font-size: 14px;
        border-bottom: 1px solid #f1f5f9;
      }

      .row:last-child {
        border-bottom: none;
      }

      .label {
        color: #64748b;
      }

      .value {
        color: #0f172a;
        font-weight: 500;
        text-align: right;
      }

      .highlight {
        font-weight: 600;
        color: #16a34a;
      }

      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #94a3b8;
      }

    </style>
  </head>

  <body>
    <div class="wrapper">
      <div class="card">

        <div class="header">
          <div class="check">✔</div>
          <h1>Transfer Successful</h1>
        </div>

        <div class="amount">₦${amount}</div>
        <div class="status">COMPLETED</div>

        <div class="section">

          <div class="row">
            <div class="label">Transaction Ref</div>
            <div class="value">${transactionRef}</div>
          </div>

          <div class="row">
            <div class="label">Recipient</div>
            <div class="value">${recipientName}</div>
          </div>

          <div class="row">
            <div class="label">Account Number</div>
            <div class="value">${recipientAccountNumber}</div>
          </div>

          <div class="row">
            <div class="label">Bank</div>
            <div class="value">${recipientBank}</div>
          </div>

          <div class="row">
            <div class="label">New Balance</div>
            <div class="value highlight">₦${newBalance}</div>
          </div>

          <div class="row">
            <div class="label">Date & Time</div>
            <div class="value">${timestamp}</div>
          </div>

        </div>

        <div class="footer">
          If this wasn’t you, contact support immediately.
        </div>

      </div>
    </div>
  </body>
  </html>
  `;
};

export default transferEmailTemplate;
