/**
 * @file src/components/admin/PartnerRegistration.jsx
 * @description 카카오 Places API 기반 매장 검색 및 좌표(X, Y) 자동 추출/저장
 * 251229 v1.2.0 최종본
 */

import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import axiosInstance from '../../api/axiosInstance.js';
import { partnerStoreThunk } from '../../store/thunks/partnerStoreThunk.js';
import { clearPartnerStore } from '../../store/slices/partnerStoreSlice.js';
import { FaMagnifyingGlass, FaXmark, FaStore } from "react-icons/fa6";
import '../main/sections/MainPTNSSearch.css';
import { LanguageContext } from '../../context/LanguageContext.jsx';

export default function PartnerRegistration() {
  const dispatch = useDispatch();
  const { t } = useContext(LanguageContext);
  
  // 상태 관리
  const [keyword, setKeyword] = useState("");     
  const [results, setResults] = useState([]);     
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [registeredStores, setRegisteredStores] = useState([]); 

  const { isLoading, error, store: lastSaved } = useSelector((state) => state.partnerStore);

  // 💡 [문서 반영] 서비스 라이브러리 로드 필수
  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"], 
  });

  // 컴포넌트 종료 시 청소
  useEffect(() => {
    return () => { dispatch(clearPartnerStore()); };
  }, [dispatch]);

  // 서버에서 현재 등록된 목록 조회
  useEffect(() => {
    const fetchRegisteredStores = async () => {
      try {
        const response = await axiosInstance.get('/api/partners');
        setRegisteredStores(response.data.data || []);
      } catch (err) {
        console.error("매장 목록 로드 실패", err);
      }
    };
    fetchRegisteredStores();
  }, [lastSaved]);

  // 💡 [문서 반영] kakao.maps.services.Places를 이용한 키워드 검색
  const searchPlaces = (query) => {
    setKeyword(query);
    if (!query.trim()) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    if (!loading && window.kakao?.maps?.services) {
      // 문서의 Places 객체 생성
      const ps = new window.kakao.maps.services.Places(); 
      
      // 키워드로 장소검색 요청
      ps.keywordSearch(query, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setResults(data); 
          setIsDropdownOpen(true);
        } else {
          setResults([]);
        }
      });
    }
  };

  // 💡 매장 선택 시 좌표 추출 및 콘솔 출력 로직
  const handleSelectPlace = (place) => {
    // 문서에 명시된 결과 객체에서 데이터 추출 (x: 경도, y: 위도)
    const partnerData = {
      storeName: place.place_name,     // 장소명
      address: place.road_address_name || place.address_name, // 주소
      x: parseFloat(place.x),         // 경도(숫자로 변환)
      y: parseFloat(place.y),         // 위도(숫자로 변환)
      kakaoId: place.id               // 카카오 장소 고유 ID
    };

    // 📍 1. 전송 전 콘솔 확인 (X, Y 좌표만 출력)
    console.log(`X: ${partnerData.x}, Y: ${partnerData.y}`);

    setKeyword(place.place_name);
    setIsDropdownOpen(false);

    // 2. 서버 저장 시도
    dispatch(partnerStoreThunk(partnerData));
  };

  return (
    <div className="mainptnssearch-card-box" style={{ padding: '20px', maxWidth: '600px', margin: '40px auto' }}>
      <h3 className="detail-title">{t('adminRegisterBranch')}</h3>
      
      <div className="ptnssearch-input-box" style={{ position: 'relative' }}>
        <FaMagnifyingGlass className="input-inner-icon" />
        <input 
          type="text" 
          placeholder={t('adminStoreNamePlaceholder')}
          value={keyword}
          onChange={(e) => searchPlaces(e.target.value)}
          className="ptnssearch-input-text"
          style={{ border: 'none', background: 'none', width: '100%', outline: 'none' }}
        />
        {keyword && <FaXmark onClick={() => { setKeyword(""); dispatch(clearPartnerStore()); }} style={{ cursor: 'pointer' }} />}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isDropdownOpen && results.length > 0 && (
        <ul className="ptnssearch-dropdown-list" style={{ border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px', maxHeight: '200px', overflowY: 'auto', background: '#fff', zIndex: 1000, position: 'relative' }}>
          {results.map((place) => (
            <li key={place.id} onClick={() => handleSelectPlace(place)} style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
              <div style={{ fontWeight: 'bold' }}>{place.place_name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{place.road_address_name || place.address_name}</div>
            </li>
          ))}
        </ul>
      )}

      {/* 상태 메시지 */}
      {isLoading && <p style={{ color: 'blue', marginTop: '10px' }}>{t('adminDataSaving')}</p>}
      {lastSaved && <p style={{ color: 'green', marginTop: '10px' }}>✅ {lastSaved.storeName} {t('adminRegisterSuccess')}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>❌ {t('adminError')} {typeof error === 'string' ? error : t('adminServerError')}</p>}

      <hr style={{ margin: '20px 0' }} />

      {/* 등록된 매장 목록 (린트 에러 해결) */}
      <div className="registered-list">
        <h4 style={{ marginBottom: '10px' }}><FaStore /> {t('adminRegisteredStores')}</h4>
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {registeredStores.map(store => (
            <div key={store.id} style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '12px' }}>
              <strong>{store.storeName}</strong> - {store.address} ({store.x}, {store.y})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}