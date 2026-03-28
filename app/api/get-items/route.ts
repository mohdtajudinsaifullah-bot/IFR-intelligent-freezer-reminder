import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json({ error: 'Tiada email diberikan' }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Freezer_DB!A2:G', // Tarik ke kolum G
    });

    const rows = response.data.values || [];
    
    const filteredItems = rows
      .filter((row) => row[1] === userEmail)
      .map((row) => ({
        id: row[0],
        user_email: row[1],
        item_name: row[2],
        expiry_date: row[3],
        location: row[4],
        category: row[5], // Kolum baru F
        status: row[6], // Kolum G
      }));

    return NextResponse.json(filteredItems);
  } catch (error: any) {
    console.error("Error kat backend:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}