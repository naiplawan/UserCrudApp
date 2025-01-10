import { NextApiRequest, NextApiResponse } from 'next';
import { createNewSheet } from '@/app/utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { data } = req.body;
    try {
      const url = await createNewSheet(data);
      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
