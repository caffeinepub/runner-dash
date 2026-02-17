import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ScoreEntry } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (score: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitScore(score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topScores'] });
      queryClient.invalidateQueries({ queryKey: ['bestScore'] });
    },
  });
}

export function useGetBestScore() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['bestScore'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getBestScore();
      } catch (error) {
        return BigInt(0);
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetTopScores(count: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScoreEntry[]>({
    queryKey: ['topScores', count],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores(BigInt(count));
    },
    enabled: !!actor && !actorFetching,
  });
}
