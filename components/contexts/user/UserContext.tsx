import React, { createContext, ReactElement } from 'react';

export interface UserContextInterface {
  userName?: string;
  cityName: string;
  shiftName: string;
}
export const UserContext = createContext<UserContextInterface | undefined>(undefined);

export const UserProvider: React.FC<UserContextInterface> = React.memo(
  ({ children, ...user }): ReactElement => {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }
);
