// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { keyframes, style } from '@vanilla-extract/css';
import { DefaultReset, color, config } from 'folds';

const SlideUpAnime = keyframes({
  from: {
    transform: 'translateY(100%)',
  },
  to: {
    transform: 'translateY(0)',
  },
});

export const RoomViewTyping = style([
  DefaultReset,
  {
    padding: `0 ${config.space.S500}`,
    width: '100%',
    backgroundColor: color.Surface.Container,
    color: color.Surface.OnContainer,
    position: 'absolute',
    bottom: 0,
    animation: `${SlideUpAnime} 100ms ease-in-out`,
  },
]);
export const TypingText = style({
  flexGrow: 1,
});
