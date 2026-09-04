// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useState, useCallback } from 'react';
import { useMatrixClient } from './useMatrixClient';
import { useAccountDataCallback } from './useAccountDataCallback';

export function useAccountData(eventType: string) {
  const mx = useMatrixClient();
  const [event, setEvent] = useState(() => mx.getAccountData(eventType));

  useAccountDataCallback(
    mx,
    useCallback(
      (evt) => {
        if (evt.getType() === eventType) {
          setEvent(evt);
        }
      },
      [eventType, setEvent]
    )
  );

  return event;
}
