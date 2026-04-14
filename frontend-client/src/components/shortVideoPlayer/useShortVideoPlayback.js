import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'expo';
import { useVideoPlayer } from 'expo-video';

export default function useShortVideoPlayback({
  streamUrl,
  isActive,
  isFocused,
  isLocked,
  itemKey,
  initialDuration = 0,
}) {
  const lastTapAtRef = useRef(0);
  const [firstFrameRendered, setFirstFrameRendered] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);

  const player = useVideoPlayer(streamUrl, (instance) => {
    instance.loop = true;
    instance.timeUpdateEventInterval = 0.5;
  });

  useEventListener(player, 'timeUpdate', (payload) => {
    setCurrentTime(payload.currentTime);

    if (payload.bufferedPosition > 0 && duration === 0) {
      setDuration(player.duration || initialDuration || 0);
    }
  });

  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'readyToPlay' && player.duration > 0) {
      setDuration(player.duration);
    }
  });

  useEffect(() => {
    if (!player) return;

    if (isActive && isFocused && !manuallyPaused) {
      player.play();
      return;
    }

    player.pause();
  }, [isActive, isFocused, manuallyPaused, player]);

  useEffect(() => {
    setFirstFrameRendered(false);
    setCurrentTime(0);
    setManuallyPaused(false);
    setDuration(initialDuration);
  }, [initialDuration, itemKey]);

  const togglePlayback = useCallback(() => {
    if (!player || isLocked || !isActive) return;

    const now = Date.now();
    if (now - lastTapAtRef.current < 80) return;
    lastTapAtRef.current = now;

    setManuallyPaused((previouslyPaused) => {
      const nextPaused = !previouslyPaused;

      if (nextPaused) {
        player.pause();
      } else if (isFocused) {
        player.play();
      }

      return nextPaused;
    });
  }, [isActive, isFocused, isLocked, player]);

  const seekTo = useCallback((time) => {
    if (!player) return;

    player.currentTime = time;
    setCurrentTime(time);
  }, [player]);

  return {
    currentTime,
    duration,
    firstFrameRendered,
    manuallyPaused,
    player,
    seekTo,
    setFirstFrameRendered,
    togglePlayback,
  };
}
