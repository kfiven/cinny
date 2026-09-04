// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

export class CallControlState {
  public readonly microphone: boolean;

  public readonly video: boolean;

  public readonly sound: boolean;

  constructor(microphone: boolean, video: boolean, sound: boolean) {
    this.microphone = microphone;
    this.video = video;
    this.sound = sound;
  }
}
