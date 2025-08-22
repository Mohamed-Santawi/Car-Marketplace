import React, { useState } from 'react';
import { testFirestoreConnection } from '../services/carService';
import { getCompleteFirestoreRules } from '../services/firebase';

const FirestoreTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const result = await testFirestoreConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult(false);
      console.error('Test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeRules = getCompleteFirestoreRules();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Firebase Firestore Connection Test</h1>

          <div className="mb-6">
            <button
              onClick={runTest}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {isLoading ? 'Testing...' : 'Run Firestore Connection Test'}
            </button>
          </div>

          {testResult !== null && (
            <div className={`p-4 rounded-lg ${testResult ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
              <h3 className={`font-semibold ${testResult ? 'text-green-800' : 'text-red-800'}`}>
                {testResult ? '✅ Test Passed!' : '❌ Test Failed!'}
              </h3>
              <p className={`mt-2 ${testResult ? 'text-green-700' : 'text-red-700'}`}>
                {testResult
                  ? 'Firestore connection is working properly. You should be able to submit car advertisements.'
                  : 'Firestore connection failed. Check the console for detailed error information.'
                }
              </p>
            </div>
          )}

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">🔧 How to Fix Firestore Permissions</h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700">
              <li>
                <strong>Go to Firebase Console:</strong>
                <br />
                <a
                  href="https://console.firebase.google.com/project/readura-app-112fa/firestore/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://console.firebase.google.com/project/readura-app-112fa/firestore/rules
                </a>
              </li>
              <li>
                <strong>Replace the current rules</strong> with exactly this:
                <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 text-sm overflow-x-auto">
{completeRules}
                </pre>
              </li>
              <li><strong>Click "Publish"</strong> button</li>
              <li><strong>Wait 2-3 minutes</strong> for rules to propagate</li>
              <li><strong>Refresh this page</strong> and run the test again</li>
            </ol>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Also Update Storage Rules</h3>
            <p className="text-blue-700 mb-2">
              You also need to update Firebase Storage rules for image uploads:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>
                <strong>Go to Storage Rules:</strong>
                <br />
                <a
                  href="https://console.firebase.google.com/project/readura-app-112fa/storage/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://console.firebase.google.com/project/readura-app-112fa/storage/rules
                </a>
              </li>
              <li>
                <strong>Replace with:</strong>
                <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 text-sm overflow-x-auto">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Allow all access for development
    }
  }
}`}
                </pre>
              </li>
              <li><strong>Click "Publish"</strong></li>
            </ol>
          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">🎯 Collections That Need Access</h3>
            <p className="text-green-700 mb-2">
              The updated rules now include access to all necessary collections:
            </p>
            <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
              <li><strong>carAdvertisements</strong> - Car ads submitted by users</li>
              <li><strong>admins</strong> - Admin user profiles</li>
              <li><strong>users</strong> - Regular user profiles</li>
              <li><strong>orders</strong> - Order data for analytics</li>
              <li><strong>customers</strong> - Customer data for analytics</li>
              <li><strong>analytics</strong> - Analytics data</li>
              <li><strong>test</strong> - Testing purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreTest;