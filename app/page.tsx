'use client'
import { useState, useEffect } from 'react';
import Login from '@/app/components/Login';
import UserTable from '@/app/components/UserTable';
import ExportButton from '@/app/components/ExportButton';
import { User } from '@/app/interface/index';
import { fetchSheetData } from '@/app/utils/api'

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSheetData();
      setUserData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => setIsLoginOpen(true)}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Login
      </button>
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <UserTable data={userData} />
      <ExportButton data={userData} />
    </div>
  );
};

export default Home;
