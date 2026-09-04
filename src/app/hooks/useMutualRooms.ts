// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useCallback } from 'react';
import { useMatrixClient } from './useMatrixClient';
import { AsyncState, useAsyncCallbackValue } from './useAsyncCallback';
import { useSpecVersions } from './useSpecVersions';

export const useMutualRoomsSupport = (): boolean => {
  const { unstable_features: unstableFeatures } = useSpecVersions();

  const supported =
    unstableFeatures?.['uk.half-shot.msc2666'] ||
    unstableFeatures?.['uk.half-shot.msc2666.mutual_rooms'] ||
    unstableFeatures?.['uk.half-shot.msc2666.query_mutual_rooms'];

  return !!supported;
};

export const useMutualRooms = (userId: string): AsyncState<string[], unknown> => {
  const mx = useMatrixClient();

  const supported = useMutualRoomsSupport();

  const [mutualRoomsState] = useAsyncCallbackValue(
    useCallback(
      () => (supported ? mx._unstable_getSharedRooms(userId) : Promise.resolve([])),
      [mx, userId, supported]
    )
  );

  return mutualRoomsState;
};
