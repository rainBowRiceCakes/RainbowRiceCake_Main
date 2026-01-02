import './Header.css';
import { useSelector } from 'react-redux';


const Header = () => {
  const profile = useSelector((state) => state.profile.profileData);

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
          <span className="store-name">{profile?.krName || '로딩 중...'}</span>
          <span className="arrow-down">▼</span>
        </div>
      </div>
    </div>
  );
};

export default Header;