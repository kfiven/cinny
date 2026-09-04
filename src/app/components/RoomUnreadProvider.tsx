// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { ReactElement } from 'react';
import { Unread } from '../../types/matrix/room';
import { useRoomUnread, useRoomsUnread } from '../state/hooks/unread';
import { roomToUnreadAtom } from '../state/room/roomToUnread';

type RoomUnreadProviderProps = {
  roomId: string;
  children: (unread?: Unread) => ReactElement;
};
export function RoomUnreadProvider({ roomId, children }: RoomUnreadProviderProps) {
  const unread = useRoomUnread(roomId, roomToUnreadAtom);

  return children(unread);
}

type RoomsUnreadProviderProps = {
  rooms: string[];
  children: (unread?: Unread) => ReactElement;
};
export function RoomsUnreadProvider({ rooms, children }: RoomsUnreadProviderProps) {
  const unread = useRoomsUnread(rooms, roomToUnreadAtom);

  return children(unread);
}
