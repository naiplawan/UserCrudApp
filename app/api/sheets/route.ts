import { google } from 'googleapis';
import { NextResponse } from 'next/server';

if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
  throw new Error('Missing Google Sheets credentials in environment variables');
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function GET() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    console.log('Auth configured with client email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:Z',
    });

    const rows = response.data.values;
    if (!rows) {
      console.error('No data found in sheet');
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      return headers.reduce((obj: any, header: string, index: number) => {
        obj[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
        return obj;
      }, {});
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Sheet API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sheet data' },
      { status: 500 }
    );
  }
}
