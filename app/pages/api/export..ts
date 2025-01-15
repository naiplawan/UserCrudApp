import { NextApiRequest, NextApiResponse } from 'next';
import { createNewSheet } from '@/app/pages/api/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { data } = req.body;
    try {
      const url = await createNewSheet(data);
      res.status(200).json({ url });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
