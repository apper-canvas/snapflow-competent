import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from '@/components/organisms/BottomNavigation';

function Layout() {
  const location = useLocation();
  const hideNavigation = location.pathname.startsWith('/story/');

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
}

export default Layout;