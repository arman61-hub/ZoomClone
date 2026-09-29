'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#242A38] text-slate-300 py-10 px-6 lg:px-12 text-xs font-sans mt-auto select-none border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        {/* About */}
        <div>
          <h4 className="font-bold text-white text-xs mb-3">About</h4>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li><a href="#" className="hover:text-white transition-colors">Zoom Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Customers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sustainability &amp; ESG</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Zoom Cares</a></li>
          </ul>
        </div>

        {/* Download */}
        <div>
          <h4 className="font-bold text-white text-xs mb-3">Download</h4>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li><a href="#" className="hover:text-white transition-colors">Zoom Workplace App</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Zoom Rooms Client</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Browser Extension</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Outlook Plug-in</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Android App</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Zoom Virtual Backgrounds</a></li>
          </ul>
        </div>

        {/* Sales */}
        <div>
          <h4 className="font-bold text-white text-xs mb-3">Sales</h4>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li className="font-bold text-white">0008000503335</li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Plans &amp; Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Request a Demo</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Webinars and Events</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Zoom Experience Center</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-white text-xs mb-3">Support</h4>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li><a href="#" className="hover:text-white transition-colors">Test Zoom</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Account</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Learning Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Zoom Community</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Developer support</a></li>
          </ul>
        </div>
      </div>

      {/* Language & Currency Dropdowns */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-700/60 gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-slate-800/90 px-3 py-1.5 rounded border border-slate-700 text-slate-200 text-[11px]">
            <span>Language: </span>
            <span className="font-bold">English v</span>
          </div>

          <div className="bg-slate-800/90 px-3 py-1.5 rounded border border-slate-700 text-slate-200 text-[11px]">
            <span>Currency: </span>
            <span className="font-bold">Indian Rupee ₹ v</span>
          </div>
        </div>

        {/* Copyright Bar matching Image 1 & 2 */}
        <p className="text-[10px] text-slate-400 text-center md:text-right leading-relaxed">
          Copyright ©2026 Zoom Communications, Inc. All rights reserved. {' '}
          <a href="#" className="hover:underline text-slate-300">Terms</a> | {' '}
          <a href="#" className="hover:underline text-slate-300">Privacy</a> | {' '}
          <a href="#" className="hover:underline text-slate-300">Trust Center</a> | {' '}
          <a href="#" className="hover:underline text-slate-300">Acceptable Use Guidelines</a> | {' '}
          <a href="#" className="hover:underline text-slate-300">Legal &amp; Compliance</a> | {' '}
          <span className="text-blue-400 font-bold">✔x Your Privacy Choices</span> | {' '}
          <a href="#" className="hover:underline text-slate-300">Cookie Preferences</a>
        </p>
      </div>
    </footer>
  );
};
