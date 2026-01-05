import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileThunk } from '../../../store/thunks/profile/getProfileThunk.js';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { profileData, isLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    // Thunk를 강제로 실행해보고 로그를 찍습니다.
    const promise = dispatch(getProfileThunk());
    // Thunk의 결과를 추적
    promise.then((res) => {
    }).catch((err) => {
    });
  }, [dispatch]);

  return (
    <div className="main-header">
      <div className="header-left">
        {/* 필요한 로고나 타이틀 */}
      </div>
      <div className="header-right">
        {/* <div className="notification">
          <span className="badge">6</span>
          <span className="bell-icon">🤟</span>
        </div> */}
        <div className="user-profile">
          <span className="store-name">
            {/* 로딩 중일 때와 데이터가 들어왔을 때의 처리 */}
            {isLoading ? '로딩 중...' : profileData?.krName || '매장 정보 없음'}
          </span>
          <span>{profileData?.manager} 파트너님</span>
        </div>
      </div>
    </div>
  );
};

export default Header;