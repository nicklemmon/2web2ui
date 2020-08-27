import useProvidedContext from 'src/hooks/useProvidedContext';
import { DomainsContext } from '../context/DomainsContext';

export default function useDomains() {
  return useProvidedContext(DomainsContext);
}
