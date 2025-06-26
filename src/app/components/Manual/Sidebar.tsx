import { NavItem } from '@/types/manualTypes';

interface SidebarProps {
  navItems: NavItem[];
  activeSection: string;
  setActiveSection: (id: string) => void;
}

export default function Sidebar({ 
  navItems, 
  activeSection, 
  setActiveSection 
}: SidebarProps) {
  return (
    <nav className="sidebar">
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.id} className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(item.id);
              }}
            >
              {item.icon} {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}