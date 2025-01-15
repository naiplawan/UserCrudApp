'use client'
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import LoginPage from '@/app/components/LoginPage';
import UserTable from '@/app/components/UserTable';
import ExportButton from '@/app/components/ExportButton';
import { User } from '@/app/interface/index';

const Home = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const response = await fetch('/api/sheets');
        const data = await response.json();
        setUserData(data);
      };
      fetchData();
    }
  }, [session]);

  if (!session) {
    return <LoginPage onLogin={() => signIn()} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
      <UserTable data={userData} />
      <ExportButton data={userData} />
    </div>
  );
};

export default Home;
