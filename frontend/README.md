# Mini Cart Project

Zustand를 활용해 장바구니 기능을 구현한 미니 쇼핑몰 프로젝트입니다.  
상품 목록 조회, 장바구니 담기, 수량 변경, 삭제, 총 금액 계산, 상태 유지 기능을 구현했습니다.

## 1. 프로젝트 소개

이 프로젝트는 Next.js와 Zustand를 사용하여 쇼핑몰의 장바구니 기능을 구현하는 것을 목표로 합니다.  
전역 상태 관리 방식과 컴포넌트 간 데이터 흐름을 이해하고, 실제 쇼핑몰의 핵심 기능을 직접 구현하는 데 목적이 있습니다.

## 2. 기획 의도

- Zustand를 활용한 전역 상태 관리 방식 이해
- 장바구니의 핵심 로직 구현
- 상품 목록 페이지와 장바구니 페이지 간 상태 공유 경험
- 실무형 데이터 흐름 구조 학습
- persist를 활용한 상태 유지 경험

## 3. 페이지 구성

- `/`
  상품 목록 페이지
- `/carts`
  장바구니 페이지

## 4. 핵심 기능

- 상품 목록 조회
- 장바구니 담기
- 장바구니 상품 삭제
- 상품 수량 증가 / 감소
- 총 상품 수 계산
- 총 결제 금액 계산
- 새로고침 후 장바구니 유지
- 결제하기 버튼 클릭 시 총 결제 금액 alert 출력

## 5. 기능 명세서

### 5-1. 상품 목록 조회

- `json-server`를 통해 상품 데이터를 조회합니다.
- 메인 페이지에서 상품 목록을 렌더링합니다.

### 5-2. 장바구니 담기

- 사용자가 상품 카드의 `Add to Cart` 버튼을 클릭하면 해당 상품이 장바구니에 추가됩니다.
- 이미 장바구니에 있는 상품이면 새 항목을 추가하지 않고 `quantity`를 증가시킵니다.

### 5-3. 수량 증가

- 장바구니 페이지에서 `수량 증가` 버튼 클릭 시 해당 상품의 수량이 1 증가합니다.

### 5-4. 수량 감소

- 장바구니 페이지에서 `수량 감소` 버튼 클릭 시 해당 상품의 수량이 1 감소합니다.
- 수량이 1일 때 감소 버튼을 누르면 해당 상품은 장바구니에서 제거됩니다.

### 5-5. 상품 삭제

- `상품 삭제` 버튼 클릭 시 해당 상품을 장바구니에서 제거합니다.

### 5-6. 총 상품 수 계산

- 장바구니에 담긴 전체 상품 수량의 합을 계산합니다.

### 5-7. 총 결제 금액 계산

- 각 상품의 `price * quantity`를 합산하여 총 결제 금액을 계산합니다.

### 5-8. 상태 유지

- `persist` middleware를 사용하여 장바구니 상태를 `localStorage`에 저장합니다.
- 페이지를 새로고침해도 장바구니 데이터가 유지됩니다.

## 6. API 연결 방식

상품 데이터는 `json-server`를 사용해 로컬 API 형태로 연결했습니다.

### 사용 데이터 파일

- `data.json`

### 실행 명령어

```bash
npx json-server --watch data.json --port 3001
```

### API 주소

```bash
http://localhost:3001/products
```

### 사용 방식

API 호출 함수는 `src/api/products.js`에 분리하여 관리합니다.  
메인 페이지는 해당 함수를 import해서 상품 목록 데이터를 가져옵니다.

```js
import { fetchProducts } from "@/api/products";

const products = await fetchProducts();
```

즉, 상품 목록은 API에서 불러오고 장바구니 상태는 프론트엔드의 Zustand store에서 관리하는 구조입니다.

## 7. Zustand 활용 방식

장바구니 상태는 Zustand를 사용해 전역으로 관리했습니다.

### store에서 관리하는 상태

- `cart`
  장바구니 상품 배열

### store에서 관리하는 action

- `addToCart(product)`
- `removeFromCart(productId)`
- `increaseQty(productId)`
- `decreaseQty(productId)`
- `clearCart()`

### store에서 계산하는 값

- `getTotalItems()`
- `getTotalPrice()`

### 활용 이유

- 상품 목록 페이지와 장바구니 페이지가 같은 상태를 공유해야 하기 때문
- props drilling 없이 필요한 컴포넌트에서 바로 상태를 사용할 수 있기 때문
- 장바구니 추가/삭제/수량 변경 로직을 한 곳에서 관리할 수 있기 때문
- persist middleware를 통해 상태 유지가 쉽기 때문

### 데이터 흐름

1. 메인 페이지에서 상품 목록 조회
2. 사용자가 `Add to Cart` 클릭
3. `addToCart(product)` 실행
4. Zustand store의 `cart` 상태 변경
5. `/carts` 페이지가 변경된 상태를 읽어 자동 리렌더링
6. 총 수량, 총 금액도 함께 갱신

## 8. 폴더 구조

```bash
src/
  api/
    products.js
  app/
    page.js
    carts/
      page.js
  components/
    carts/
      CartItem.js
      CartSummary.js
    products/
      ProductCard.js
      ProductList.js
  store/
    useCartStore.js
```

## 9. 실행 방법

### 1. 패키지 설치

```bash
npm install
npm install zustand
```

### 2. json-server 실행

```bash
npx json-server --watch data.json --port 3001
```

### 3. Next.js 실행

```bash
npm run dev
```

### 4. 접속 주소

- 메인 페이지: `http://localhost:3000`
- 장바구니 페이지: `http://localhost:3000/carts`

## 10. 역할 분담

### 상품 목록 페이지

- 상품 조회 API 연결
- 상품 카드 렌더링
- `Add to Cart` 버튼 연결

### 장바구니 페이지

- 장바구니 목록 렌더링
- 수량 증가 / 감소
- 상품 삭제
- 총 상품 수 / 총 결제 금액 계산
- 결제 버튼 동작 구현
