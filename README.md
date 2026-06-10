# Mini Cart

Next.js + Servlet/JDBC/MySQL로 구현한 세션 기반 미니 장바구니 프로젝트입니다.

기존에는 프론트엔드에서 `data.json`과 localStorage로 상품과 장바구니를 관리했지만, 현재는 Servlet API와 MySQL을 연결해 상품 조회, 로그인, 세션 기반 장바구니 기능을 백엔드에서 처리하도록 변경했습니다.

## 프로젝트 목표

- Next.js 프론트엔드와 Java Servlet 백엔드 연결
- JDBC를 사용한 MySQL 데이터 조회/저장
- Servlet, Service, DAO 계층 분리 연습
- 쿠키와 세션을 활용한 로그인 상태 유지
- 로그인한 사용자 기준 장바구니 관리 구현

## 기술 스택

### Frontend

- Next.js
- React
- Zustand
- Fetch API

### Backend

- Java 21
- Jakarta Servlet
- JDBC
- Gradle
- Tomcat 11

### Database

- MySQL

## 주요 기능

### 상품

- MySQL `products` 테이블에서 상품 목록 조회
- 프론트 메인 페이지에 상품 목록 렌더링

### 로그인

- `users` 테이블에서 아이디와 비밀번호 조회
- 로그인 성공 시 서버 세션에 사용자 정보 저장
- Tomcat이 발급하는 `JSESSIONID` 쿠키를 이용해 로그인 상태 유지
- 로그인한 사용자 정보 조회
- 로그아웃 시 세션 제거

### 장바구니

- 로그인한 사용자 기준 장바구니 조회
- 상품 장바구니 추가
- 이미 담긴 상품이면 수량 증가
- 수량 증가/감소
- 수량이 1일 때 감소하면 상품 삭제
- 장바구니 상품 삭제
- localStorage 대신 서버 DB 기준으로 장바구니 상태 관리

## 전체 흐름

```text
Frontend
Next.js 화면

↓ fetch 요청

Servlet API
/api/products
/api/auth/login
/api/cart

↓ Service 호출

Service
기능 흐름 처리

↓ DAO 호출

DAO
SQL 실행

↓ JDBC

MySQL
products, users, cart_items
```

## 계층 구조 설명

### Servlet

프론트엔드에서 들어오는 HTTP 요청을 받는 입구입니다.

예를 들어 장바구니 요청은 `CartApiServlet`이 받습니다.

```text
GET /backend/api/cart
POST /backend/api/cart
PUT /backend/api/cart
DELETE /backend/api/cart
```

Servlet은 요청 방식에 따라 필요한 데이터를 읽고, 로그인 여부를 확인한 뒤 Service를 호출합니다.

### Service

하나의 기능 흐름을 담당합니다.

예를 들어 장바구니에 상품을 추가할 때는 단순히 INSERT만 하는 것이 아니라, 이미 담긴 상품인지 확인하고, 수량을 증가시키거나 새로 추가한 뒤 최신 장바구니 목록을 다시 조회합니다.

### DAO

DB에 SQL을 직접 실행하는 계층입니다.

DAO는 `PreparedStatement`를 사용해 SQL을 실행하고, 조회 결과인 `ResultSet`을 DTO 객체로 변환합니다.

### DB

실제 데이터가 저장되는 곳입니다.

상품, 사용자, 장바구니 정보는 MySQL 테이블에 저장됩니다.

## DB 설계

### products

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| product_id | INT | 상품 PK |
| name | VARCHAR | 상품명 |
| price | INT | 가격 |
| image | VARCHAR | 이미지 경로 |

### users

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| user_id | INT | 사용자 PK |
| login_id | VARCHAR | 로그인 아이디 |
| password | VARCHAR | 비밀번호 |
| name | VARCHAR | 사용자 이름 |

### cart_items

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| cartitem_id | INT | 장바구니 항목 PK |
| user_id | INT | 사용자 FK |
| product_id | INT | 상품 FK |
| quantity | INT | 수량 |

장바구니는 로그인한 사용자별로 관리하기 때문에 `cart_items` 테이블에 `user_id`가 필요합니다.

## API 목록

### 상품 API

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/backend/api/products` | 상품 전체 조회 |

### 인증 API

| Method | URL | 설명 |
| --- | --- | --- |
| POST | `/backend/api/auth/login` | 로그인 |
| GET | `/backend/api/auth/me` | 로그인 사용자 조회 |
| POST | `/backend/api/auth/logout` | 로그아웃 |

### 장바구니 API

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/backend/api/cart` | 로그인한 사용자의 장바구니 조회 |
| POST | `/backend/api/cart` | 장바구니 상품 추가 |
| PUT | `/backend/api/cart` | 장바구니 상품 수량 수정 |
| DELETE | `/backend/api/cart?productId={productId}` | 장바구니 상품 삭제 |
| DELETE | `/backend/api/cart` | 장바구니 전체 비우기 |

## 세션 기반 로그인 구현

로그인 성공 시 서버는 사용자 정보를 세션에 저장합니다.

```java
req.getSession().setAttribute("loginUser", loginUser);
```

이때 Tomcat은 브라우저에 `JSESSIONID` 쿠키를 자동으로 내려줍니다.

이후 프론트엔드는 요청을 보낼 때 쿠키를 함께 전송합니다.

```js
fetch(url, {
  credentials: "include",
});
```

서버는 요청에 포함된 `JSESSIONID`를 이용해 세션을 찾고, 세션 안의 `loginUser`로 현재 로그인한 사용자를 확인합니다.

장바구니 API는 프론트에서 `userId`를 직접 받지 않고, 세션에 저장된 로그인 사용자 기준으로 장바구니를 조회합니다.

```text
브라우저 요청
→ JSESSIONID 쿠키 전달
→ 서버가 세션 조회
→ loginUser 확인
→ loginUser.userId로 cart_items 조회
```

## JDBC 연결

DB 연결 정보는 `backend/src/main/resources/db.properties`에 저장합니다.

```properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/minicart_db
user=ohgiraffers
password=ohgiraffers
```

`JDBCTemplate`은 DB 연결과 자원 정리를 담당합니다.

- `Connection`: Java와 MySQL 사이의 연결
- `PreparedStatement`: SQL 실행 준비 객체
- `ResultSet`: SELECT 결과를 담는 객체

DB 작업 후에는 사용한 자원을 닫아 연결이 계속 남지 않도록 처리합니다.

## 프론트엔드 연결 방식

프론트엔드는 API 함수를 분리해 Servlet API를 호출합니다.

```text
frontend/src/api/products.js
frontend/src/api/auth.js
frontend/src/api/cart.js
```

장바구니 상태는 Zustand로 관리하지만, localStorage에 저장하지 않습니다.

현재 장바구니의 실제 기준은 서버 DB이며, Zustand는 화면에 보여줄 최신 응답 데이터를 담는 역할을 합니다.

```text
상품 추가 버튼 클릭
→ POST /backend/api/cart
→ DB 저장 또는 수량 증가
→ 최신 장바구니 목록 응답
→ Zustand cart 상태 갱신
```

## 폴더 구조

```text
minicart/
  backend/
    src/main/java/com/minicart/
      common/
        JDBCTemplate.java
      product/
        ProductDTO.java
        ProductDAO.java
        ProductService.java
        ProductApiServlet.java
      user/
        UserDTO.java
        UserDAO.java
        UserService.java
        AuthApiServlet.java
      cart/
        CartItemDTO.java
        CartDAO.java
        CartService.java
        CartApiServlet.java
    src/main/resources/
      db.properties
    build.gradle

  frontend/
    src/
      api/
        products.js
        auth.js
        cart.js
      app/
        page.js
        login/page.js
        carts/page.js
      components/
        products/
        carts/
      store/
        useCartStore.js
```

## 실행 방법

### 1. MySQL DB 준비

`minicart_db` 데이터베이스와 `products`, `users`, `cart_items` 테이블을 준비합니다.

### 2. 백엔드 빌드

```bash
cd backend
./gradlew war
```

생성된 WAR 파일:

```text
backend/build/libs/backend-1.0-SNAPSHOT.war
```

이 WAR 파일을 Tomcat에 `/backend` 경로로 배포합니다.

### 3. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

프론트엔드 접속 주소:

```text
http://localhost:3000
```

백엔드 API 주소:

```text
http://localhost:8080/backend
```

## 학습 포인트

- 프론트엔드 상태 관리에서 서버 DB 기반 상태 관리로 전환
- Servlet, Service, DAO 역할 분리
- JDBC의 `Connection`, `PreparedStatement`, `ResultSet` 흐름 이해
- 세션과 `JSESSIONID` 쿠키를 이용한 로그인 유지
- 로그인한 사용자 기준으로 장바구니 데이터를 분리하는 방식 이해
