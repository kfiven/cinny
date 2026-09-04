// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { backupRestoreProgressAtom } from '../state/backupRestore';
import { useMatrixClient } from './useMatrixClient';
import { useKeyBackupDecryptionKeyCached } from './useKeyBackup';

export const useRestoreBackupOnVerification = () => {
  const setRestoreProgress = useSetAtom(backupRestoreProgressAtom);

  const mx = useMatrixClient();

  useKeyBackupDecryptionKeyCached(
    useCallback(() => {
      const crypto = mx.getCrypto();
      if (!crypto) return;

      crypto.restoreKeyBackup({
        progressCallback(progress) {
          setRestoreProgress(progress);
        },
      });
    }, [mx, setRestoreProgress])
  );
};
