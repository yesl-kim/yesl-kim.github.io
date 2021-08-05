---
title: "정규표현식: 전역플랙그와 test(), exec()의 lastIndex속성"
date: "2020-04-11 19:31:00"
template: "post"
draft: false
slug: "regexp"
category: "Study"
description: "test()와 exec()를 전역플래그와 함께 사용했을 때 나타나는 문제"
---

정규표현식을 공부하면서 여러 예제를 만들어보던 도중 오류가 발생했다. 이유는 다음 메소드에서 전역 플래그를 사용할 경우 lastIndex 속성을 업데이트하기 때문이었다. 이번에 접한 오류에 대해 정리해보고자 한다.

### Question

'who'를 포함하거나 포함하지 않는 여러 문자열을 만들고, 정규식을 사용해서 문자열 중에 **'who'와 일치하는 부분만 배열로 반환**하는 코드를 작성해보았다. 그런데 정규식 `/who/` 를 사용한 코드와 `/who/g` 를 사용한 코드의 결과가 다르게 나타났다.

문자열 `'who is it'` 이 정규식 `/who/g` 에서는 검색이 되지 않았다.

```jsx
const tgStrs = [
  "who is who",
  "who is it",
  "it is who",
  "what is it",
  "what who what",
];
const regExp = /who/;
const regExp_g = /who/g;

const passedStrs = tgStrs.filter(s) => regExp.test(s));
const passedStrs_g = tgStrs.filter((s) => regExp_g.test(s));
```

```js
// 정규표현식 /who/를 사용한 결과
console.log(passedStrs);
/*
(4) ["who is who", "who is it", "it is who", "what who what"]
0: "who is who"
1: "who is it"
2: "it is who"
3: "what who what"
*/

// 정규표현식 /who/g를 사용한 결과
// 'who is it'이 매칭되지 않음
console.log(passedStrs_g);
/*
(3) ["who is who", "it is who", "what who what"]
0: "who is who"
1: "it is who"
2: "what who what"
*/
```

### Answer

이유는 `test()`의 `lastIndex` 속성 때문이었다. 이러한 점은 `exec()` 메소드에서도 마찬가지이다.

`/who/g` 처럼 `.test()`나 `.exec()` 메소드에서 전역 플래그를 사용하는 경우 메소드는 문자열을 검색한 후 그것의 위치를 `lastIndex` 속성에 저장한다. 다음 타깃 문자열을 검색할 때는 (이전과 다른 문자열이어도) 저장된 `lastIndex`의 위치에서부터 검색을 시작한다.
메소드가 `true`를 반환하면 `lastIndex`는 검색된 위치값만큼 계속 증가하고 `false`나 `null`를 반환하면 `0`이 된다.

---

[MDN | 전역 플래그와 test()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test)
