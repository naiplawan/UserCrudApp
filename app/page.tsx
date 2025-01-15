'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import LoginPage from '@/app/components/LoginPage';
import UserTable from '@/app/components/UserTable';
import NavBar from '@/app/components/NavBar';
import { User } from '@/app/interface/index';

const Home = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User[]>([]);

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
    <div className="min-h-screen bg-gray-100 text-black">
      <NavBar />
      <div className="p-4">
        <UserTable data={userData} />
      </div>
    </div>
  );
};

export default Home;
