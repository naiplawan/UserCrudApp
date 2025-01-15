'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  if (session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>You are logged in as {session.user?.email}</p>
      </div>
    );
  }

  const handleLogin = () => {
    if (email === 'admin' && password === '1234') {
      onLogin();
    } else {
      alert('Invalid credentials');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Login
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <button
                    onClick={handleLogin}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  >
                    Login with Google
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child> 
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default LoginPage;
