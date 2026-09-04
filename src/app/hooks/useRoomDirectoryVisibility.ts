// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useCallback, useEffect } from 'react';
import { Visibility } from 'matrix-js-sdk';
import { useAsyncCallback } from './useAsyncCallback';
import { useMatrixClient } from './useMatrixClient';

export const useRoomDirectoryVisibility = (roomId: string) => {
  const mx = useMatrixClient();

  const [visibilityState, loadVisibility] = useAsyncCallback(
    useCallback(async () => {
      const v = await mx.getRoomDirectoryVisibility(roomId);
      return v.visibility === Visibility.Public;
    }, [mx, roomId])
  );

  useEffect(() => {
    loadVisibility();
  }, [loadVisibility]);

  const setVisibility = useCallback(
    async (visibility: boolean) => {
      await mx.setRoomDirectoryVisibility(
        roomId,
        visibility ? Visibility.Public : Visibility.Private
      );
      await loadVisibility();
    },
    [mx, roomId, loadVisibility]
  );

  return {
    visibilityState,
    setVisibility,
  };
};
