import { google } from 'googleapis';
import { User } from '@/app/interface/index';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export const fetchSheetData = async (): Promise<User[]> => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: 'Sheet1',
  });

  const rows = response.data.values || [];
  return rows.slice(1).map((row) => ({
    id: row[0],
    first_name: row[1],
    last_name: row[2],
    email: row[3],
    gender: row[4],
    city: row[5],
    country: row[6],
    country_code: row[7],
    state: row[8],
    street_address: row[9],
    job_title: row[10],
    company_name: row[11],
    photo: row[12],
  }));
};

export const createNewSheet = async (data) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.create({
    resource: {
      properties: {
        title: 'New Sheet',
      },
      sheets: [
        {
          data: [
            {
              rowData: data.map((row) => ({
                values: Object.values(row).map((cell) => ({ userEnteredValue: { stringValue: cell } })),
              })),
            },
          ],
        },
      ],
    },
  });

  return response.data.spreadsheetUrl;
};
