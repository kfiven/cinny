// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useMemo } from 'react';
import { useAccountData } from './useAccountData';
import { AccountDataEvent } from '../../types/matrix/accountData';

export type IgnoredUserListContent = {
  ignored_users?: Record<string, object>;
};

export const useIgnoredUsers = (): string[] => {
  const ignoredUserListEvt = useAccountData(AccountDataEvent.IgnoredUserList);
  const ignoredUsers = useMemo(() => {
    const ignoredUsersRecord =
      ignoredUserListEvt?.getContent<IgnoredUserListContent>().ignored_users ?? {};
    return Object.keys(ignoredUsersRecord);
  }, [ignoredUserListEvt]);

  return ignoredUsers;
};
