import { Outlet } from 'react-router-dom';
import './PartnerLayout.css';
import SideBar from '../../components/partner/common/SideBar.jsx';
import Header from '../../components/partner/common/Header.jsx';

function PartnerLayout() {
  return (
    <div className='app_wrapper'>
      {/* 왼쪽 고정 사이드바 */}
      <SideBar />
      {/* 오른쪽 메인 영역 (헤더 + 가변 콘텐츠) */}
      <main className='main_container'>
        <Header />
        <div className='content_area'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default PartnerLayout;