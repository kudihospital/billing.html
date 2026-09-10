const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const search = (req.query.search || "").trim();

    let bills;

    if (search) {
      bills = await sql`
        SELECT
          id,
          receipt_no,
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
          remarks,
          created_at
        FROM bills
        WHERE
          receipt_no ILIKE ${"%" + search + "%"}
          OR patient_name ILIKE ${"%" + search + "%"}
          OR mobile ILIKE ${"%" + search + "%"}
        ORDER BY id DESC
        LIMIT 100
      `;
    } else {
      bills = await sql`
        SELECT
          id,
          receipt_no,
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
          remarks,
          created_at
        FROM bills
        ORDER BY id DESC
        LIMIT 100
      `;
    }

    return res.status(200).json({
      success: true,
      bills
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Bills could not be loaded"
    });
  }
};
