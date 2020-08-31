import React, { createContext, ReactElement, useCallback, useState } from 'react';

export interface UserContextInterface {
  userName?: string;
  sessionId: string;
  cityName: string;
  shiftName: string;
  heartedStoryIds: string[];
  addHeartedStoryId: (storyId: string) => void;
  removeHeartedStoryId: (storyId: string) => void;
}
export const UserContext = createContext<UserContextInterface | undefined>(undefined);

export const UserProvider: React.FC<Omit<
  UserContextInterface,
  'heartedStoryIds' | 'addHeartedStoryId' | 'removeHeartedStoryId'
>> = React.memo(
  ({ children, ...baseUser }): ReactElement => {
    const [heartedStoryIds, setHeartedStoryIds] = useState<string[]>([]);

    const addHeartedStoryId = useCallback(
      (storyId: string) => {
        setHeartedStoryIds((prevHeartedStoryIds) => [...prevHeartedStoryIds, storyId]);
      },
      [setHeartedStoryIds]
    );

    const removeHeartedStoryId = useCallback(
      (storyId: string) => {
        setHeartedStoryIds((prevHeartedStoryIds) => prevHeartedStoryIds.filter((x) => x !== storyId));
      },
      [setHeartedStoryIds]
    );

    const user = {
      ...baseUser,
      heartedStoryIds,
      addHeartedStoryId,
      removeHeartedStoryId,
    };

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }
);
