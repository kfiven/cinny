// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { CryptoApi } from 'matrix-js-sdk/lib/crypto-api';

export const verifiedDevice = async (
  api: CryptoApi,
  userId: string,
  deviceId: string
): Promise<boolean | null> => {
  const status = await api.getDeviceVerificationStatus(userId, deviceId);

  if (!status) return null;

  const verified = status.crossSigningVerified;
  return verified;
};
