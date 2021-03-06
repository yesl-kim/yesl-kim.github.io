---
title: "Watta: Taxi 후기"
date: "2020-06-06 15:39:00"
template: "post"
draft: false
slug: "watta-taxi"
category: "Project"
tags:
  - "회고"
description: "한강 주변 수상택시 예약 사이트, watta: taxi 프로젝트 회고록"
---

## Description.

한강 주변 수상택시를 검색, 예약할 수 있는 웹 사이트  
이용한 택시 기사님 평점, 댓글 추가 가능

### Memebers

**FE** | 김예슬, 윤세용, 이다슬, 최원근,  
**BE** | 박은혜, 양영건

### Implementation (What I did ✔️)

카카오 로그인 및 회원가입  
슬라이드, 동적 라우팅  
달력에서 특정날짜, 기간 선택 ✔️  
특정 승강장, 날짜, 승객인원 및 좌석타입에 따른 티켓 검색 ✔️  
택시회사, 가격, 출발시간에 따른 티켓 필터, 정렬 ✔️  
티켓 예약, 예약 확인 ✔️  
이용한 택시 기사님 평점, 댓글 기능  
로딩 페이지 ✔️

---

## 잘했던 점

**우선 순위에 따른 일정 관리**

두번째 팀 프로젝트여서 그런지 확실히 다함께 역할을 분배하는 부분은 수월했다. (첫 프로젝트 때는 컴포넌트나 페이지를 어떻게 나눌지도 고민이 됐던 기억이 있다.)
매 스프린트마다 팀원끼리 진행상황을 공유하고 **우선순위에 따라 (전체 프로젝트를 위해, 메인 서비스를 중심으로 한 사이클을 돌 수 있도록)** 각자의 역할을 그때그때 조율했다.

그 결과 추가기능은 구현하지 못했지만 기한 안에 메인 서비스는 모두 완성할 수 있었다.

## 아쉬운 점

**상태관리**

검색, 필터 항목에 대한 상태값을 컴포넌트끼리 공유해야 할 일이 많았는데, 이를 모두 props를 내려주는 것으로 해결했다. 이때 `useContext`를 쓰면 좋을 것 같다.

**util 함수의 관심사 분리**

이번에 프로젝트 내에서 재사용 가능한 함수들(쿼리스트링 파싱 함수나 날짜를 일정 포맷으로 변환하는 함수, 객체가 빈 값인지 검사하는 함수 등)은 util.js 파일에 놓고 import해서 사용했다-. 하지만 프로젝트 끝나고 보니 이런 함수도 관심사에 따라 파일로 분리하면 관리하기 더 용이할 것 같다.

**페이지별로 공통된 컴포넌트를 렌더하는 Layout 컴포넌트**

페이지 별로 모두 공통된 컴포넌트를 가지면 참 좋겠지만, 페이지별로 공통된 요소는 갖지만 일부 페이지에서 해당 요소를 불러오지 않는 경우가 있다. 이 때문에 이번 프로젝트에서 시간 관계상 다수의 페이지에서 공통된 컴포넌트를 매번 렌더하도록 코드를 작성하였다.

프로젝트가 끝난 뒤 페이지 경로에 따라 공통 컴포넌트를 조건부 렌더링하는 Layout 컴포넌트를 만들 수 있다는 걸 알았다. 이 부분을 나중에 리팩토링하면 좋을 것 같다.

## 소감

### SCSS vs Styled-component

위케아 프로젝트 때는 scss를 써봤다면 이번엔 styled-component를 써보았다.

scss의 장점 중 하나는 nesting 기능 때문에 SPA에서 클래스명이 중복되는 것을 "어느 정도" 막아준다는 장점이 있지만, 그래도 여전히 중복되는 클래스명이 생겼다. 반면 styled-component는 그런 문제로부터 완전히 자유롭다. 그리고 컴포넌트와 관련 스타일이 한 파일로 묶이기 때문에 유지보수가 쉽다는 장점이 있다.

사용해본 결과, 가장 좋았던 점은 styled-component 이름처럼 정말 컴포넌트처럼 사용할 수 있다는 점이었다.

크게 공통된 스타일을 가지고 있으면서 부분부분 달라지는 요소를 모두 클래스명으로 제어하는 것이 아니라 **컴포넌트처럼 props로 넘겨주면 그 안에서 props에 따라 다른 스타일을 적용할 수 있다.** 그리고 **클래스명이 아닌 변수로 선언**하여 사용하기 때문에 코드가 깔끔하다. (className="~"부분이 사라짐)

아래는 프로젝트 하면서 스타일 컴포넌트로 탭버튼을 구현한 부분이다. 사소하지만 특정값에 따라 스타일이 변경되는 로직이 스타일 컴포넌트 내부로 포함되어 컴포넌트는 오히려 깔끔해지는 걸 볼 수 있었다.

```js
export const Search = () => {
  return (
    <TabBtn clicked={isRoundTrip} onClick={handleClick}>왕복<TabBtn>
  );
};

const TabBtn = styled.li`
  ... ${({ clicked }) =>
      clicked &&
      css`
        ...
      `};
`;
```

scss로 한다면,

```js
export const Search = () => {
  return (
    <li
      className={isRoundTrip ? "tabBtn clicked" : "tabBtn"}
      onClick={handleClick}
    >
      왕복
    </li>
  );
};
```

```scss
.tabBtn {
  .clicked {
    ...;
  }
}
```

### 클래스형 vs 함수형 컴포넌트

이건 정말 혁명이었다. 처음에는 클래스형을 쓸 때 큰 불편함을 못 느낀 만큼, (클래스가 발생시킬 수 있는 여러 버그를 아직 만나보지 못했다.) 함수형에 편리함이 와닿지 않았다.

하지만 일단 render함수를 비롯해서 contructor, this가 필요하지 않고, 인자로 받아온 props를 바로 구조분해할당하여 사용할 수 있다는 것만으로도 (여러 곳에서 다시 구조분해할당할 필요도 없고) 코드가 눈에 띄게 깔끔해지는 것을 볼 수 있었고. 쓸수록, state가 하나의 객체 안에 네스팅되지 않다는 점, 라이프사이클 메소드(컴디마, 컴디업, 컴디언마)를 useEffect 하나로 쓸 수 있다는 점이 편리했다. (더 많은 장점이 있겠지만!)

### 지극히 개인적인 회고

두번째여서 그럴까 팀원들과 아주 많이 친해지고 편해지고 덕분에 빠듯한 일정에도 누구하나 포기하지 않고 시너지를 낼 수 있었던 것 같다.

배달의 민족에서 '잡담이 경쟁력이다'라고 한다던데, 왜 경쟁력인지 조금이라도 맛본 프로젝트가 아니었을까. 서로 우선 사람 대 사람으로 친해지니 그 후엔 어떤 의견도 솔직하게 말할 수 있었고, 체력적으로 힘들고 마음이 조급해져도 분위기가 안좋았던 적은 한번도 없었다. 개인적으로 정말 재밌고 만족스러운 프로젝트였다.
