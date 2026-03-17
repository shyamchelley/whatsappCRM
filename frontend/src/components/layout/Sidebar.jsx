import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import client from '../../api/client';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/pipeline',  label: 'Pipeline',  icon: '🏗️' },
  { to: '/leads',     label: 'Leads',     icon: '👥' },
  { to: '/settings',  label: 'Settings',  icon: '⚙️' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  async function handleLogout() {
    await client.post('/auth/logout').catch(() => {});
    dispatch(logout());
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">CRM</h1>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-1">{user?.name}</p>
        <p className="text-xs text-gray-400 mb-3 capitalize">{user?.role}</p>
        <button
          onClick={handleLogout}
          className="w-full text-sm text-red-500 hover:text-red-700 text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
