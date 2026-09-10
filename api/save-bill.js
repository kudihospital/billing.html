const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const {
      patientName,
      mobile,
      age,
      address,
      consultant,
      department,
      patientType,
      treatment,
      sessions,
      rate,
      grossAmount,
      discountPercent,
      discountAmount,
      netAmount,
      paymentMode,
      receivedAmount,
      dueAmount,
      preparedBy,
      remarks
    } = req.body;

    const result = await sql`
      INSERT INTO bills (
        patient_name,
        mobile,
        age,
        address,
        consultant,
        department,
        patient_type,
        treatment,
        sessions,
        rate,
        gross_amount,
        discount_percent,
        discount_amount,
        net_amount,
        payment_mode,
        received_amount,
        due_amount,
        prepared_by,
        remarks
      )
      VALUES (
        ${patientName},
        ${mobile},
        ${age || null},
        ${address},
        ${consultant},
        ${department},
        ${patientType},
        ${treatment},
        ${sessions || 0},
        ${rate || 0},
        ${grossAmount || 0},
        ${discountPercent || 0},
        ${discountAmount || 0},
        ${netAmount || 0},
        ${paymentMode},
        ${receivedAmount || 0},
        ${dueAmount || 0},
        ${preparedBy},
        ${remarks}
      )
      RETURNING receipt_no, created_at
    `;

    return res.status(200).json({
      success: true,
      receiptNo: result[0].receipt_no,
      createdAt: result[0].created_at
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Bill could not be saved"
    });
  }
};
