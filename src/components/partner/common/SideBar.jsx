import './SideBar.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setActiveMenu } from '../../../store/slices/partnerMenuSlice.js';
import { logoutThunk } from '../../../store/thunks/authThunk.js';
import { clearAuth } from '../../../store/slices/authSlice.js';

const Sidebar = ({ isCollapsed }) => {
  const activeMenu = useSelector((state) => state.menu.activeMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // customer가 details 작성할때, 변경에 따른 액티브 메뉴 업데이트
  useEffect(() => {
    const path = location.pathname;

    if (path === '/partners' || path === '/partners/') {
      if (activeMenu !== 'home') dispatch(setActiveMenu('home'));
      return;
    }

    if (path.startsWith('/partners/orders/new')) {
      if (activeMenu !== 'request') dispatch(setActiveMenu('request'));
      return;
    }

    if (path.startsWith('/partners/orders')) {
      if (activeMenu !== 'history') dispatch(setActiveMenu('history'));
      return;
    }

    if (path.startsWith('/partners/notices')) {
      if (activeMenu !== 'notice') dispatch(setActiveMenu('notice'));
      return;
    }

    if (path.startsWith('/partners/help')) {
      if (activeMenu !== 'qna') dispatch(setActiveMenu('qna'));
      return;
    }

    if (path.startsWith('/partners/settlement')) {
      if (activeMenu !== 'settlement') dispatch(setActiveMenu('settlement'));
      return;
    }

    if (path.startsWith('/partners/profile')) {
      if (activeMenu !== 'mypage') dispatch(setActiveMenu('mypage'));
    }
  }, [location.pathname, activeMenu, dispatch]);

  const menuItems = [
    { id: 'home', label: '홈', icon: '🏠', path: '/partners' },
    { id: 'request', label: '배송 요청', icon: '📦', path: '/partners/orders/new' },
    { id: 'history', label: '배송 내역', icon: '📋', path: '/partners/orders' },
    { id: 'notice', label: '공지사항', icon: '💬', path: '/partners/notices' },
    { id: 'qna', label: '문의하기', icon: '🚨', path: '/partners/help' },
    { id: 'settlement', label: '정산하기', icon: '💰', path: '/partners/settlement' },
    { id: 'mypage', label: '마이 페이지', icon: '👤', path: '/partners/profile' },
  ];

  const handleMenuClick = (id) => {
    dispatch(setActiveMenu(id));
    const paths = {
      home: '/partners',
      request: '/partners/orders/new',
      history: '/partners/orders',
      notice: '/partners/notices',
      qna: '/partners/help',
      settlement: '/partners/settlement',
      mypage: '/partners/profile'
    };
    if (paths[id]) navigate(paths[id]);
  };

  // ★ 로그아웃 핸들러
  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      await dispatch(logoutThunk());
      dispatch(clearAuth()); // 1. Redux 상태 초기화
      navigate('/');         // 2. 로그인 화면으로 이동
    }
  };

  return (
    // isCollapsed가 true면 collapsed 클래스 추가
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo" onClick={() => navigate('/partners')}>{isCollapsed ? "D" : "DGD"}</div>

      <div className="menu-list">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.id)}
          >
            {/* 접히지 않았을 때만 아이콘 + 라벨 표시 */}
            {!isCollapsed && (
              <>
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="logout-section">
        <div className="menu-item logout-btn" onClick={handleLogout}>
          <span className="icon">🔓</span>
          {!isCollapsed && <span className="label">Logout</span>}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;