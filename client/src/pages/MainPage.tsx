import Header from '@components/Header';
import Map from '@components/Map/index';

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Sidebar from '@components/Sidebar';

const MainDiv = styled.div`
  width: 100vw;
  height: 100vh;
`;

const FlexContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-width: 1000px;
  height: 100%;
  flex: 1 1 0;
`;

// Rate, Review 는 Backend에서 아래와 같은 형식으로 반환한다고 가정
export interface RateType {
  address: string;
  code: string;
  codeLength: number;
  center: [number, number];
  total: number;
  count: number;
  categories: {
    safety: number;
    traffic: number;
    food: number;
    entertainment: number;
  };
}

export interface ReviewType {
  categories: {
    safety: number;
    traffic: number;
    food: number;
    entertainment: number;
  };
  text: string;
  user: string;
}

const TemporaryReviewData: ReviewType[] = [
  {
    categories: {
      safety: 4,
      traffic: 4,
      food: 5,
      entertainment: 3,
    },
    text: 'ㄴㅇㅁㄹ머ㅗㅇ피ㅓ멀호매asdfasdfgadfhawesfds;ㅓ두ㅗㅇ러;뮈퍼ㅠㅏㅣ너ㅠㅗㅎ머ㅣㅠ이러ㅓ',
    user: 'github:user1',
  },
  {
    categories: {
      safety: 4,
      traffic: 4,
      food: 4,
      entertainment: 4,
    },
    text: '우하하하우하하하우하하하우하하하우하하하우하하하우하하하우하하하',
    user: 'github:user2',
  },
];

const TemporaryHashTagData: string[] = [
  '소음이 적은',
  '경관이 좋은',
  '문화시설이 가까운',
  '체육시설이 많은',
  '역이 가까운',
];

const DEFAULT_RATE_DATA: RateType = {
  address: '',
  code: '',
  codeLength: 0,
  center: [37.541, 126.986],
  total: 9,
  count: 2,
  categories: {
    safety: 8,
    traffic: 7,
    food: 9,
    entertainment: 9,
  },
};

const MainPage: React.FC = () => {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [sidebarRate, setSidebarRate] = useState(DEFAULT_RATE_DATA);

  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  const openSidebar = useCallback(() => {
    setSidebar(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebar(false);
  }, []);

  const updateSidebarRate = useCallback((rateData: RateType) => {
    setSidebarRate(rateData);
  }, []);

  return (
    <MainDiv>
      <Header></Header>
      <FlexContainer>
        <Map
          openSidebar={openSidebar}
          closeSidebar={closeSidebar}
          updateSidebarRate={updateSidebarRate}
          toggleSidebar={toggleSidebar}
        ></Map>
        <Sidebar
          sidebar={sidebar}
          rateData={sidebarRate}
          reviewData={TemporaryReviewData}
          hashTagData={TemporaryHashTagData}
          closeSidebar={closeSidebar}
        ></Sidebar>
      </FlexContainer>
    </MainDiv>
  );
};

export default MainPage;