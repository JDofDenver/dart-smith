"use client";

import Link from 'next/link';

export default function GameSelection() {
  return (
    <div className="h-screen overflow-hidden md:overflow-hidden lg:overflow-auto bg-black">
      {/* Silver border with black background */}
      <div className="h-full border-4 border-silver bg-black">
        <div className="h-full bg-black text-white flex flex-col items-center justify-center p-8">

          {/* Back Button */}
          <div className="absolute top-8 left-8">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 border border-silver text-silver rounded-lg hover:bg-gray-700 transition-all"
            >
              ← Back
            </Link>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-silver via-white to-silver bg-clip-text drop-shadow-lg tracking-tight mb-4">
              Choose Your Game
            </h1>
            <p className="text-lg text-gray-300 font-light tracking-wide">
              Select a dart game to get started
            </p>
          </div>

          {/* Game Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">

            {/* Cricket Game Card */}
            <Link href="/Cricket">
              <div className="bg-gray-900 border-2 border-silver rounded-lg p-8 hover:bg-gray-800 transition-all transform hover:scale-105 cursor-pointer shadow-lg">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-silver mb-4">Cricket</h2>
                  <div className="text-gray-300 space-y-3">
                    <p className="text-lg">The classic dart game</p>
                    <div className="text-sm space-y-1">
                      <p>• Target numbers: 15, 16, 17, 18, 19, 20, Bull</p>
                      <p>• Close numbers with 3 marks each</p>
                      <p>• Score points while numbers are open</p>
                      <p>• Perfect for beginners and pros alike</p>
                    </div>
                  </div>
                  <div className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-white to-silver text-black font-bold rounded-lg">
                    Play Cricket
                  </div>
                </div>
              </div>
            </Link>

            {/* Super Cricket Game Card */}
            <Link href="/SuperCricket">
              <div className="bg-gray-900 border-2 border-silver rounded-lg p-8 hover:bg-gray-800 transition-all transform hover:scale-105 cursor-pointer shadow-lg">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-silver mb-4">Super Cricket</h2>
                  <div className="text-gray-300 space-y-3">
                    <p className="text-lg">Cricket with extra challenges</p>
                    <div className="text-sm space-y-1">
                      <p>• All numbers from 15-20, plus Bull</p>
                      <p>• Additional Double and Triple targets</p>
                      <p>• More strategic gameplay</p>
                      <p>• For experienced players</p>
                    </div>
                  </div>
                  <div className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-white to-silver text-black font-bold rounded-lg">
                    Play Super Cricket
                  </div>
                </div>
              </div>
            </Link>

          </div>

          {/* Coming Soon Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-lg mb-4">More games coming soon...</p>
            <div className="text-sm text-gray-500">
              501, Around the Clock, and more!
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Powered by{' '}
              <a
                href="https://theGratefulDev.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-silver transition-colors underline"
              >
                theGratefulDev.xyz
              </a>
            </p>
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
