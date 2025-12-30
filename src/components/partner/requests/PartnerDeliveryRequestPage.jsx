import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarCollapsed } from '../../../store/slices/partnerUiSlice.js';
// updateQuantity 액션을 추가로 가져옵니다.
import { selectPlan, updateQuantity, setCustomerDetails, resetDelivery } from '../../../store/slices/parternerDeliverySlice.js';
import './PartnerDeliveryRequestPage.css';

const PartnerDeliveryRequest = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const { selectedPlan, customerDetails } = useSelector(state => state.delivery);
  // 1개당 가격 (예시)
  const unitPrice = selectedPlan ? selectedPlan.price : 0;
  const totalPrice = selectedPlan ? unitPrice * selectedPlan.quantity : 0;

  useEffect(() => {
    if (step === 2) {
      dispatch(setSidebarCollapsed(true)); // 고객 입력 시 사이드바 접기
    } else {
      dispatch(setSidebarCollapsed(false)); // 플랜 선택 시 사이드바 펼치기
    }
    return () => dispatch(setSidebarCollapsed(false));
  }, [step, dispatch]);

  const plans = [
    { id: 'basic', name: 'Basic (베이직)', desc: 'Small / 1 shopping bag', price: 10, icon: '📦' },
    { id: 'standard', name: 'Standard (스탠다드)', desc: 'Medium / 2 shopping bags', price: 15, icon: '📦' },
    { id: 'plus', name: 'Plus (플러스)', desc: 'Large / 3 shopping bags', price: 20, icon: '📦' },
  ];

  const handleAddPlan = (plan) => {
    dispatch(selectPlan({ ...plan, quantity: 1 })); // 초기 수량 1개로 설정
  };

  // 최종 제출 로직: DB 전송 데이터 구성
  const handleSubmit = () => {
    const finalOrderData = {
      plan: selectedPlan, // {id, name, quantity 등 포함}
      customer: customerDetails,
      orderDate: new Date().toISOString()
    };

    console.log("DB 전송 데이터:", finalOrderData);
    // 여기서 API 호출(POST /api/orders)을 진행합니다.
    alert('Order Submitted Successfully!');
  };

  return (
    <div className="delivery_request_page">
      <h2 className="main_title">배송 요청</h2>

      {step === 1 ? (
        <div className="step_container">
          <div className="plan_selection_grid">
            {/* 왼쪽: 플랜 리스트 */}
            <div className="plan_list_section">
              <h3>배송 플랜을 선택해주세요</h3>
              <p className="section_label">가능한 배송 플랜</p>
              {plans.map((plan) => (
                <div key={plan.id} className={`plan_card ${selectedPlan?.id === plan.id ? 'active' : ''}`}>
                  <div className="plan_icon_box">📦</div>
                  <div className="plan_info">
                    <strong>{plan.name}</strong>
                    <span>{plan.desc}</span>
                  </div>
                  <button
                    className="btn_select"
                    onClick={() => dispatch(selectPlan({ ...plan, quantity: 1 }))}
                  >
                    {selectedPlan?.id === plan.id ? '✓ 선택됨' : '선택하기'}
                  </button>
                </div>
              ))}
            </div>

            {/* 오른쪽: 요약 및 결제 섹션 */}
            <div className="summary_section">
              <p className="section_label">선택된 배송 플랜</p>
              <div className="summary_card_wrapper">
                {selectedPlan ? (
                  <>
                    <div className="selected_card_mini">
                      <div className="mini_info">
                        <strong>{selectedPlan.name}</strong>
                        <div className="quantity_control">
                          <button onClick={() => dispatch(updateQuantity(-1))}>－</button>
                          <span>{selectedPlan.quantity}</span>
                          <button onClick={() => dispatch(updateQuantity(1))}>＋</button>
                        </div>
                      </div>
                      <button className="btn_remove_link" onClick={() => dispatch(resetDelivery())}>Remove</button>
                    </div>

                    {/* 결제 정보 추가 */}
                    <div className="price_summary">
                      <div className="price_row">
                        <span>상품 금액</span>
                        <span>{totalPrice.toLocaleString()}원</span>
                      </div>
                      <div className="price_row total">
                        <span>총 결제 금액</span>
                        <span>{totalPrice.toLocaleString()}원</span>
                      </div>
                    </div>

                    <button className="btn_next_submit" onClick={() => setStep(2)}>
                      Next ➔
                    </button>
                  </>
                ) : (
                  <div className="empty_state">
                    <p>플랜을 선택하시면<br />상세 내역이 표시됩니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="step_container centered">
          <div className="customer_details_card">
            <h3>Customer Details</h3>
            <p className="card_subtitle">Please enter the essential details*</p>

            <div className="form_group">
              <label>Full Name (as shown on your passport)</label>
              <div className="input_row">
                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Last Name" />
              </div>
            </div>

            <div className="form_group">
              <label>E-mail</label>
              <input type="email" placeholder="ex. rc@example.com" />
            </div>

            <div className="form_group">
              <label>Hotel Address *</label>
              <select className="hotel_select">
                <option value="">Select your hotel</option>
              </select>
              <span className="help_link">can't find your hotel? please contact us</span>
            </div>
            <button className="btn_submit" onClick={() => alert('Submitted!')}>
              Submit ➔
            </button>
            <p className="footer_notice">Delivery usually takes less than 3 hours.</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default PartnerDeliveryRequest;