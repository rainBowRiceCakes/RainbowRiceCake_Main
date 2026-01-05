import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarCollapsed } from '../../../store/slices/partnerUiSlice.js';
import {
  addPlan,
  removePlan,
  updateQuantity,
  setCustomerDetails,
  resetDelivery,
} from '../../../store/slices/parternerDeliverySlice.js';
import { submitDeliveryRequest } from '../../../store/thunks/requests/submitDeliveryRequestThunk.js';
import { hotelIndexThunk } from '../../../store/thunks/hotels/hotelIndexThunk.js';
import dayjs from 'dayjs';
import './PartnerDeliveryRequestPage.css';

const PartnerDeliveryRequest = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 리덕스 상태 구독
  const { list: hotels = [], loading } = useSelector((state) => state.hotels || {});
  const { selectedPlans, customerDetails, loading: submitLoading } = useSelector((state) => state.delivery);

  // 초기 데이터 로드
  useEffect(() => {
    // limit을 200으로 설정하여 호출
    dispatch(hotelIndexThunk({ limit: 200, offset: 0 }));
  }, [dispatch]);

  // 사이드바 상태 제어
  useEffect(() => {
    dispatch(setSidebarCollapsed(step === 2));
    return () => dispatch(setSidebarCollapsed(false));
  }, [step, dispatch]);

  const plans = [
    { id: 'basic', name: 'Basic (베이직)', desc: 'Small / 1 shopping bag', price: 5000, icon: '📦' },
    { id: 'standard', name: 'Standard (스탠다드)', desc: 'Medium / 2 shopping bags', price: 8000, icon: '📦' },
    { id: 'premium', name: 'Premium (프리미엄)', desc: 'Large / 3 shopping bags', price: 12000, icon: '📦' },
  ];

  const totalPrice = selectedPlans.reduce((sum, plan) => sum + plan.price * plan.quantity, 0);

  // 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setCustomerDetails({ [name]: value }));
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName || !customerDetails.hotel) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      email: customerDetails.email,
      firstName: customerDetails.firstName,
      lastName: customerDetails.lastName,
      hotelId: Number(customerDetails.hotel),
      plans: selectedPlans,
      price: totalPrice,
      orderDate: dayjs().toISOString()
    };

    dispatch(submitDeliveryRequest(payload))
      .unwrap()
      .then(() => {
        alert('주문이 성공적으로 접수되었습니다!');
        setStep(1); // 페이지는 1단계로 이동 (데이터는 Slice에서 자동 리셋됨)
      })
      .catch((err) => alert(`Error: ${err.message || '오류가 발생했습니다.'}`));
  };

  const filteredHotels = Array.isArray(hotels.hotels)
    ? hotels.hotels.filter(hotel =>
      hotel.krName.includes(searchTerm) ||
      hotel.enName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  return (
    <div className="delivery_request_page">
      <div className="header_row">
        <h2 className="main_title">배송 요청</h2>
        <div className="step_indicator">step {step} of 2</div>
      </div>

      {step === 1 ? (
        /* ---------------- Step 1: 플랜 선택 ---------------- */
        <div className="step_container fade_in">
          <div className="plan_selection_grid">
            <div className="plan_list_section">
              <h3>배송 플랜을 선택해주세요</h3>
              {plans.map((plan) => {
                const isSelected = selectedPlans.some((p) => p.id === plan.id);
                const handleCardClick = () => isSelected ? dispatch(removePlan(plan.id)) : dispatch(addPlan({ ...plan, quantity: 1 }));

                return (
                  <div key={plan.id} className={`plan_card ${isSelected ? 'active' : ''}`} onClick={handleCardClick}>
                    <div className="plan_icon_box">{plan.icon}</div>
                    <div className="plan_info">
                      <strong>{plan.name}</strong>
                      <span>{plan.desc}</span>
                    </div>
                    <button className={`btn_select ${isSelected ? 'active' : ''}`}>{isSelected ? '선택됨' : '담기'}</button>
                  </div>
                );
              })}
            </div>

            <div className="summary_section">
              <p className="section_label">선택된 플랜 ({selectedPlans.length})</p>
              {selectedPlans.length > 0 ? (
                <>
                  <div className="selected_items_scroll">
                    {selectedPlans.map((plan) => (
                      <div key={plan.id} className="selected_card_mini">
                        <div className="mini_info">
                          <strong>{plan.name}</strong>
                          <div className="quantity_control">
                            <button onClick={() => dispatch(updateQuantity({ planId: plan.id, amount: -1 }))}>－</button>
                            <span>{plan.quantity}</span>
                            <button onClick={() => dispatch(updateQuantity({ planId: plan.id, amount: 1 }))}>＋</button>
                          </div>
                        </div>
                        <div className="item_price">{(plan.price * plan.quantity).toLocaleString()}원</div>
                      </div>
                    ))}
                  </div>
                  <div className="price_summary">
                    <div className="price_row total">
                      <span>총 결제 금액</span>
                      <span>{totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                  <button className="btn_next_submit" onClick={() => setStep(2)}>다음 단계로 ➔</button>
                </>
              ) : (
                <div className="empty_state"><p>플랜을 선택해 주세요.</p></div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ---------------- Step 2: 고객 정보 입력 ---------------- */
        <div className="step_container centered fade_in">
          <div className="customer_details_card">
            <button className="btn_back" onClick={() => setStep(1)}>← 이전 단계로</button>
            <h3>Customer Details</h3>

            <div className="form_group">
              <label>Full Name (as shown on passport)</label>
              <div className="input_row">
                <input type="text" name="firstName" placeholder="First Name" value={customerDetails.firstName} onChange={handleInputChange} />
                <input type="text" name="lastName" placeholder="Last Name" value={customerDetails.lastName} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form_group">
              <label>E-mail</label>
              <input type="email" name="email" placeholder="ex. rc@example.com" value={customerDetails.email} onChange={handleInputChange} />
            </div>

            <div className="form_group">
              <label>Hotel Search & Select *</label>
              {/* 1. 검색어 입력창 추가 */}
              <input
                type="text"
                placeholder="호텔 이름을 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hotel_search_input"
                style={{ marginBottom: '10px', display: 'block', width: '100%' }}
              />
              {/* 2. 필터링된 결과로 select 구성 */}
              <select className="hotel_select" name="hotel" value={customerDetails.hotel} onChange={handleInputChange} disabled={loading}>
                <option value="">{loading ? 'Loading...' : `검색 결과: ${filteredHotels.length}건`}</option>
                {filteredHotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.enName} ({hotel.krName})
                  </option>
                ))}
              </select>
            </div>

            <button className="btn_submit" onClick={handleSubmit} disabled={submitLoading}>
              {submitLoading ? 'Processing...' : 'Submit Order ➔'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDeliveryRequest;