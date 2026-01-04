import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { reissueThunk } from './store/thunks/authThunk';
import "./App.css"
import { Outlet } from 'react-router-dom';
import Header01 from "./components/common/Header01.jsx";
import Footer01 from "./components/common/Footer01.jsx";
import TopButton01 from "./components/common/TopButton01.jsx";
import PWAInstallButton from './components/common/PWAInstallButton.jsx';
import PartnerApplyButton01 from './components/common/PartnerApplyButton01.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reissueThunk());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Header01 />
      <Outlet />
      <Footer01 />
      <PartnerApplyButton01 />
      <TopButton01 />
      <PWAInstallButton />
    </>
  )
}

export default App;