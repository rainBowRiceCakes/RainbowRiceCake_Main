import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideBar.css';
import { setActiveMenu } from '../../../store/slices/partnerMenuSlice';

const Sidebar = ({ isCollapsed }) => {
  const activeMenu = useSelector((state) => state.menu.activeMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    // 경로에 따른 액티브 메뉴 설정 로직 (기존 유지)
    if (path === '/partner' || path === '/partner/') {
      if (activeMenu !== 'home') dispatch(setActiveMenu('home'));
    } else if (path.includes('/partners/orders')) {
      if (activeMenu !== 'request' && activeMenu !== 'history') dispatch(setActiveMenu('history'));
    } else if (path.includes('/partners/notices')) {
      if (activeMenu !== 'notice') dispatch(setActiveMenu('notice'));
    } else if (path.includes('/partners/help')) {
      if (activeMenu !== 'qna') dispatch(setActiveMenu('qna'));
    } else if (path.includes('/partners/profile')) {
      if (activeMenu !== 'mypage') dispatch(setActiveMenu('mypage'));
    }
  }, [location.pathname, activeMenu, dispatch]);

  const menuItems = [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'request', label: '배송 요청', icon: '📦' },
    { id: 'history', label: '배송 내역', icon: '📋' },
    { id: 'notice', label: '공지사항', icon: '💬' },
    { id: 'qna', label: '문의하기', icon: '🚨' },
    { id: 'mypage', label: '마이 페이지', icon: '👤' },
  ];

  const handleMenuClick = (id) => {
    dispatch(setActiveMenu(id));
    const paths = {
      home: '/partners',
      request: '/partners/orders/new',
      history: '/partners/orders',
      notice: '/partners/notices',
      qna: '/partners/help',
      mypage: '/partners/profile'
    };
    if (paths[id]) navigate(paths[id]);
  };

  return (
    // isCollapsed가 true면 collapsed 클래스 추가
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo">{isCollapsed ? "D" : "DGD"}</div>

      <div className="menu-list">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.id)}
            title={isCollapsed ? item.label : ""} // 접혔을 때 툴팁 제공
          >
            <span className="icon">{item.icon}</span>
            {/* 접히지 않았을 때만 라벨 표시 */}
            {!isCollapsed && <span className="label">{item.label}</span>}
          </div>
        ))}
      </div>

      <div className="logout-section">
        <div className="menu-item">
          <span className="icon">🔓</span>
          {!isCollapsed && <span className="label">Logout</span>}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;