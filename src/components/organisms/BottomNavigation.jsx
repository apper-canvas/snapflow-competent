import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const navItems = [
  { path: '/', icon: 'Home', label: 'Feed' },
  { path: '/search', icon: 'Search', label: 'Search' },
  { path: '/new-post', icon: 'PlusSquare', label: 'New' },
  { path: '/saved', icon: 'Bookmark', label: 'Saved' },
  { path: '/profile', icon: 'User', label: 'Profile' }
];

function BottomNavigation() {
  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
    >
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'text-primary' 
                : 'text-gray-500 hover:text-gray-700 active:scale-95'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 rounded-lg ${isActive ? 'bg-primary/10' : ''}`}
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={24}
                    className={isActive ? 'fill-current' : ''}
                  />
                </motion.div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}

export default BottomNavigation;