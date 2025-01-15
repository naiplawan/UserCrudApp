'use client';

import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import LogoutModal from '@/app/components/LogoutModal';
const NavBar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">User Data Manager</div>
        <button
          onClick={openLogoutModal}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center"
        >
          <FiLogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
      <LogoutModal isOpen={isLogoutModalOpen} closeModal={closeLogoutModal} />
    </nav>
  );
};

export default NavBar;
