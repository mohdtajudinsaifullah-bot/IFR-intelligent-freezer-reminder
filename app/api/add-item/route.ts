import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Tarik user_email dari website
    const { user_email, item_name, expiry_date } = body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Freezer_DB!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        // Guna user_email sebenar yang dihantar dari depan
        values: [[Date.now(), user_email, item_name, expiry_date, 'Active']],
      },
    });

    return NextResponse.json({ message: 'Berjaya masuk Sheet!' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}