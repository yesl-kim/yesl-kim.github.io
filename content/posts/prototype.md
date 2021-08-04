---
title: "this"
date: "2020-07-31 12:53:00"
template: "post"
draft: false
slug: "prototype"
category: "JavaScript"
description: "코어자바스크립트 6장. prototype"
---

> 정재남, 코어 자바스크립트, 위키북스

자바스크립트는 프로토타입 기반 언어이다.

클래스 기반 언어에서는 상속을 사용하지만, 자바스크립트에서는 대신 어떤 객체를 원형(prototype)으로 삼고 이를 참조함을써 상속과 비슷한 효과를 낸다.

## 프로토타입 개념

![자바스크립트의 프로토타입](https://blog.kakaocdn.net/dn/d8bXKF/btqzKfhKKnA/oiWKbqLb3KqkKb07RBsi80/img.png)

- 프로토타입은 객체이다.

- **`prototype` 객체 내부에는 인스턴스가 사용할 메소드를 저장한다.**

  > 여기서 잠깐,  
  > **왜 메소드는 prototype에 저장해야 할까?**
  > 생성자 함수 내부에서 메소드를 바로 작성(1)도 가능하지만 메소드는 prototype의 메소드로 작성하는 것(2)이 권장되는 방법이다.  
  > (1)의 경우 인스턴스마다 같은 함수를 새롭게 생성하지만, (2)의 경우는 동일한 prototype의 메소드를 참조(같은 함수를 공유)하는 것이기 때문에 메모리 낭비를 방지할 수 있다.

  ```js
  // (1)
  const Person = function(name) {
    this.name = name;
    this.greet = function() {
      return `hi! I', ${this.name}`;
    };
  };

  // (2)
  const Person = function(name) {
    this.name = name;
  };
  Person.prototype.greet = function() {
    return `hi! I', ${this.name}`;
  };
  ```

- 자바스크립트에서 함수는 속성을 가질 수 있고, 모든 함수는 `prototype` 속성을 가진다.

- 해당 함수를 생성자 함수로(new 키워드와 함께) 호출할 경우 그로부터 생성된 인스턴스에는 자동으로 `__proto__`라는 프로퍼티를 생성한다. 이 `__proto__` 프로퍼티는 생성자 함수의 prototype을 참조한다.

- **인스턴스의 `__proto__`프로퍼티는 생략이 가능하다.**  
  즉, 인스턴스의 `__proto__`프로퍼티로 생성자 함수 prototype의 프로퍼티에 접근할 수 있지만, 인스턴스의 프로퍼티로도 prototype 프로퍼티에 바로 접근이 가능하다.  
   -> `인스턴스.__proto__.프로퍼티 = 인스턴스.프로퍼티 = 생성자.prototype.프로퍼티`

- _"생성자 함수의 prototype에 어떤 메소드나 프로퍼티가 있다면 인스턴스에서도 마치 자신의 것처럼 해당 메소드나 프로퍼티에 접근할 수 있게 됩니다."_  
  인스턴스의 `__proto__`프로퍼티로 prototype 속성에 접근할 경우 `this`가 인스턴스를 가리키는 것이 아니라 `__proto__`를 가리키는 것에 주의해야 한다.

- **실제 `__proto__`프로퍼티로 접근을 할 경우 `인스턴스.__proto__`가 아닌 `Object.getPrototypeOf(인스턴스)`가 권장되는 방법이다.**

- 프로토타입에는 constructor라는 프로퍼티가 있는데 이는 생성자 함수를 가리킨다. 이 프로퍼티는 인스턴스가 자신의 생성자 함수가 무엇인지를 알기 위함이다.

## 메소드 오버라이딩

- 같은 이름의 메소드나 프로퍼티를 인스턴스의 프로퍼티로 할당할 수도 있고, 인스턴스의 `__proto__`의 프로퍼티로 할당할 수도 있다.

- 이럴 경우 흔히 객체처럼 덮어쓰기되어 값이 교체되는 것이 아니라, (결국 다른 객체에 저장되는 것이니까..) 두 값 모두 보존이 된다.

```js
// 동시에 할당이 가능
var Person = function (name) {
  (this.name = name),
    (this.getName = function () {
      return this.name;
    });
};

Person.prototype.getName = function () {
  return `my name is ${this.name}`;
};

var p1 = new Person('ys')

// p1
// 이런 형태
Person {
  name: 'ys',
  getName: f (), // <--
  __proto__: {
    constructor: f Person (),
    getName: f () // <--
  }
}
```

## 프로토타입 체이닝

- 인스턴스의 `__proto__`속성은 조상의 `prototype`을 참조하고 그 조상은 다시 더 위의 조상의 인스턴스가 될 수 있다.  
  예를 들어, 배열 리터럴은 Array의 인스턴스이고 Array는 다시 Object의 인스턴스이다.

- 객체의 속성에 접근하려고 할 때, 객체 자신의 속성을 검색한 뒤 `__proto__`가 참조하는 `prototype`의 속성을 검색하고 다시 ...  
  prototype이 null을 가리키게 될 때까지 (window.Object.prototype) 계속 조상의 prototype 검색하여 올라간다.

- 이렇게 어떤 속성에 접근할 때 `__proto__` 이 참조하는 프로토타입을 계속 찾아가는 과정을 **프로토타입 체이닝**이라고 하며, 이렇게 프로토타입이 연결되어 있는 것을 **프로토타입 체인**이라고 한다.

- 이 프로토타입 체이닝을 통해 각 프로토타입 메소드(조상의 메소드)를 자신의 것처럼 호출할 수 있다. (`__proto__`가 생략이 가능하기 떄문에)

- 이때 호출된 메소드는 인스턴스로부터 가장 가까운 메소드가 실행된다.

- 이런 프로토타입 체이닝은 간혹 성능에 나쁜 영향을 줄 수 있다.  
  가령, 객체에 존재하지 않는 속성에 접근하려 할 때에 프로토타입 체인상에 있는 모든 객체의 속성을 탐색해야 하기 때문에 성능에 매우 좋지 않다.

- 이럴 때는 자신만의 속성만 검사하는 `hasOwnProperty` 메소드를 사용하도록 한다.

## 객체 전용 메소드의 예외사항

- 프로토타입은 결국 객체이기 때문에 (프로토타입 자체가 결국 객체의 인스턴스이기 때문에), `__proto__` 이 참조하는 프로토타입을 계속 찾아가면 결국 그 끝은 Object.prototype이다.

- 그렇기 때문에 Object.prototype에 저장된 메소드는 모든 데이터 타입에서 (타입에 상관없이) 사용할 수 있기 때문에 주의가 필요하다.

- 이런 이유로 객체만을 대상으로 하는 객체 전용 메소드들은 Object.prototype이 아닌, Object의 스태틱 메소드로 부여되었다.  
  -> Object.entries(_object instance_)로 써야하는 이유
