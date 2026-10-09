import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Globe2,
  HardDrive,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import { readEvents } from './eventsStore';
import { readExpenses } from './expensesStore';
import { readFeeStudents } from './feesStore';
import { readNotes } from './notesStore';
import { readTeachers } from './teachersStore';

const navigation = [
  {
    label: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Finance & People',
    items: [
      { id: 'fees', label: 'Student fees', href: '/admin/fees', icon: WalletCards, countKey: 'fees' },
      { id: 'teachers', label: 'Teachers & salary', href: '/admin/teachers', icon: UsersRound, countKey: 'teachers' },
      { id: 'expenses', label: 'Expenses', href: '/admin/expenses', icon: ReceiptText, countKey: 'expenses' },
    ],
  },
  {
    label: 'Website Content',
    items: [
      { id: 'events', label: 'Events', href: '/admin/events', icon: CalendarDays, countKey: 'events' },
      { id: 'notes', label: 'Study notes', href: '/admin/notes', icon: BookOpen, countKey: 'notes' },
    ],
  },
];

function readCounts() {
  return {
    events: readEvents().length,
    expenses: readExpenses().length,
    fees: readFeeStudents().length,
    notes: readNotes().length,
    teachers: readTeachers().length,
  };
}

export default function AdminShell({ active, title, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [counts, setCounts] = useState(readCounts);

  useEffect(() => {
    const refresh = () => setCounts(readCounts());
    const events = [
      'icon-academy-events-updated',
      'icon-academy-expenses-updated',
      'icon-academy-fees-updated',
      'icon-academy-notes-updated',
      'icon-academy-teachers-updated',
      'storage',
    ];
    events.forEach(eventName => window.addEventListener(eventName, refresh));
    return () => events.forEach(eventName => window.removeEventListener(eventName, refresh));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [active]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const today = new Intl.DateTimeFormat('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return <div className="admin-workspace">
    <button
      className={`admin-sidebar-backdrop${menuOpen ? ' is-visible' : ''}`}
      type="button"
      aria-label="Close admin menu"
      onClick={() => setMenuOpen(false)}
    />
    <aside className={`admin-sidebar${menuOpen ? ' is-open' : ''}`}>
      <div className="admin-sidebar-head">
        <a className="admin-sidebar-brand" href="/admin" onClick={() => setMenuOpen(false)}>
          <img src="/images/icon-academy-logo.png" alt="" />
          <span><strong>THE ICON ACADEMY</strong><small>ADMIN PORTAL</small></span>
        </a>
        <button className="admin-sidebar-close" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={19} /></button>
      </div>

      <div className="admin-sidebar-context"><span>IA</span><div><small>ACTIVE WORKSPACE</small><strong>Academy Management</strong></div></div>

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {navigation.map(group => <div className="admin-nav-group" key={group.label}>
          <p>{group.label}</p>
          {group.items.map(item => {
            const Icon = item.icon;
            const selected = active === item.id;
            return <a className={selected ? 'active' : ''} href={item.href} aria-current={selected ? 'page' : undefined} key={item.id} onClick={() => setMenuOpen(false)}>
              <Icon size={18} />
              <span>{item.label}</span>
              {item.countKey && <small>{counts[item.countKey]}</small>}
            </a>;
          })}
        </div>)}
      </nav>

      <div className="admin-sidebar-footer">
        <a href="/" target="_blank" rel="noreferrer"><Globe2 size={17} /><span>View website</span><ArrowUpRight size={15} /></a>
        <button type="button" onClick={onLogout}><LogOut size={17} /><span>Sign out</span></button>
        <div className="admin-sidebar-profile"><span>IA</span><div><strong>Academy Admin</strong><small>Administrator</small></div></div>
      </div>
    </aside>

    <section className="admin-workspace-main">
      <header className="admin-topbar">
        <div className="admin-topbar-title">
          <button type="button" aria-label="Open admin menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
          <div><small>ADMIN PORTAL</small><strong>{title}</strong></div>
        </div>
        <div className="admin-topbar-meta">
          <span className="admin-storage-status"><HardDrive size={15} /><span><small>STORAGE</small><strong>Local browser</strong></span></span>
          <span className="admin-topbar-date"><small>TODAY</small><strong>{today}</strong></span>
        </div>
      </header>
      <div className="admin-workspace-body">{children}</div>
    </section>
  </div>;
}
