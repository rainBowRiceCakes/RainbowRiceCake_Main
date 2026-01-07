/**
 * @file src/components/main/auth/Social.jsx
 * @description 회원가입 페이지 
 * 251217 v1.0.0 jun init 
 */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reissueThunk } from "../../../store/thunks/authThunk.js";
import { useTranslation } from "../../../context/LanguageContext.js";

export default function Social() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    async function getAuth() {
      try {
        const res = await dispatch(reissueThunk()).unwrap();

        // 1. 여기서 전체 구조를 확인하세요.
        console.log('Full Response Payload:', res);

        // 2. 여러가지 가능성을 모두 체크하는 유연한 추출 로직
        // (res.data.user.role / res.user.role / res.data.role / res.role 순서)
        const role = res?.data?.user?.role ||
          res?.user?.role ||
          res?.data?.role ||
          res?.role;

        console.log('Extracted Role:', role);

        if (!role) {
          console.warn('Role을 찾을 수 없습니다. 메인으로 이동합니다.');
          navigate('/', { replace: true });
          return;
        }

        // 3. 권한별 이동
        if (role === 'PTN') navigate('/partners', { replace: true });
        else if (role === 'DLV') navigate('/riders', { replace: true });
        else navigate('/', { replace: true });

      } catch (error) {
        console.error('Social Login Error:', error);
        navigate('/login', { replace: true });
      }
    }
    getAuth();
  }, [dispatch, navigate]);

  // 아무것도 보여주지 않거나 스피너를 보여줌
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <p>{t('loggingIn', '로그인 중입니다...')}</p>
    </div>
  );
}