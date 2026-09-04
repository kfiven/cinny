// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { Room } from 'matrix-js-sdk';
import { createContext, useContext } from 'react';

const SpaceContext = createContext<Room | null>(null);

export const SpaceProvider = SpaceContext.Provider;

export function useSpace(): Room {
  const space = useContext(SpaceContext);
  if (!space) throw new Error('Space not provided!');
  return space;
}

export function useSpaceOptionally(): Room | null {
  const space = useContext(SpaceContext);
  return space;
}
