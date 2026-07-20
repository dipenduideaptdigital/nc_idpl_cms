import React, { useState } from 'react';
import { DownloadCloud, Loader2 } from 'lucide-react';
import { dashboardApi } from '../../../api/dashboard';

const WelcomeHeader = ({ user, currentDate }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await dashboardApi.exportLeadsCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Failed to export leads:", error);
      alert("Something went wrong while exporting leads. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
        </h1>
        <p className="text-sm text-zinc-500 mt-1 font-medium tracking-wide">
          {currentDate}
        </p>
      </div>
      
      <button 
        onClick={handleExport}
        disabled={isExporting}
        className="inline-flex items-center gap-2 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-800 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
        ) : (
          <DownloadCloud className="w-4 h-4" />
        )}
        {isExporting ? 'Exporting...' : 'Export Leads'}
      </button>
    </div>
  );
};

export default WelcomeHeader;