// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

export type DisposeCallback<DisposeArgs extends unknown[] = [], DisposeReturn = void> = (
  ...args: DisposeArgs
) => DisposeReturn;
export type DisposableContext<
  DisposableArgs extends unknown[] = [],
  DisposeArgs extends unknown[] = [],
  DisposeReturn = void
> = (...args: DisposableArgs) => DisposeCallback<DisposeArgs, DisposeReturn>;

export const disposable = <
  DisposableArgs extends unknown[],
  DisposeArgs extends unknown[] = [],
  DisposeReturn = void
>(
  context: DisposableContext<DisposableArgs, DisposeArgs, DisposeReturn>
) => context;
