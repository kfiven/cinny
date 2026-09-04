// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { AccountDataEvent, SecretAccountData } from '../../types/matrix/accountData';
import { useAccountData } from './useAccountData';

export const useCrossSigningActive = (): boolean => {
  const masterEvent = useAccountData(AccountDataEvent.CrossSigningMaster);
  const content = masterEvent?.getContent<SecretAccountData>();

  return !!content;
};
