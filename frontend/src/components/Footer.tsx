'use client';

import React from 'react';
import { Globe, DollarSign } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-zoom-dark-footer text-slate-300 py-12 px-6 lg:px-16 text-xs mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        {/* About */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">About</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Zoom Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Customers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sustainability & ESG</a></li>
          </ul>
        </div>

        {/* Download */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Download</h4>
          <ul className="space-y-2 text-slate-400">
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
          <h4 className="font-bold text-white text-sm mb-3">Sales</h4>
          <ul className="space-y-2 text-slate-400">
            <li className="font-semibold text-white">1.888.799.9666</li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Plans & Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Request a Demo</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Webinars and Events</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Support</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Test Zoom</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Account</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Learning Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Developer Support</a></li>
          </ul>
        </div>
      </div>

      {/* Language & Currency Dropdowns */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-800 gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700 text-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">English</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700 text-slate-200">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Indian Rupee ₹</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center md:text-right">
          Copyright ©2026 Zoom Video Communications, Inc. All rights reserved. {' '}
          <a href="#" className="underline hover:text-white">Terms</a> | {' '}
          <a href="#" className="underline hover:text-white">Privacy</a> | {' '}
          <a href="#" className="underline hover:text-white">Trust Center</a> | {' '}
          <a href="#" className="underline hover:text-white">Legal & Compliance</a>
        </p>
      </div>
    </footer>
  );
};
