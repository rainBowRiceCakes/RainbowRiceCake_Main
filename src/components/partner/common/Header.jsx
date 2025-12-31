import './Header.css';

const Header = () => {
  return (
    <div className="main-header">
      <div className="header-left">
      </div>
      <div className="header-right">
        <div className="notification">
          <span className="bell-icon">🔔</span>
          <span className="badge">6</span>
        </div>
        <div className="user-profile">
          <span className="store-name">올리브영 동성로점</span>
          <span className="arrow-down">▼</span>
        </div>
      </div>
    </div>
  );
};

export default Header;