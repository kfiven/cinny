// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { createContext, useContext } from 'react';
import { SpecVersions } from '../cs-api';

const SpecVersionsContext = createContext<SpecVersions | null>(null);

export const SpecVersionsProvider = SpecVersionsContext.Provider;

export function useSpecVersions(): SpecVersions {
  const versions = useContext(SpecVersionsContext);
  if (!versions) throw new Error('Server versions are not provided!');
  return versions;
}
