import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { verifySession } from './authThunks';
import { logout } from './authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  const isInitializing = useSelector(
    (state) => state.auth.isInitializing
  );

  useEffect(() => {
    dispatch(verifySession());

    const handleLogout = () => {
      dispatch(logout());
    };

    window.addEventListener(
      'auth:logout',
      handleLogout
    );

    return () => {
      window.removeEventListener(
        'auth:logout',
        handleLogout
      );
    };
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return children;
};

export default AuthInitializer;