import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.sub;
      return session;
    },
  },
});
