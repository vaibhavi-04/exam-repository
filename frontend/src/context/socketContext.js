import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children, userToken }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");

    if (userToken) {
      newSocket.emit("registerUser", userToken);
    }

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [userToken]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
