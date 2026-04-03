function Footer() {
  const handleFakeLink = (event) => {
    event.preventDefault();
  };

  return (
    <footer className="platform-footer">
      <div>
        <strong>PlayX Arena</strong>
        <p>Arcade missions, hidden rewards, and event-based experiences.</p>
      </div>

      <div className="footer-links">
        <a href="/" onClick={handleFakeLink}>Terms</a>
        <a href="/" onClick={handleFakeLink}>Privacy</a>
        <a href="/" onClick={handleFakeLink}>Support</a>
      </div>

      <p className="copyright">Copyright 2026 PlayX Arena. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
