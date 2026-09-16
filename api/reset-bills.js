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
    await sql`DELETE FROM bills`;

    try {
      await sql`
        SELECT setval(
          pg_get_serial_sequence('bills', 'id'),
          1,
          false
        )
      `;
    } catch (sequenceError) {
      console.log(
        "ID sequence reset skipped:",
        sequenceError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "All old bills deleted successfully."
    });

  } catch (error) {
    console.error("RESET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Old bills could not be deleted",
      error: error.message
    });
  }
};
