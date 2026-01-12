import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 상태만 구독
import SideBar from '../../components/partner/common/SideBar.jsx';
import Header from '../../components/partner/common/Header.jsx';
import './PartnerLayout.css';

function PartnerLayout() {
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
