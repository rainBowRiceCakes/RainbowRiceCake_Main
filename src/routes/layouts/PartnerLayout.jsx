import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 상태만 구독
import './PartnerLayout.css';
import SideBar from '../../components/partner/common/SideBar.jsx';
import Header from '../../components/partner/common/Header.jsx';

function PartnerLayout() {
  // UI 상태에서 접힘 여부만 가져옴
  const isCollapsed = useSelector((state) => state.ui.isSidebarCollapsed);

  return (
    <div className={`app_wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <SideBar isCollapsed={isCollapsed} />
      <main className='main_container'>
        <Header />
        <div className='content_area'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default PartnerLayout;