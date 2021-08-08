---
title: "RN | 2depth Drawer Navigator"
date: "2020-07-03 14:05:00"
template: "post"
draft: false
slug: "react-2depth-drawer-navigator"
category: "Study"
tags:
  - "React Native"
  - "React Navigation"
  - "Drawer"
description: "드로어 네비게이터가 2depth 혹은 3depth의 화면을 렌더시켜야 할 때 네비게이션 구조를 어떻게 잡아야할까"
---

인턴십을 진행하며 처음 리액트 네이티브를 접해보았다.

대부분 리액트와 비슷했으나, 네비게이션이 기존에 리액트 라우터로 사용하던 방식과 개념이 달라서 꽤 애를 먹었다. (알고보니 사실 별거 아니었지만 😓) 그래서 인턴십이 끝난 시점에 한 번 더 정리를 해보고자 한다. 혹시나 길을 해매고 있는 누군가가 있다면 도움이 되면 좋겠다.

필자의 RN 환경은,

- Expo
- React Native 0.64
- React Navigation 6.x

[레퍼런스는 여기](https://www.youtube.com/watch?v=pd01LyE7ts8&t=54s)
~~와 공식문서는 글 안에서 링크해놓았습니다.~~

---

리액트 네이티브는 네비게이션을 구현할 때 주로 react navigation이란 라이브러리를 사용한다. 기존 웹에서 url로 페이지를 이동하는 개념이 아니라 여러 스크린을 쌓아올리는 개념이다. 네비게이터와 스크린으로 이루어지고 기존 라우터와 달리 한 애플리케이션 내에서 다수의 네비게이터의 사용이 가능하다. (네비게이터 안에 네비게이터가 중첩되는 식이다.)

## 상황

바로 문제 상황 설명을 하자면, 구현해야하는 네비게이션 구조는 다음과 같았다.  
(보안상의 문제로 실제와 조금 다르게 중략하였다.)

![네비게이션 구조(1)](https://github.com/yesl-kim/yesl-kim.github.io/blob/develop/images/rn-navigation-structure.png?raw=true)

### Drawer Navigator가 관련된 네비게이터의 가장 상위로 가야한다.

> If a drawer navigator is nested inside of another navigator that provides some UI, for example a tab navigator or stack navigator, then the drawer will be rendered below the UI from those navigators. The drawer will appear below the tab bar and below the header of the stack. **You will need to make the drawer navigator the parent of any navigator where the drawer should be rendered on top of its UI.** -리액트 네비게이션 공식문서

[리액트 네비게이션 공식문서](https://reactnavigation.org/docs/nesting-navigators/#parent-navigators-ui-is-rendered-on-top-of-child-navigator)에서 말하는 것처럼 슬라이드 메뉴가 2depth의 탑 탭 스크린들을(B - a, b, c, d)를 렌더하고 있지만 상위 스크린(A, B, C)에서 모두 렌더되고 있기 때문에 Drawer Navigator가 가장 상위로 가야한다.

![네비게이션 구조(2)](https://github.com/yesl-kim/yesl-kim.github.io/blob/develop/images/rn-navigation-structure2.png?raw=true)

## 문제-해결

### 드로어 네비게이터 안에 다른 UI를 렌더하고 싶다면?

하지만 슬라이드 메뉴의 카테고리(이하 Drawer Item)는 B 스크린의 하위 스크린을 렌더하고 있다.

[원래 Drawer Navigator의 하위 스크린이 드로어 아이템으로 들어가지만, 기본 컴포넌트와 다른 UI를 렌더하고 싶다면 `drawerContent`란 속성과 `DrawerItem`이란 컴포넌트를 사용할 수 있다.](https://reactnavigation.org/docs/drawer-navigator/#providing-a-custom-drawercontent)

~~지금보니까 공식문서에 다 나와있는데,, 왜 그랬을까~~

```js
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const goToScreen = (name) => {
    navigation.navigate(name);
  };
  return (
    <DrawerContentScrollView>
      <DrawerItem label="a" onPress={() => goToScreen("a")} />
      <DrawerItem label="b" onPress={() => goToScreen("b")} />
      <DrawerItem label="c" onPress={() => goToScreen("c")} />
      <DrawerItem label="d" onPress={() => goToScreen("d")} />
    </DrawerContentScrollView>
  );
};

const MyDrawer = ({ navigation }) => (
  <Drawer.Navigator
    drawerContent={() => <CustomDrawerContent navigation={navigation} />}
  >
    <Drawer.Screen name="Main" component={MainTopTab} />
  </Drawer.Navigator>
);

export default HomeDrawer;
```

드로어 네비게이터의 기존 컴포넌트도 렌더하고 싶다면, 기존 컴포넌트는 드로어 네비게이터에서 `DrawerItemList`컴포넌트에 props를 전달해주면된다.

```js
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} /> // <---
      <DrawerItem/>
      ...
    </DrawerContentScrollView>
  );
}
```

---

지금보니 정말 공식문서에 다 나와있어 블로깅 하면서 반성이 많이 되었다. 공식문서를 분명 봤음에도 불구하고.. 영문을 읽는 것이 어색해 중요한 내용들을 놓친 것 같다. 앞으론 확실히 이해를 못했다면 좀 천천히 꼼꼼히 봐야겠다..공식문서 🥲
