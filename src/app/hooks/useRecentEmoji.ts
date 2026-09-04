// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useEffect, useState } from 'react';
import { ClientEvent, MatrixClient, MatrixEvent } from 'matrix-js-sdk';
import { getRecentEmojis } from '../plugins/recent-emoji';
import { AccountDataEvent } from '../../types/matrix/accountData';
import { IEmoji } from '../plugins/emoji';

export const useRecentEmoji = (mx: MatrixClient, limit?: number): IEmoji[] => {
  const [recentEmoji, setRecentEmoji] = useState(() => getRecentEmojis(mx, limit));

  useEffect(() => {
    const handleAccountData = (event: MatrixEvent) => {
      if (event.getType() !== AccountDataEvent.ElementRecentEmoji) return;
      setRecentEmoji(getRecentEmojis(mx, limit));
    };

    mx.on(ClientEvent.AccountData, handleAccountData);
    return () => {
      mx.removeListener(ClientEvent.AccountData, handleAccountData);
    };
  }, [mx, limit]);

  return recentEmoji;
};
