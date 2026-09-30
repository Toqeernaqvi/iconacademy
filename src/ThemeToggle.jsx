import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const readCurrentTheme = () => true;

function ThemeToggle() {
  const [isDark, setIsDark] = useState(readCurrentTheme);

  useEffect(() => { setIsDark(document.documentElement.dataset.theme === 'dark'); }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem('icon-academy-theme', nextTheme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nextTheme === 'dark' ? '#071426' : '#073f8c');
    setIsDark(!isDark);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <Sun className="theme-sun" size={14} />
      <Moon className="theme-moon" size={14} />
    </button>
  );
}

export default ThemeToggle;
