// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { UAParser } from 'ua-parser-js';

export const ua = () => UAParser(window.navigator.userAgent);

export const isMacOS = () => ua().os.name === 'Mac OS';

export const mobileOrTablet = (): boolean => {
  const userAgent = ua();
  const { os, device } = userAgent;
  if (device.type === 'mobile' || device.type === 'tablet') return true;
  if (os.name === 'Android' || os.name === 'iOS') return true;
  return false;
};
