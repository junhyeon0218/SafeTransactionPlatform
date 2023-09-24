/* 
(1) Action 
: 중앙 저장소에 저장된 state에 “무슨” 동작을 할 것이지 적어놓는 객체
  action에는 type이 필수로 필요
  type을 직접 처럼 선언하거나, 모듈로 저장
*/

// action의 type들만 관리 (action의 type를 정의)
//user
export const SIGNUP_USER = "signup";
export const LOGIN_USER = "login";
export const LOGOUT_USER = "logout";
export const AUTH_USER = "auth";
export const ADD_WISHLIST = "addWishList";
export const GET_WISHLIST = "getWishList";
//product
export const ADD_PRODUCT = "addProduct";
export const DEPOSITED_PRODUCTS = "depositedProducts";
export const GET_PRODUCTS = "getProducts";
export const RECENT_PRODUCTS = "recentProducts";
export const GET_PRODUCT = "getProduct";
export const DEPOSIT = "deposit";
export const RELEASE = "release";
//ui
export const SET_LOADINGS = "setLoadings";
export const SET_CONTRACT_LOADING = "setContractLoading";
//chat
export const ADD_ROOM = "addRoom";
export const GET_ROOMS = "getRooms";
export const GET_CHATS = "getChats";
// export const GET_UNREAD_CHATS = "getUnreadChats";
export const ADD_MESSAGE = "addMessage";