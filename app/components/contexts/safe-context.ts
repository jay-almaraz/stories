/**
 * Safety wrapper for using context, overrides the default optimistic typing which does not include undefined
 */

import { Context, useContext } from 'react';

export const useSafeContext = <T>(context: Context<T>): T | undefined => {
  return useContext(context);
};
