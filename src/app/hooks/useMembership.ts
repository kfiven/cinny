// Cinny Project
// Copyright (c) 2021-2026 Ajay Bura
// SPDX-License-Identifier: AGPL-3.0-only
// https://cinny.in

import { useEffect, useState } from 'react';
import { Room, RoomMemberEvent, RoomMemberEventHandlerMap } from 'matrix-js-sdk';
import { Membership } from '../../types/matrix/room';

export const useMembership = (room: Room, userId: string): Membership => {
  const member = room.getMember(userId);

  const [membership, setMembership] = useState<Membership>(
    () => (member?.membership as Membership | undefined) ?? Membership.Leave
  );

  useEffect(() => {
    const handleMembershipChange: RoomMemberEventHandlerMap[RoomMemberEvent.Membership] = (
      event,
      m
    ) => {
      if (event.getRoomId() === room.roomId && m.userId === userId) {
        setMembership((m.membership as Membership | undefined) ?? Membership.Leave);
      }
    };
    member?.on(RoomMemberEvent.Membership, handleMembershipChange);
    return () => {
      member?.removeListener(RoomMemberEvent.Membership, handleMembershipChange);
    };
  }, [room, member, userId]);

  return membership;
};
