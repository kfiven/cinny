// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useMemo } from 'react';
import { useMatrixClient } from './useMatrixClient';

import { getCanonicalAliasRoomId, isRoomAlias } from '../utils/matrix';

export const useJoinedRoomId = (allRooms: string[], roomIdOrAlias: string): string | undefined => {
  const mx = useMatrixClient();

  const joinedRoomId = useMemo(() => {
    const roomId = isRoomAlias(roomIdOrAlias)
      ? getCanonicalAliasRoomId(mx, roomIdOrAlias)
      : roomIdOrAlias;

    if (roomId && allRooms.includes(roomId)) return roomId;
    return undefined;
  }, [mx, allRooms, roomIdOrAlias]);

  return joinedRoomId;
};
