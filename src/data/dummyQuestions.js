const dummyQuestions = [
    {
        id: 'q1',
        title: '배송 문의: 주문 번호 12345 지연',
        content: '주문 번호 12345의 배송이 예정보다 지연되고 있습니다. 현재 상태를 알려주세요.',
        qnaImg: null,
        status: '답변 대기',
        createdAt: '2023-10-26T10:00:00Z',
    },
    {
        id: 'q2',
        title: '결제 오류 문의',
        content: '어제 신용카드 결제 시 오류가 발생하여 다시 시도했으나 계속 실패합니다. 확인 부탁드립니다.',
        qnaImg: '/public/resource/sample-payment-error.png', // Example path
        status: '답변 완료',
        createdAt: '2023-10-25T14:30:00Z',
    },
    {
        id: 'q3',
        title: '회원 정보 수정 문의',
        content: '이메일 주소를 변경하고 싶은데, 마이페이지에서 수정이 안 됩니다. 어떻게 해야 하나요?',
        qnaImg: null,
        status: '답변 대기',
        createdAt: '2023-10-24T09:15:00Z',
    },
];

export default dummyQuestions;
