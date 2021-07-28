---
title: "this"
date: "2020-07-28 19:57:00"
template: "post"
draft: false
slug: "this"
category: "JavaScript"
description: "호출방식에 따라 다르게 바인딩되는 자바스크립트의 this (feat. 일반함수, 화살표함수, call, apply, bind)"
---

> [poiemaweb | 5.17 this](https://poiemaweb.com/js-this)  
> [poiemaweb | 6.3 Arrow function](https://poiemaweb.com/es6-arrow-function)  
> [MDN | 화살표 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Arrow_functions)  
> 정재남, 코어자바스크립트, 위키북스

## 일반 함수의 this

자바스크립트는 **함수 호출 방식**에 따라 `this`에 바인딩되는 객체가 달라진다.

1. 함수 호출 방식
2. 메소드 호출 방식
3. 생성자 함수 호출 방식

<br/>

---

### 함수 호출 방식 : 전역객체

- 기본적으로 `this`는 전역객체에 바인딩된다.
- 브라우저 환경에서 전역객체는 `window`, Node.js 환경에서는 `global`이다.

<br/>

### 메소드 호출 방식 : 메소드를 호출한 obj

- 함수를 객체의 메소드로 호출할 경우 `this`는 메소드를 호츨한 객체에 바인딩된다.
- 메소드 내부에서 함수를 호출하더라도 그 방식이 메소드로서가 아닌 함수로 호출했다면 this는 전역객체를 가리킨다.

```js
var obj1 = {
  outer: function() {
    console.log("outer", this); // this -> obj1
    var innerFunc = function(b) {
      console.log(b, this);
    };
    innerFunc("innerFunc"); // this -> window

    var obj2 = {
      innerMethod: innerFunc,
    };

    obj2.innerMethod("innerMethod"); // this -> obj2
  },
};

obj1.outer();
```

<br/>

### 생성자 함수 호출 : instance

- new 키워드와 함께 호출된 함수는 생성자 함수로서 실행된다.

- 생성자 함수로 호출된 함수 내부의 this는 생성자 함수로 새로 만들어진 객체 (instance)를 가리킨다.

- 참고로 생성자 함수는 일단 빈 객체를 만들고 함수 안에서 `this`를 통해 빈 객체에 새로운 프로퍼티를 추가하는 방식으로 동작한다.

<br/>

### 콜백 함수 호출 방식 : 콜백함수를 받는 메소드가 지정

- 콜백함수를 받는 메소드(setTimeout, map, forEach 등과 같이 콜백함수를 전달해준 메소드)에게 제어권이 있다.

- 즉, 메소드에서 지정하는 요소가 this가 된다.  
  대표적인 예가 `EventListener`  
  `EventListener` 메소드는 이벤트가 일어난 객체를 this에 바인딩한다.

- 메소드가 지정하지 않을 경우 기본적으로 전역객체를 바인딩하게 된다.  
  대표적인 예가 `setTimeout`

<br/>

### 번외) this를 우회하는 방법

- 일반 함수로 호출하면서 주변 환경의 this를 그대로 사용하고 싶다면,  
  주변 환경의 this를 따로 임의의 변수에 담아 사용할 수 있다.

- 임의의 변수명으로는 주로 \_this, that, self를 쓴다

```js
var obj1 = {
  outer: function() {
    var self = this;

    var innerFunc = function() {
      console.log(this);
    };
    var innerFunc2 = function() {
      console.log(self);
    };

    innerFunc(); // this -> window
    innerFunc2(); // this -> obj1
  },
};

obj1.outer();
```

<br/>

---

## 화살표 함수의 this

- 화살표 함수는 실행 컨텍스트 생성 시 this가 바인딩되는 과정이 제외되었다.

- 함수가 선언될 때 this가 정적으로 결정된다.

- 화살표 함수로 정의된 함수를 호출하면,
  그 방식이 내부 함수이든, 콜백 함수이든간에 **항상 선언된 시점의 바로 상위 스코프의 this**를 가리킨다.

```js
var globalArrowFunc = (b) => {
  console.log(b, this);
};

var obj1 = {
  outer: () => {
    console.log("outer", this); // this -> window
    // 선언 시점 obj1와 같은 레벨의 컨텍스트를 갖는다.
    // 그 상위 레벨인 전역 스코프의 전역 객체가 this에 바인딩된다.

    var innerArrowFunc = (b) => {
      console.log(b, this);
    };

    innerArrowFunc("innerArrowFunc"); // this -> obj1
    globalArrowFunc("globalArrowFunc"); // this -> window

    var obj2 = {
      innerArrowMethod: innerArrowFunc,
    };

    obj2.innerArrowMethod("innerArrowMethod"); // this -> obj1
    // 함수로 호출하든지 메소드로 호출하든지, 호출방식은 관여하지 않는다.
  },
};

obj1.outer();
```

<br/>

---

## this를 명시적으로 바인딩하는 방법

### call

> Fuction.prototype.call(thisArg[, arg1[, arg2 [, ...]])

<br/>

### apply

> Function.prototype.apply(thisArg[, argArr])

- 메소드의 호출 주체인 함수를 즉시 실행한다.

- 이때 함수에 첫번째 인자를 this로 전달하고, 그 외의 인자들은 모두 함수의 인자로 전달한다.

- call 과 apply의 기능은 완전히 동일하다.

- 다른 점은  
  call은 함수에 전달되는 인자를 그대로, apply는 인자를 **배열형태로** 전달받는다는 것

<br/>

### call과 bind의 활용

#### 유사배열객체에 배열 메소드 사용

> **유사배열객체**  
> 0 또는 양의 정수의 프로퍼티가 하나 이상 있고  
> length 프로퍼티가 0 또는 양의 정수의 값을 가지고 있는 객체

<br/>

#### 생성자 함수 내부에서 또다른 생성자 함수를 호출할 때

- 생성자 함수 내부에서 다른 생성자 함수를 호출하여 중복되는 코드를 줄일 수 있다.

```js
function Person(name, gender) {
  this.name = name;
  this.gender = gender;
}

function Student(name, gender, school) {
  Person.call(this, name, gender);
  this.school = school;
}

function Employee(name, gender, company) {
  Person.apply(this, [name, gender]);
  this.company = company;
}
```

<br/>

#### 여러 인수의 배열을 묶어 한번에 전달하고 싶을 때

```js
const nums = [1, 2, 3, 4];
const max = Math.max.apply(null, [nums]);
```

<br/>

### bind

> Function.prototype.bind(thisArg[, arg1[, arg2[, ...]]])

- call과 apply와 다르게 바로 실행하지 않는다.  
  thisArg를 this로 사용하고 인자들을 사용하는 **함수를 반환한다.**

- name 프로퍼티에 `bound _원본 함수명_` 로 저장되어 call과 apply보다 코드를 추적하기 더 수월하다.
