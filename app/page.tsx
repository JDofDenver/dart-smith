"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [welcomeText, setWelcomeText] = useState(
    "Welcome to Dart-Smith, your premier destination for innovative dart scoring and game management. Experience precision scoring with our advanced cricket game variants and more exciting features coming soon."
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWelcomeText(e.target.value);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="h-screen overflow-hidden md:overflow-hidden lg:overflow-auto bg-black">
      {/* Silver border with black background */}
      <div className="h-full border-4 border-silver bg-black">
        <div className="h-full bg-black text-white flex flex-col items-center justify-center p-8">

          {/* Title Section - Centered */}
          <div className="text-center mb-12">
            <p className="text-lg text-gray-300 mb-4 font-light tracking-wide">
              Welcome to
            </p>
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-gradient-to-r from-silver via-white to-silver bg-clip-text drop-shadow-lg tracking-tight">
              Dart-Smith
            </h1>
          </div>

          {/* Welcome Section */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="bg-gray-900 border border-silver rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-silver mb-6">Welcome</h2>

              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={welcomeText}
                    onChange={handleTextChange}
                    className="w-full h-32 bg-black border border-gray-600 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-silver"
                    placeholder="Edit your welcome message..."
                  />
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {welcomeText}
                  </p>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-silver rounded font-medium transition-colors"
                  >
                    Edit Welcome Text
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation/Action Buttons */}
          <div className="space-y-4 text-center">
            <Link
              href="/SuperCricket"
              className="inline-block px-8 py-4 bg-gradient-to-r from-silver to-gray-400 text-black font-bold text-xl rounded-lg hover:from-white hover:to-silver transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Play Super Cricket
            </Link>

            <div className="text-sm text-gray-400 mt-4">
              More games coming soon...
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .border-silver {
          border-color: #C0C0C0;
        }
        .text-silver {
          color: #C0C0C0;
        }
        .bg-silver {
          background-color: #C0C0C0;
        }
        .from-silver {
          --tw-gradient-from: #C0C0C0;
        }
        .to-silver {
          --tw-gradient-to: #C0C0C0;
        }
        .hover\\:to-silver:hover {
          --tw-gradient-to: #C0C0C0;
        }
      `}</style>
    </div>
  );
}
