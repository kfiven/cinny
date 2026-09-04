// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import to from 'await-to-js';
import { AuthDict, IAuthData, MatrixClient, MatrixError } from 'matrix-js-sdk';

export type ResetPasswordResponse = Record<string, never>;
export type ResetPasswordResult = [IAuthData, undefined] | [undefined, ResetPasswordResponse];
export const resetPassword = async (
  mx: MatrixClient,
  authDict: AuthDict,
  newPassword: string
): Promise<ResetPasswordResult> => {
  const [err, res] = await to<ResetPasswordResponse, MatrixError>(
    mx.setPassword(authDict, newPassword, false)
  );

  if (err) {
    if (err.httpStatus === 401) {
      const authData = err.data as IAuthData;
      return [authData, undefined];
    }
    throw err;
  }
  return [undefined, res];
};
