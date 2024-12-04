'use client'; // This is a Client Component 

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UploadForm from '../components/uploadForm';
import Snowfall from '../components/Snowfall';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const groups = session.groups || [];
      if (groups.includes('pbs_students')) {
        router.push('/upload'); // Redirect to the upload page
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-100">
        <p className="text-xl font-medium text-gray-600">Loading, please wait...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center">
      <Snowfall /> {/* Add the snowfall effect */}
      <div className="text-center p-8 bg-white bg-opacity-80 rounded-lg shadow-lg">
        {/* Add Logo */}
        <img
          src="/logo.png" // Ensure the logo is placed in the `public` folder
          alt="Technomaniaks"
          className="mx-auto mb-6 w-24 h-24 object-contain"
        />
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          {status === 'authenticated' ? "You are ready to go!" : "Welcome to TECHNOMANIAKS"}
        </h1>
        {status === 'authenticated' ? (
          <>
            <h2 className="text-2xl text-gray-700 mb-6">
              Hello, {session.user?.name}! Send your files directly to Azure Blob!
            </h2>
            <UploadForm /> {/* Render the upload form for authenticated users */}
          </>
        ) : (
          <>
            <h2 className="text-xl text-gray-600 mb-4">Please sign in to continue</h2>
            <button
              onClick={() => signIn('okta').catch(error => alert('Sign-in failed. Please try again.'))}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              aria-label="Sign in with Okta"
            >
              Click here to sign in!
            </button>
          </>
        )}
      </div>
    </div>
  );
}
