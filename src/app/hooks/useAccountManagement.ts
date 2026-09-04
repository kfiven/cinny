// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useMemo } from 'react';

export const useAccountManagementActions = () => {
  const actions = useMemo(
    () => ({
      profile: 'org.matrix.profile',
      sessionsList: 'org.matrix.sessions_list',
      sessionView: 'org.matrix.session_view',
      sessionEnd: 'org.matrix.session_end',
      accountDeactivate: 'org.matrix.account_deactivate',
      crossSigningReset: 'org.matrix.cross_signing_reset',
    }),
    []
  );

  return actions;
};
