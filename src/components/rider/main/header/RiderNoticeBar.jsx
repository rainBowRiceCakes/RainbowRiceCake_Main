// components/rider/main/RiderNoticeBar.jsx
// 어드민 페이지에서 어드민이 공지사항을 올리면 우리가 받아서 보여주는 바
import "./RiderNoticeBar.css";
// import { useSelector } from "react-redux";

export default function RiderNoticeBar() {
  // const notice = useSelector((state) => state.notice.currentNotice);

  // if (!notice?.title) return null;

  return (
    <section className="rider-notice-bar">
      <div className="rider-notice-marquee">
      <p className="rider-notice-text">✓ 동성로 일대에 축제 진행중, 배송 지연 가능성 높음</p>
      </div>
    </section>
  );
}


// {/* <p className="rider-notice-text">{notice.title}</p> */}
