// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { style } from '@vanilla-extract/css';
import { config, toRem } from 'folds';

export const ReplyBend = style({
  flexShrink: 0,
});

export const ThreadIndicator = style({
  opacity: config.opacity.P300,

  selectors: {
    'button&': {
      cursor: 'pointer',
    },
    ':hover&': {
      opacity: config.opacity.P500,
    },
  },
});

export const Reply = style({
  marginBottom: toRem(1),
  minWidth: 0,
  maxWidth: '100%',
  minHeight: config.lineHeight.T300,
  selectors: {
    'button&': {
      cursor: 'pointer',
    },
  },
});

export const ReplyContent = style({
  opacity: config.opacity.P300,

  selectors: {
    [`${Reply}:hover &`]: {
      opacity: config.opacity.P500,
    },
  },
});
