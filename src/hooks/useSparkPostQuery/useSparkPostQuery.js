import { useAuth, useQuery } from 'src/hooks';

export default function useSparkPostQuery(queryFn) {
  const { token } = useAuth();
  const query = queryFn();

  return useQuery([query[0], { ...query[1], token }]);
}
