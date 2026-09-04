// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { ClientEvent, ClientEventHandlerMap, MatrixClient } from 'matrix-js-sdk';
import { useEffect } from 'react';

export const useSyncState = (
  mx: MatrixClient | undefined,
  onChange: ClientEventHandlerMap[ClientEvent.Sync]
): void => {
  useEffect(() => {
    mx?.on(ClientEvent.Sync, onChange);
    return () => {
      mx?.removeListener(ClientEvent.Sync, onChange);
    };
  }, [mx, onChange]);
};
