const { google } = require('googleapis');
const sheets = google.sheets('v4');

exports.handler = async (event, context) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    const res = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Evaluation!C:F', // Adjust to your sheet’s range
    });
    return {
      statusCode: 200,
      body: JSON.stringify(res.data.values),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};