// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { Room } from 'matrix-js-sdk';
import { createContext, useContext } from 'react';

const RoomContext = createContext<Room | null>(null);

export const RoomProvider = RoomContext.Provider;

export function useRoom(): Room {
  const room = useContext(RoomContext);
  if (!room) throw new Error('Room not provided!');
  return room;
}

const IsDirectRoomContext = createContext<boolean>(false);

export const IsDirectRoomProvider = IsDirectRoomContext.Provider;

export const useIsDirectRoom = () => {
  const direct = useContext(IsDirectRoomContext);

  return direct;
};
