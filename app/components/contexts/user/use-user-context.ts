import { useSafeContext } from '../safe-context';
import { UserContext, UserContextInterface } from './UserContext';

export const useUserContext = (): UserContextInterface => {
  const userContext = useSafeContext(UserContext);

  if (!userContext) {
    throw new Error('useUserContext cannot be used outside of a UserContext');
  }

  return userContext;
};
