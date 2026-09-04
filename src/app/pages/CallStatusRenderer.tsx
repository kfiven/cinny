// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import React from 'react';
import { useCallEmbed } from '../hooks/useCallEmbed';
import { CallStatus } from '../features/call-status';

export function CallStatusRenderer() {
  const callEmbed = useCallEmbed();

  if (!callEmbed) return null;

  return <CallStatus callEmbed={callEmbed} />;
}
