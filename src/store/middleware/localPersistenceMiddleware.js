// store/middleware/localPersistenceMiddleware.js

// ⚠️ 민감한 정보 필드 목록 (localStorage에 저장하지 않음)
const SENSITIVE_FIELDS = [
  'phone', 'address', 'bank', 'bankNum', 'licenseImg',
  'lat', 'lng', 'email', 'ssn', 'birthDate', 'createdAt', 'updatedAt', 'deletedAt', 'id', 'name', 'userId', 'profileImg', 'user_id'
];

// 민감한 정보를 제거한 안전한 객체 생성
const sanitizeForCache = (data) => {
  if (!data || typeof data !== 'object') return data;

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_FIELDS.includes(key)) continue; // 민감 필드 제외

    // 중첩 객체도 처리 (rider_user, partner_user 등)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeForCache(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const localPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  const watchedActions = [
    'profile/getProfileThunk/fulfilled',
    'profile/updateProfile/fulfilled',
    'riders/updateWorkStatus/fulfilled'
  ];

  if (watchedActions.includes(action.type)) {
    if (state.profile.profileData) {
      const safeData = sanitizeForCache(state.profile.profileData);
      localStorage.setItem('cachedProfile', JSON.stringify(safeData));
    }
  }

  if (action.type === 'auth/logout/fulfilled') {
    localStorage.removeItem('cachedProfile');
  }

  if (action.type === 'orders/setActiveTab') {
    localStorage.setItem('activeRiderTab', action.payload);
  }

  return result;
};

export default localPersistenceMiddleware;