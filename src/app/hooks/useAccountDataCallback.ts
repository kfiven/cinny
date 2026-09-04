// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { ClientEvent, ClientEventHandlerMap, MatrixClient } from 'matrix-js-sdk';
import { useEffect } from 'react';

export const useAccountDataCallback = (
  mx: MatrixClient,
  onAccountData: ClientEventHandlerMap[ClientEvent.AccountData]
) => {
  useEffect(() => {
    mx.on(ClientEvent.AccountData, onAccountData);
    return () => {
      mx.removeListener(ClientEvent.AccountData, onAccountData);
    };
  }, [mx, onAccountData]);
};
