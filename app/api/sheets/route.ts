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
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function GET() {
  try {
    console.log('Auth configured with client email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    const sheetName = spreadsheet.data.sheets?.[0].properties?.title;
    if (!sheetName) {
      throw new Error('No sheets found in spreadsheet');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A1:Z`,
    });

    if (!response.data.values) {
      console.error('No data found in sheet');
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const rows = response.data.values;
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
      { error: 'Failed to fetch sheet data', details: (error as any).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `Exported Data ${new Date().toISOString()}`,
        },
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;

    if (!spreadsheetId) {
      throw new Error('Failed to create spreadsheet');
    }

    const headers = Object.keys(data[0]);
    const rows: (string | number)[][] = [
      headers,
      ...data.map((item: Record<string, string | number>) => headers.map((header: string) => item[header])),
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: rows,
      },
    });

    return NextResponse.json({
      url: spreadsheet.data.spreadsheetUrl,
      spreadsheetId
    });
  } catch (error) {
    console.error('Sheet API Error:', error);
    return NextResponse.json({ error: 'Failed to export data', details: (error as any).message }, { status: 500 });
  }
}
