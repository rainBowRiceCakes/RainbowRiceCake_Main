/**
 * @file src/components/main/auth/Social.jsx
 * @description 회원가입 페이지 
 * 251217 v1.0.0 jun init 
 */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { reissueThunk } from "../../../store/thunks/authThunk.js";
import { useTranslation } from "../../../context/LanguageContext.js";


export default function Social() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    async function getAuth() {
      try {
        await dispatch(reissueThunk());
        navigate('/', { replace: true });
      }
      catch(error) {
        console.log('Social', error);
        alert(t('socialLoginFailed'));
        navigate('/login', { replace: true });
      }
    }
    getAuth();
  }, [dispatch, navigate, t]);
  
  return <></>
}