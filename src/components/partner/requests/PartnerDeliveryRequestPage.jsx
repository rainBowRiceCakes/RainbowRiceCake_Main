import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarCollapsed } from '../../../store/slices/partnerUiSlice.js';
import {
  addPlan,
  removePlan,
  setCustomerDetails,
  resetDelivery,
} from '../../../store/slices/parternerDeliverySlice.js';
import { submitDeliveryRequest } from '../../../store/thunks/requests/submitDeliveryRequestThunk.js';
import { hotelIndexThunk } from '../../../store/thunks/hotels/hotelIndexThunk.js';
import './PartnerDeliveryRequestPage.css';
import { generateOrderNo } from '../../../utils/orderGenerator.js';

const PartnerDeliveryRequest = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 유효성 검사 에러 상태 추가
  const [errors, setErrors] = useState({});

  const { list: hotels = [], loading } = useSelector((state) => state.hotels || {});
  const { selectedPlans, customerDetails, loading: submitLoading } = useSelector((state) => state.delivery);

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

  // --- 유효성 검사 함수 (백엔드 validator 규칙 반영) ---
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[가-힣A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // First Name 검증 (최대 25자, 한글/영문)
    if (!customerDetails.firstName?.trim()) {
      newErrors.firstName = "First Name is required";
    } else if (customerDetails.firstName.length > 25) {
      newErrors.firstName = "First name must be under 25 characters";
    } else if (!nameRegex.test(customerDetails.firstName)) {
      newErrors.firstName = "First name may only include Korean or English characters.";
    }

    // Last Name 검증 (최대 25자, 한글/영문)
    if (!customerDetails.lastName?.trim()) {
      newErrors.lastName = "Last Name is required";
    } else if (customerDetails.lastName.length > 25) {
      newErrors.lastName = "Last name must be under 25 characters";
    } else if (!nameRegex.test(customerDetails.lastName)) {
      newErrors.lastName = "Last name may only include Korean or English characters.";
    }

    // Email 검증
    if (!customerDetails.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(customerDetails.email)) {
      newErrors.email = "Invalid email format";
    }

    // Hotel 선택 검증
    if (!customerDetails.hotel) {
      newErrors.hotel = "Please select a hotel";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlanSelect = (plan) => {
    if (selectedPlan?.id === plan.id) {
      dispatch(removePlan(plan.id));
    } else {
      if (selectedPlans.length > 0) {
        selectedPlans.forEach(p => dispatch(removePlan(p.id)));
      }
      dispatch(addPlan({ ...plan, quantity: 1 }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 입력 시 해당 필드의 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    dispatch(setCustomerDetails({ [name]: value }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newOrderNo = generateOrderNo();

    const payload = {
      ...customerDetails,
      hotelId: Number(customerDetails.hotel),
      plans: selectedPlan ? [selectedPlan] : [],
      price: selectedPlan?.price || 0,
      orderCode: newOrderNo
    };

    dispatch(submitDeliveryRequest(payload))
      .unwrap()
      .then(() => {
        alert('Please check your email for the order confirmation.');
        dispatch(resetDelivery());
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
        <div className="step_container centered fade_in">
          <div className="customer_details_card">
            <button className="btn_back" onClick={() => setStep(1)}>← 이전 단계로</button>
            <h3 className='sub_title'>Customer Details</h3>

            <div className={`form_group ${errors.firstName || errors.lastName ? 'has_error' : ''}`}>
              <label>Full Name (as shown on passport) *</label>
              <div className="input_row">
                <input
                  type="text"
                  name="firstName"
                  className={errors.firstName ? 'input_error' : ''}
                  placeholder="First Name"
                  value={customerDetails.firstName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="lastName"
                  className={errors.lastName ? 'input_error' : ''}
                  placeholder="Last Name"
                  value={customerDetails.lastName}
                  onChange={handleInputChange}
                />
              </div>
              {(errors.firstName || errors.lastName) && (
                <span className="error_text">{errors.firstName || errors.lastName}</span>
              )}
            </div>

            <div className={`form_group ${errors.email ? 'has_error' : ''}`}>
              <label>E-mail *</label>
              <input
                type="email"
                name="email"
                className={errors.email ? 'input_error' : ''}
                placeholder="ex. rc@example.com"
                value={customerDetails.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error_text">{errors.email}</span>}
            </div>

            <div className={`form_group ${errors.hotel ? 'has_error' : ''}`}>
              <label>Hotel Search & Select *</label>
              <input
                type="text"
                placeholder="호텔 이름을 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hotel_search_input"
                style={{ marginBottom: '10px', display: 'block', width: '100%' }}
              />
              <select
                className={`hotel_select ${errors.hotel ? 'input_error' : ''}`}
                name="hotel"
                value={customerDetails.hotel}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">{loading ? 'Loading...' : `${filteredHotels.length} hotels found`}</option>
                {filteredHotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.enName} ({hotel.krName})
                  </option>
                ))}
              </select>
              {errors.hotel && <span className="error_text">{errors.hotel}</span>}
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