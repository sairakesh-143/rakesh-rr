import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const FirebaseTest = () => {
  const [status, setStatus] = useState<string>('Testing Firebase connection...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test Firestore connection
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        setStatus('Firebase connection successful!');
      } catch (error: any) {
        console.error('Firebase error:', error);
        setError(`Firebase Error: ${error.message}`);
        setStatus('Firebase connection failed');
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Firebase Connection Test</h3>
      <p className={`text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
        {status}
      </p>
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;
