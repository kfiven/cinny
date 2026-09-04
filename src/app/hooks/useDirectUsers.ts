// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useMemo } from 'react';
import { AccountDataEvent, MDirectContent } from '../../types/matrix/accountData';
import { useAccountData } from './useAccountData';
import { useAllJoinedRoomsSet, useGetRoom } from './useGetRoom';

export const useDirectUsers = (): string[] => {
  const directEvent = useAccountData(AccountDataEvent.Direct);
  const content = directEvent?.getContent<MDirectContent>();

  const allJoinedRooms = useAllJoinedRoomsSet();
  const getRoom = useGetRoom(allJoinedRooms);

  const users = useMemo(() => {
    if (typeof content !== 'object') return [];

    const u = Object.keys(content).filter((userId) => {
      const rooms = content[userId];
      if (!Array.isArray(rooms)) return false;
      const hasDM = rooms.some((roomId) => typeof roomId === 'string' && !!getRoom(roomId));
      return hasDM;
    });

    return u;
  }, [content, getRoom]);

  return users;
};
