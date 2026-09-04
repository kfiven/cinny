// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import {
  AccountDataEvent,
  SecretStorageDefaultKeyContent,
  SecretStorageKeyContent,
} from '../../types/matrix/accountData';
import { useAccountData } from './useAccountData';

export const getSecretStorageKeyEventType = (key: string): string => `m.secret_storage.key.${key}`;

export const useSecretStorageDefaultKeyId = (): string | undefined => {
  const defaultKeyEvent = useAccountData(AccountDataEvent.SecretStorageDefaultKey);
  const defaultKeyId = defaultKeyEvent?.getContent<SecretStorageDefaultKeyContent>().key;

  return defaultKeyId;
};

export const useSecretStorageKeyContent = (keyId: string): SecretStorageKeyContent | undefined => {
  const keyEvent = useAccountData(getSecretStorageKeyEventType(keyId));
  const secretStorageKey = keyEvent?.getContent<SecretStorageKeyContent>();

  return secretStorageKey;
};
