import { useState } from 'react';
import NavBar from './NavBar';
import TopBar from './TopBar';
import './Header.css';

function Header() {
  const [topbarHidden, setTopbarHidden] = useState(false);

  return (
    <div className={`site-header${topbarHidden ? ' site-header--topbar-hidden' : ''}`}>
      <TopBar hidden={topbarHidden} onHiddenChange={setTopbarHidden} />
      <NavBar />
    </div>
  );
}

export default Header;
