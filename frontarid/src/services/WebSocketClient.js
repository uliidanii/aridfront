import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const createWebSocketClient = () => {
  let socket = null;
  let stompClient = null;
  let connected = false;

  const connect = (endpoint, callback) => {
    if (!connected) {
      socket = new SockJS(endpoint);
      stompClient = Stomp.over(socket);
      stompClient.debug = null;
      stompClient.connect(
        {},
        () => {
          connected = true;
          callback(stompClient);
        }
      );
    }
  };

  const disconnect = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
    connected = false;
    socket = null;
    stompClient = null;
  };

  return {
    connect,
    disconnect,
  };
};

export default createWebSocketClient;
