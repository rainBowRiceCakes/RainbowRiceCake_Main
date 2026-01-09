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
import { generateOrderNo } from '../../../utils/orderGenerator.js';

const PartnerDeliveryRequest = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { list: hotels = [], loading } = useSelector((state) => state.hotels || {});
  // 단일 선택이지만 데이터 구조 유지를 위해 selectedPlans[0]을 주로 활용
  const { selectedPlans, customerDetails, loading: submitLoading } = useSelector((state) => state.delivery);

  // 현재 선택된 플랜 (없으면 null)
  const selectedPlan = selectedPlans.length > 0 ? selectedPlans[0] : null;

  useEffect(() => {
    dispatch(hotelIndexThunk({ limit: 200, offset: 0 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSidebarCollapsed(step === 2));
    return () => dispatch(setSidebarCollapsed(false));
  }, [step, dispatch]);

  const plans = [
    { id: 'basic', name: '베이직', desc: '쇼핑백 1개', price: 5000, icon: '📦' },
    { id: 'standard', name: '스탠다드', desc: '쇼핑백 2개', price: 8000, icon: '📦📦' },
    { id: 'premium', name: '프리미엄', desc: '쇼핑백 3개', price: 10000, icon: '📦📦📦' },
  ];

  // 단일 선택 핸들러: 기존 것이 있으면 지우고 새로 추가하거나, 이미 선택된 걸 누르면 해제
  const handlePlanSelect = (plan) => {
    if (selectedPlan?.id === plan.id) {
      dispatch(removePlan(plan.id));
    } else {
      // 기존에 뭐가 있었다면 싹 비우고 새로 담기 (단일 선택 보장)
      if (selectedPlans.length > 0) {
        selectedPlans.forEach(p => dispatch(removePlan(p.id)));
      }
      dispatch(addPlan({ ...plan, quantity: 1 }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setCustomerDetails({ [name]: value }));
  };

  const handleSubmit = () => {
    if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName || !customerDetails.hotel) {
      alert('Please fill in all required fields.');
      return;
    }

    const newOrderNo = generateOrderNo();

    const payload = {
      ...customerDetails,
      hotelId: Number(customerDetails.hotel),
      // selectedPlan이 존재할 때만 배열로 감싸서 보내기
      plans: selectedPlan ? [selectedPlan] : [],
      price: selectedPlan?.price || 0,
      orderCode: newOrderNo
    };

    dispatch(submitDeliveryRequest(payload))
      .unwrap()
      .then(() => {
        alert('주문이 성공적으로 접수되었습니다!');
        setStep(1);
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
        <div className="step_indicator">Step {step} of 2</div>
      </div>

      {step === 1 ? (
        <div className="step_container fade_in">
          <div className="plan_selection_single">
            <h3 className="sub_title">배송 플랜을 하나 선택해주세요</h3>
            <div className="plan_card_group">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`plan_card_large ${selectedPlan?.id === plan.id ? 'active' : ''}`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <div className="plan_check">{selectedPlan?.id === plan.id ? '✓' : ''}</div>
                  <div className="plan_icon_box" style={{
                    fontSize:
                      plan.icon.length === 2
                        ? "36px"
                        : plan.icon.length >= 3
                          ? "28px"
                          : "48px",
                  }}>{plan.icon}</div>
                  <div className="plan_info">
                    <strong className="name">{plan.name}</strong>
                    <p className="desc">{plan.desc}</p>
                    <p className="price">{plan.price.toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="next_step_bar">
              {selectedPlan ? (
                <div className="selection_summary">
                  <span>선택됨: <strong>{selectedPlan.name}</strong></span>
                  <button className="btn_next_submit" onClick={() => setStep(2)}>다음 단계로 이동 ➔</button>
                </div>
              ) : (
                <p className="no_selection_text">계속하려면 플랜을 선택하세요.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ---------------- Step 2: 고객 정보 입력 ---------------- */
        <div className="step_container centered fade_in">
          <div className="customer_details_card">
            <button className="btn_back" onClick={() => setStep(1)}>← 이전 단계로</button>
            <h3 className='sub_title'>Customer Details</h3>

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
                <option value="">{loading ? 'Loading...' : `${filteredHotels.length} hotels found`}</option>
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