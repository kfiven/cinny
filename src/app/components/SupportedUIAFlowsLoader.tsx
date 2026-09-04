// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { ReactNode } from 'react';
import { UIAFlow } from 'matrix-js-sdk';
import { useSupportedUIAFlows } from '../hooks/useUIAFlows';

export function SupportedUIAFlowsLoader({
  flows,
  supportedStages,
  children,
}: {
  supportedStages: string[];
  flows: UIAFlow[];
  children: (supportedFlows: UIAFlow[]) => ReactNode;
}) {
  const supportedFlows = useSupportedUIAFlows(flows, supportedStages);

  return children(supportedFlows);
}
