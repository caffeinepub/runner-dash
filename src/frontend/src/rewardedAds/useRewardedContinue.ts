import { useState, useCallback } from 'react';

export function useRewardedContinue() {
  const [canContinue, setCanContinue] = useState(true);
  const [isShowingAd, setIsShowingAd] = useState(false);

  const showRewardedAd = useCallback(() => {
    if (!canContinue) return false;
    setIsShowingAd(true);
    return true;
  }, [canContinue]);

  const completeAd = useCallback(() => {
    setIsShowingAd(false);
    setCanContinue(false);
  }, []);

  const reset = useCallback(() => {
    setCanContinue(true);
    setIsShowingAd(false);
  }, []);

  return {
    canContinue,
    isShowingAd,
    showRewardedAd,
    completeAd,
    reset,
  };
}
