import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideBar.css';
import { setActiveMenu } from '../../../store/slices/partnerMenuSlice';

const Sidebar = () => {
  const activeMenu = useSelector((state) => state.menu.activeMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/partner' || path === '/partner/') {
      if (activeMenu !== 'home') dispatch(setActiveMenu('home'));
    } else if (path.includes('/partner/orders')) {
      if (activeMenu !== 'request' && activeMenu !== 'history') {
        dispatch(setActiveMenu('history'));
      }
    } else if (path.includes('/partner/notices')) {
      if (activeMenu !== 'notice') dispatch(setActiveMenu('notice'));
    } else if (path.includes('/partner/policies')) {
      if (activeMenu !== 'policy') dispatch(setActiveMenu('policy'));
    } else if (path.includes('/partner/help')) {
      if (activeMenu !== 'qna') dispatch(setActiveMenu('qna'));
    } else if (path.includes('/partner/profile')) {
      if (activeMenu !== 'mypage') dispatch(setActiveMenu('mypage'));
    }
  }, [location.pathname, activeMenu, dispatch]);

  const menuItems = [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'request', label: '배송 요청', icon: '📦' },
    { id: 'history', label: '배송 내역', icon: '📋' },
    { id: 'notice', label: '공지사항', icon: '💬' },
    { id: 'policy', label: '정책', icon: '📄' },
    { id: 'qna', label: '문의하기', icon: '🚨' },
    { id: 'mypage', label: '마이 페이지', icon: '👤' },
  ];

  const handleMenuClick = (id) => {
    // Redux 상태 업데이트 요청
    dispatch(setActiveMenu(id));

    // 페이지 이동 로직
    switch (id) {
      case 'home':
        navigate('/partner');
        break;
      case 'request': // 배송 요청 -> 주문 목록 페이지로 이동 (추후 변경 가능)
        navigate('/partner/orders');
        break;
      case 'history': // 배송 내역 -> 주문 목록 페이지로 이동
        navigate('/partner/orders');
        break;
      case 'notice':
        navigate('/partner/notices');
        break;
      case 'policy':
        navigate('/partner/policies');
        break;
      case 'qna': // 문의하기 -> 도움말/FAQ 페이지로 이동
        navigate('/partner/help');
        break;
      case 'mypage':
        navigate('/partner/profile');
        break;
      default:
        break;
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">DGD</div>
      <nav className="menu-list">
        {menuItems.map((item) => (
          <div key={item.id} className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.id)}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="logout-section">
        <div className="menu-item">
          <span className="icon">🔓</span>
          <span className="label">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;