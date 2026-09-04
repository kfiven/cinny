// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useSpecVersions } from './useSpecVersions';

export const useReportRoomSupported = (): boolean => {
  const { versions, unstable_features: unstableFeatures } = useSpecVersions();

  // report room is introduced in spec version 1.13
  const supported = unstableFeatures?.['org.matrix.msc4151'] || versions.includes('v1.13');

  return supported;
};
