'use client';

import { createContext, useContext } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children, value }) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}