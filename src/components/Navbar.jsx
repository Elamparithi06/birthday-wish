function Navbar() {
  const handleFakeLink = (event) => {
    event.preventDefault();
  };

  return (
    <header className="platform-navbar">
      <div className="brand-lockup">
        <span className="brand-mark">PX</span>
        <div>
          <strong>PlayX Arena</strong>
          <p>Arcade challenges and casual rewards</p>
        </div>
      </div>

      <nav className="nav-links" aria-label="Platform">
        <a href="/" onClick={handleFakeLink}>Discover</a>
        <a href="/" onClick={handleFakeLink}>Arcade</a>
        <a href="/" onClick={handleFakeLink}>Tournaments</a>
        <a href="/" onClick={handleFakeLink}>Rewards</a>
      </nav>

      <div className="nav-actions">
        <span className="status-pill">Live Season 08</span>
        <button className="nav-button">Player Login</button>
      </div>
    </header>
  );
}

export default Navbar;
