# RC카 네트워크를 통해 조종하기

## 개요
3인 개발입니다.

개인 기여도 : 100%

제작 기간 : 2022.11 ~ 2022.12

## UX/UI
<img src="https://github.com/seungwoo505/RC-Control/blob/main/RC_Car.gif" height="1000"/>

<https://github.com/seungwoo505/RC-Control/blob/main/RC_Car.mp4>

깔끔한 영상을 보고 싶으시면 위의 링크를 통해 확인해주시면 됩니다.

## 설명
라즈베리파이에 Flask를 통해 웹서비스를 구현하고 외부에서 동작하여 RC카가 구동되게 동작하였습니다.

주제 자체가 자유이기 때문에 어떻게 만들까 고민을 했습니다. 웹사이트 특성 상 업데이트가 될 때마다 리렌더링이 됩니다.

그 부분에 대해서는 배운적이 없기 때문에 다른 팀에서는 리렌더링을 막는 행위는 안할거라 판단했습니다.

그래서 우리만의 방식으로 만들어보자와 RC카의 기본은 조종해서 자유롭게 움직이는 것이므로 AJAX를 이용해서 리렌더링을 막아 사용자가 원하는대로 움직이게하면 어떨까에 만들게 되었습니다.

## 직면한 문제
라즈베리파이로 실시간 통신을 진행하려하다보니 성능상의 문제가 발생되었습니다.

일정 거리 이하가 되면 빨간 경고창과 함께 움직임을 막게 설정을 했는데 빠른 동작을 할 경우
반응이 늦는 현상이 발생되었습니다. 그래서 반응하는 거리를 증가시키므로써 늦게 반응하더라도 벽과 부딪히지않도록 수정했습니다.


## 사용된 개념

- Flask
- html, css, JS
