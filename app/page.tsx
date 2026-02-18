"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {

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
              Dart-Smith.com
            </h1>
          </div>

          {/* Welcome Section */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="bg-gray-900 border border-silver rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-silver mb-6">Welcome</h2>


                <div className="space-y-4">
                  <p className="text-gray-200 text-lg leading-relaxed">
                    Welcome to Dart-Smith.com.
                    The plan is to build a collection of fun games that taught me how to play the game.
                    You will find variations on some traditional games, as well as some fun multiplayer games.
                    Feel free to use this app for practicing whilst I get building.
                  </p>
                </div>
            </div>
          </div>

          {/* Navigation/Action Buttons */}
          <div className="space-y-4 text-center">
            <Link
              href="/SuperCricket"
              className="inline-block px-8 py-4 bg-gradient-to-r from-white to-silver text-black font-bold text-xl rounded-lg shadow-lg"
            >
              Play Super Cricket
            </Link>

            <div className="text-sm text-gray-400 mt-4">
              More games coming soon...
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
