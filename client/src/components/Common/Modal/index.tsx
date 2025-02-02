import {
  ModalOverlay,
  ModalWrapper,
  ModalCloseBtnDiv,
  ModalCloseImage,
  ModalCloseBtn,
  ChildrenWrapper,
} from '@components/Common/Modal/index.style';

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useHistoryRouter from '@hooks/useHistoryRouter';

// "상위 컴포넌트에서는 클릭하면 무조건 추가한다"로 로직을 구성
// recoil에서 전역ㅇ로 관리하는 것도 생각해 볼 수 있으려나..
const Modal: React.FC = ({ children }) => {
  const [history, routeHistory] = useHistoryRouter();
  const location = useLocation();

  const onClick = () => {
    routeHistory(location.state.background.pathname, {});
  };

  // scroll 작동 금지
  // https://medium.com/@bestseob93/%ED%9A%A8%EC%9C%A8%EC%A0%81%EC%9D%B8-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%AA%A8%EB%8B%AC-react-modal-%EB%A7%8C%EB%93%A4%EA%B8%B0-bd003458e9d 참고
  useEffect(() => {
    document.body.style.cssText = `position: fixed; top: -${window.scrollY}px`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = `position: ""; top: "";`;
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, []);

  //모달창 바깥 클릭 시 모달창 없애기
  //https://chach4.tistory.com/4 참고
  // useEffect(() => {
  //   const handleCloseModal = (e) => {
  //     if (
  //       e.target.className &&
  //       typeof e.target.className.includes !== 'undefined' &&
  //       e.target.className.includes('modalOverlay')
  //     ) {
  //       routeHistory(location.state.background.pathname, {});
  //     }
  //   };
  //   window.addEventListener('click', handleCloseModal);
  //   return () => {
  //     window.removeEventListener('click', handleCloseModal);
  //   };
  // });

  return (
    <ModalOverlay
      className="modalOverlay"
      onClick={() => {
        routeHistory(location.state.background.pathname, {});
      }}
    >
      <ModalWrapper
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ModalCloseBtnDiv>
          <ModalCloseBtn onClick={onClick}>
            <ModalCloseImage />
          </ModalCloseBtn>
        </ModalCloseBtnDiv>
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default Modal;
