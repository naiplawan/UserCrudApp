import React from 'react';
import { signIn } from 'next-auth/react';
import { LoginProps } from '@/app/interface/index';


const Login = ({ onLoginSuccess }: LoginProps) => {
  const handleLogin = async () => {
    try {
      const response = await signIn('google', { redirect: false });
      if (response?.ok) {
        onLoginSuccess(response);
      } else {
        console.log('Login Failed');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
