// import { useEffect, useState } from "react";
// import { useLocation, Navigate, Outlet } from "react-router-dom";

// export default function ProtectedRouter() { 
//   const isLoggedIn = false; // 더미 값
//   const user = { role: 'NORMAL' }; // 더미 값

//   const location = useLocation();
//   const [isAuthChecked, setIsAuthChecked] = useState(false);

//   // 제공된 ROLE 및 PATH 설정
//   const ROLE = {
//     PARTNER: 'PARTNER',
//     RIDER: 'RIDER',
//     NORMAL: 'NORMAL',
//   };
//   const { PARTNER, RIDER, NORMAL } = ROLE;

//   const AUTH_REQUIRED_ROUTES = [
//     { path: /^\/users\/[0-9]+$/, roles: [ NORMAL, PARTNER, RIDER ]},
//     { path: /^\/posts\/show\/[0-9]+$/, roles: [ NORMAL, PARTNER, RIDER ]},
//     { path: /^\/posts\/create$/, roles: [ NORMAL, PARTNER, RIDER ]},
//     // MainShow 관련 경로 추가 (예시)
//     { path: /^\/mypage$/, roles: [ NORMAL, PARTNER, RIDER ]},
//   ];

//   const GUEST_ONLY_ROUTES = [
//     /^\/login$/, 
//     /^\/registration$/,
//   ];

//   // 인증 체크 로직 (주석 해제 시 사용)
//   // useEffect(() => {
//   //   async function checkAuth() {
//   //     if (!isLoggedIn) {
//   //       try {
//   //         await dispatch(reissueThunk()).unwrap();
//   //       } catch (error) {
//   //         console.log('protectedRouter 재발급', error);
//   //         dispatch(clearAuth());
//   //       }
//   //     }
//   //     setIsAuthChecked(true);
//   //   }
//   //   checkAuth();
//   // }, [/* dispatch, isLoggedIn */]); 

//   // 현재는 더미 값으로 바로 체크 완료
//   useEffect(() => {
//     setIsAuthChecked(true);
//   }, []);

//   if (!isAuthChecked) {
//     return <></>;
//   }

//   const isGuestRoute = GUEST_ONLY_ROUTES.some((regex) => regex.test(location.pathname));

//   // 1. 게스트 전용 경로 처리 (로그인 상태일 경우 리다이렉트)
//   if (isGuestRoute) {
//     if (isLoggedIn) {
//       return <Navigate to="/" replace />; // /posts 대신 메인 (/)으로 리다이렉트 가정
//     } 
//   } else {
//     // 2. 인증 필수 경로 처리
//     const matchRole = AUTH_REQUIRED_ROUTES.find(item => item.path.test(location.pathname));

//     if (matchRole) {
//       if (isLoggedIn) {
//         // 2-1. 로그인 O, 권한 체크
//         if (matchRole.roles.includes(user.role)) {
//           return <Outlet/>; // 권한 OK, 자식 라우트 렌더링
//         } else {
//           // 2-2. 권한 부족
//           alert('권한이 부족하여 사용할 수 없습니다.');
//           return <Navigate to="/" replace />; // 메인으로 리다이렉트
//         }
//       } else {
//         // 2-3. 로그인 X
//         alert('로그인이 필요한 서비스입니다');
//         return <Navigate to="/login" replace state={{ from: location }} />; // 로그인 페이지로 이동
//       }
//     }
//   }

//   // 3. 인증/권한이 필요 없는 일반 라우트 또는 체크가 끝난 인증 필수 라우트의 경우
//   return <Outlet/>;
// }