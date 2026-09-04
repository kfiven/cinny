// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { MatrixClient, MatrixEvent, RoomState, RoomStateEvent } from 'matrix-js-sdk';
import { useEffect } from 'react';

export type StateEventCallback = (
  event: MatrixEvent,
  state: RoomState,
  lastStateEvent: MatrixEvent | null
) => void;

export const useStateEventCallback = (mx: MatrixClient, onStateEvent: StateEventCallback) => {
  useEffect(() => {
    mx.on(RoomStateEvent.Events, onStateEvent);
    return () => {
      mx.removeListener(RoomStateEvent.Events, onStateEvent);
    };
  }, [mx, onStateEvent]);
};
