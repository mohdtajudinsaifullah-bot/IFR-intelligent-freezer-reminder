import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { item_id } = body; // Terima ID barang untuk dipadam

    if (!item_id) {
      return NextResponse.json({ error: 'Tiada ID barang diberikan' }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Langkah 1: Cari baris mana yang ada ID tu
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Freezer_DB!A:A', // Baca kolum A (ID) sahaja
    });

    const rows = response.data.values || [];
    let rowIndex = -1;

    // Cari baris yang sepadan dengan ID
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === String(item_id)) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Barang tidak dijumpai' }, { status: 404 });
    }

    // Langkah 2: Padam baris tersebut ( rowIndex + 1 sebab Sheet guna 1-based index )
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Id Sheet Freezer_DB. Kalau lain, kena ubah.
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ message: 'Barang berjaya dipadam bro!' });
  } catch (error: any) {
    console.error("Error padam backend:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}