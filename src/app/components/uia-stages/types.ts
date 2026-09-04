// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { AuthDict } from 'matrix-js-sdk';
import { AuthStageData } from '../../hooks/useUIAFlows';

export type StageComponentProps = {
  stageData: AuthStageData;
  submitAuthDict: (authDict: AuthDict) => void;
  onCancel: () => void;
};
