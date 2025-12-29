import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { reissueThunk } from './store/thunks/authThunk';
import "./App.css"
import { Outlet } from 'react-router-dom';
import Header01 from "./components/common/Header01.jsx";
import Footer01 from "./components/common/Footer01.jsx";
import TopButton01 from "./components/common/TopButton01.jsx";
import PWAInstallButton from './components/common/PWAInstallButton.jsx';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reissueThunk());
  }, [dispatch]);

  return (
    <>
      <Header01 />
      <Outlet />
      <Footer01 />
      <TopButton01 />
      <PWAInstallButton />
    </>
  )
}

export default App;