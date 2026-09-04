// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { ReactNode } from 'react';
import { CryptoApi } from 'matrix-js-sdk/lib/crypto-api';
import {
  useDeviceVerificationStatus,
  VerificationStatus,
} from '../hooks/useDeviceVerificationStatus';

type DeviceVerificationStatusProps = {
  crypto?: CryptoApi;
  userId: string;
  deviceId: string;
  children: (verificationStatus: VerificationStatus) => ReactNode;
};

export function DeviceVerificationStatus({
  crypto,
  userId,
  deviceId,
  children,
}: DeviceVerificationStatusProps) {
  const status = useDeviceVerificationStatus(crypto, userId, deviceId);

  return children(status);
}
