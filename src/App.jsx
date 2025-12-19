import "./App.css"
import { Outlet } from 'react-router-dom';
import Header01 from "./components/common/Header01.jsx";
import Footer01 from "./components/common/Footer01.jsx";
import TopButton01 from "./components/common/TopButton01.jsx";
import PWAInstallButton from './components/common/PWAInstallButton.jsx';

function App() { 
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