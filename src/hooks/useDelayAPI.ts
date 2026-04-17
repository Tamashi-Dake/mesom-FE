import { useQuery, useMutation } from "@tanstack/react-query";

import createDelayedFunction from "../utils/createDelayedFunction";

export const useDelayedQuery = ({
  queryKey,
  queryFn,
  delay = 400,
  ...options
}) => {
  const delayedFn = createDelayedFunction(queryFn, delay);

  return useQuery({
    queryKey,
    queryFn: delayedFn,
    ...options,
  });
};

export const useDelayedMutation = ({
  mutationKey,
  mutationFn,
  delay = 400,
  ...options
}) => {
  const delayedFn = createDelayedFunction(mutationFn, delay);

  return useMutation({ mutationKey, mutationFn: delayedFn, ...options });
};
