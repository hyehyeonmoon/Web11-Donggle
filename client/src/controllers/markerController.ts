import { IMapInfo } from '@myTypes/Map';
import { IAPIResult } from '@myTypes/Common';
import { calcTotal } from '@utils/common';

const ratingToPercent = (rate: number) => {
  return rate * 20;
};

const starRateHTML = (rate: number) => {
  return `
    <div class="star-ratings">
      <div class="star-ratings-fill" style="width: ${ratingToPercent(rate)}%">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
      <div class="star-ratings-base">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
    </div>
  `;
};

const markerEl = (rateData: IMapInfo) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'customoverlay';

  const { address, count, categories } = rateData;
  const total = calcTotal(categories);
  const rate = total / count;

  const region = address.split(' ');
  const smallestRegion = region[region.length - 1];

  wrapper.dataset.address = address;
  wrapper.dataset.rateData = JSON.stringify(rateData);
  wrapper.innerHTML = `
    <div class="title">
      <span>${smallestRegion}</span>
      <span class="star-rating-single">${isNaN(rate) ? '' : '★'}</span>
      <span>${isNaN(rate) ? '' : rate.toFixed(1)}</span>
    </div>
  `;
  return wrapper;
};

const largeMarkerEl = (rateData: IMapInfo) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'customoverlay customoverlay_large';

  const { address, count, categories } = rateData;
  const total = calcTotal(categories);
  const averageRate = total / count;

  const safety = categories.safety / count;
  const traffic = categories.traffic / count;
  const food = categories.food / count;
  const entertainment = categories.entertainment / count;

  wrapper.dataset.address = address;
  wrapper.dataset.rateData = JSON.stringify(rateData);
  wrapper.innerHTML = `
    <div class="title">
      <span>${address}</span>
      <span class="star-rating-single">${!count ? '' : '★'}</span>
      <span>${!count ? '' : averageRate.toFixed(1)}</span>
    </div>
    <div class="content">
      <span>안전 </span>
      ${starRateHTML(safety || 0)}
      <span>${!count ? 'N/A' : safety.toFixed(1)}</span>
    </div>
    <div class="content">
      <span>교통 </span>
      ${starRateHTML(traffic || 0)}
      <span>${!count ? 'N/A' : traffic.toFixed(1)}</span>
    </div>
    <div class="content">
      <span>먹거리 </span>
      ${starRateHTML(food || 0)}
      <span>${!count ? 'N/A' : food.toFixed(1)}</span>
    </div>
    <div class="content">
      <span>놀거리 </span>
      ${starRateHTML(entertainment || 0)}
      <span>${!count ? 'N/A' : entertainment.toFixed(1)}</span>
    </div>
  `;
  return wrapper;
};

const random = (from: number, to: number) => {
  return Number((Math.random() * (to - from) + from).toFixed(2));
};

const getRandomRate = () => {
  return random(1, 5);
};

const regionToRates = (region): IMapInfo => {
  const count = random(0, 100);
  const safety = getRandomRate() * count;
  const traffic = getRandomRate() * count;
  const food = getRandomRate() * count;
  const entertainment = getRandomRate() * count;

  return {
    address: region.address,
    code: region.code,
    codeLength: region.codeLength,
    center: region.center,
    count: count,
    categories: {
      safety,
      traffic,
      food,
      entertainment,
    },
  };
};

const requestRates = async (
  scale: number,
  region: string[],
): Promise<IMapInfo[]> => {
  return await fetch(
    `${process.env.REACT_APP_API_URL}/api/map/rates?scale=${scale}&big=${region[0]}&medium=${region[1]}&small=${region[2]}`,
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw Error('요청 실패');
    })
    .then((res: IAPIResult<IMapInfo[]>) => {
      return res.result;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};

const createMarkers = (rateDatas: IMapInfo[]): kakao.maps.CustomOverlay[] => {
  return rateDatas.map((rateData) => {
    const { center } = rateData;
    const marker = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(...center),
    });

    const defaultMarker = markerEl(rateData);
    const largeMarker = largeMarkerEl(rateData);

    defaultMarker.addEventListener('mouseenter', () => {
      marker.setContent(largeMarker);
      marker.setZIndex(1);
    });
    largeMarker.addEventListener('mouseleave', () => {
      marker.setContent(defaultMarker);
      marker.setZIndex(0);
    });
    marker.setContent(defaultMarker);
    return marker;
  });
};

const displayMarkers = (
  markers: kakao.maps.CustomOverlay[],
  map: kakao.maps.Map,
) => {
  markers.forEach((marker) => marker.setMap(map));
};

const deleteMarkers = (markers: kakao.maps.CustomOverlay[]) => {
  markers.forEach((marker) => marker.setMap(null));
};

const createMarkerClickListener = (
  onClick: (rateData: IMapInfo) => void,
  onOutsideClick: () => void,
) => {
  const onMarkerClicked = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const markerEl = target.closest('.customoverlay') as HTMLElement;
    if (!markerEl) {
      /*
          2021-11-11
          송명회
          폴리곤 클릭시 사이드바 닫힘 방지
          Polygon은 HTML path 엘리먼트로 구현되어 있으므로 의도대로 동작함
       */
      if (!target.closest('path')) onOutsideClick();
      return;
    }
    onClick(JSON.parse(markerEl.dataset.rateData as string));
  };
  return onMarkerClicked;
};

const LFURates = async (
  cache: Map<string, IMapInfo[] & { hitCount: number }>,
  scale: number,
  region: string[],
) => {
  const [big, medium] = region;
  let key = '';

  switch (true) {
    case scale < 9:
      key = `${big} ${medium}`;
      break;
    case 9 <= scale && scale < 12:
      key = `${big}`;
      break;
    case 12 <= scale:
      key = 'all';
      break;
  }

  if (cache.has(key)) {
    const rateData = cache.get(key);
    if (rateData) rateData.hitCount++;
    return rateData;
  } else {
    const rates = (await requestRates(scale, region)) as IMapInfo[] & {
      hitCount: number;
    };
    rates.hitCount = 1;
    if (cache.size > 10) {
      const mostUnusedRates = Array.from(cache.entries()).sort(
        ([, rates1], [, rates2]) => rates1.hitCount - rates2.hitCount,
      )[0][0];
      cache.delete(mostUnusedRates);
    }
    cache.set(key, rates);
    return rates;
  }
};

const findMarker = (markers: kakao.maps.CustomOverlay[], address: string) => {
  return markers.find((marker) => {
    const markerEl = marker.getContent() as HTMLElement;
    return address === markerEl.dataset.address;
  });
};

export {
  requestRates,
  createMarkers,
  displayMarkers,
  deleteMarkers,
  regionToRates,
  createMarkerClickListener,
  LFURates,
  findMarker,
};
