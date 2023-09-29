import {
  RESET_STORE_CHAT,
  ADD_ROOM,
  GET_ROOMS,
  GET_CHATS,
  ADD_CHAT,
} from "./type";
import { setLoadings } from "./uiAction";
import { addProdRequest } from "../api/productApi";
import { baseRequest, authRequest } from "../api/common";

export function resetStoreChat() {
  return {
    type: RESET_STORE_CHAT,
  };
}
export function addRoom(dataToSubmit) {
  return async (dispatch) => {
    try {
      const res = await authRequest().post("/api/chats", dataToSubmit);
      console.log("res", res);
      dispatch(setLoadings({ isLoading: false }));
      return dispatch({
        type: ADD_ROOM,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      return dispatch({
        type: ADD_ROOM,
        payload: err.response.data,
      });
    }
  };
}

export function getRooms() {
  const request = authRequest()
    .get(`/api/chat`)
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
  return {
    type: GET_ROOMS,
    payload: request,
  };
}
export function getChats(dataToSubmit) {
  const { roomId, lastId, limit } = dataToSubmit;
  const params = { lastId, limit };
  const request = authRequest({ params })
    .get(`/api/chat/${roomId}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
  return {
    type: GET_CHATS,
    payload: request,
  };
}

export function addChat(dataToSubmit) {
  return {
    type: ADD_CHAT,
    payload: dataToSubmit,
  };
}
// export function addChat(dataToSubmit) {
//   return async (dispatch) => {
//     try {
//       const res = await addProdRequest().post(
//         "/api/chat/addMessage",
//         dataToSubmit
//       );
//       console.log("res", res);
//       dispatch(setLoadings({ isLoading: false }));
//       return dispatch({
//         type: ADD_MESSAGE,
//         payload: res.data,
//       });
//     } catch (err) {
//       console.log(err);
//       return dispatch({
//         type: ADD_MESSAGE,
//         payload: err.response.data,
//       });
//     }
//   };
// }