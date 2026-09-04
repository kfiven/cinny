// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { ReactNode } from 'react';

import { useMatrixClient } from '../../hooks/useMatrixClient';
import { useBindAtoms } from '../../state/hooks/useBindAtoms';

type ClientBindAtomsProps = {
  children: ReactNode;
};
export function ClientBindAtoms({ children }: ClientBindAtomsProps) {
  const mx = useMatrixClient();
  useBindAtoms(mx);

  return children;
}
