// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useMatch, useParams } from 'react-router-dom';
import { getCanonicalAliasRoomId, isRoomAlias } from '../../utils/matrix';
import { useMatrixClient } from '../useMatrixClient';
import { getSpaceLobbyPath, getSpaceSearchPath } from '../../pages/pathUtils';

export const useSelectedSpace = (): string | undefined => {
  const mx = useMatrixClient();

  const { spaceIdOrAlias } = useParams();

  const spaceId =
    spaceIdOrAlias && isRoomAlias(spaceIdOrAlias)
      ? getCanonicalAliasRoomId(mx, spaceIdOrAlias)
      : spaceIdOrAlias;

  return spaceId;
};

export const useSpaceLobbySelected = (spaceIdOrAlias: string): boolean => {
  const match = useMatch({
    path: decodeURIComponent(getSpaceLobbyPath(spaceIdOrAlias)),
    caseSensitive: true,
    end: false,
  });

  return !!match;
};

export const useSpaceSearchSelected = (spaceIdOrAlias: string): boolean => {
  const match = useMatch({
    path: decodeURIComponent(getSpaceSearchPath(spaceIdOrAlias)),
    caseSensitive: true,
    end: false,
  });

  return !!match;
};
