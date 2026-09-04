// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { IRequestTokenResponse } from 'matrix-js-sdk';

export type RequestEmailTokenResponse = {
  email: string;
  clientSecret: string;
  result: IRequestTokenResponse;
};
export type RequestEmailTokenCallback = (
  email: string,
  clientSecret: string,
  nextLink?: string
) => Promise<RequestEmailTokenResponse>;
