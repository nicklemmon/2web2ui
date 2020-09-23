import { useProvidedContext } from 'src/hooks';
import { AuthContext } from 'src/context/AuthContext';

export default function useAuth() {
  return useProvidedContext(AuthContext);
}
