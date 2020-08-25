import { Context, useContext } from 'react';

export const useSafeContext = <T>(context: Context<T>): T | undefined => {
  return useContext(context);
};
