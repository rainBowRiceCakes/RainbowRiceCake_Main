import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

const PREFIX = import.meta.env.VITE_APP_NAME;

// -------------------------------------------------------------------------------------------------
// 정적 파일 캐싱
// -------------------------------------------------------------------------------------------------

precacheAndRoute(self.__WB_MANIFEST); // 이미지 설정(정적파일)

// -------------------------------------------------------------------------------------------------
// HTML 오프라인 대응
// -------------------------------------------------------------------------------------------------
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: `${PREFIX}-html-cache`,
    networkTimeoutSeconds: 3
  })
);

// -------------------------------------------------------------------------------------------------
// 이미지 캐싱(이미지 저장)
// -------------------------------------------------------------------------------------------------
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: `${PREFIX}-image-cache`,
    networkTimeoutSeconds: 3
  })
);

// -------------------------------------------------------------------------------------------------
// API 요청 캐싱(최소 동작 보장, GET을 제외한 나머지는 제외)
// -------------------------------------------------------------------------------------------------
registerRoute( // 우리 도메인이 맞는지 먼저 확인함! (url.origin === import.meta.env.VITE_SERVER_URL)
  ({ request, url }) => url.origin === import.meta.env.VITE_SERVER_URL && request.method === 'GET',
  new StaleWhileRevalidate({
    cacheName: `${PREFIX}-api-cache`,
    networkTimeoutSeconds: 3
  })
);

// -------------------------------------------------------------------------------------------------
// WEB PUSH HANDLER
// -------------------------------------------------------------------------------------------------
self.addEventListener('push', e => {
  const data = e.data.json();

  self.registration.showNotification(
    data.title,
    {
      body: data.message,
      icon: '/icons/meerkat_32.png',
      data: {
        targetUrl: data.data.targetUrl
      }
    }
  );
});

// -------------------------------------------------------------------------------------------------
// WEB PUSH CLICK EVENT
// -------------------------------------------------------------------------------------------------

self.addEventListener('notificationclick', e => {
  e.notification.close(); // 알림창 닫기

  // payload에서 백엔드가 전달해 준 전체 url 추출
  const openUrl = e.notification.data.targetUrl;

  // origin 획득
  const origin = self.location.origin;

  e.waitUntil(
    // clients의 구조 -> 유저가 브라우저에서 여러 사이트들을 켜놓는데 그 중에 우리 사이트를 찾기(matching) 위해서 존재有
    // [
    //   WindowClient = {
    //     focused: false,
    //     frameType: "top-level",
    //     id: "f6e4c645-16ba-4ebe-9600-443b91141742",
    //     type: "window",
    //     url: "http://localhost:3000/posts",
    //     visibilityState: "visible"
    //   },
    //   // ...
    // ]
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }) // serviceworker가 업데이트해서 탭에 controlled가 되어도 신경 안쓰고 가져오겠다. servicewoker가 업데이트 이후에 opened 창들에 대해서.
      .then(clients => {
        // 앱에서 루트 도메인 탭이 있는 지 확인하고
        const myClient = clients.find(client => client.url.startsWith(origin));
        // 그리고 우리 도메인과 매치하는지 확인하셈

        // 재활용할 탭이 있다면 포커스 및 네비게이트 처리
        if (myClient) {
          myClient.focus();
          return myClient.navigate(openUrl); //
        }
        // 재활용할 탭이 없다면 새창으로 열기
        if (self.clients.openWindow) {
          return self.clients.openWindow(openUrl);
        }
      })
  );
});


// Uncaught (in promise) TypeError: This service worker is not the client's active service worker.
// 이거뜨면 새 창에서 다시 시도하기.