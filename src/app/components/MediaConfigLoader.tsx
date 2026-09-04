// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { ReactNode, useCallback, useEffect } from 'react';
import { AsyncStatus, useAsyncCallback } from '../hooks/useAsyncCallback';
import { useMatrixClient } from '../hooks/useMatrixClient';
import { MediaConfig } from '../hooks/useMediaConfig';

type MediaConfigLoaderProps = {
  children: (mediaConfig: MediaConfig | undefined) => ReactNode;
};
export function MediaConfigLoader({ children }: MediaConfigLoaderProps) {
  const mx = useMatrixClient();

  const [state, load] = useAsyncCallback(useCallback(() => mx.getMediaConfig(), [mx]));

  useEffect(() => {
    load();
  }, [load]);

  return children(state.status === AsyncStatus.Success ? state.data : undefined);
}
