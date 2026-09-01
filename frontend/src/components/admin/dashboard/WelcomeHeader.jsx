import React from 'react';

const WelcomeHeader = ({ user, currentDate }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight transition-colors duration-300">
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium tracking-wide transition-colors duration-300">
          {currentDate}
        </p>
      </div>
    </div>
  );
};

export default WelcomeHeader;