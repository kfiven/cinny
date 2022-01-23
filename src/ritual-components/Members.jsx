import React, { useEffect, useState } from 'react';

import initMatrix from '../client/initMatrix';
import cons from '../client/state/cons';
import navigation from '../client/state/navigation';
import { selectRoom } from '../client/action/navigation';
import Postie from '../util/Postie';

import Selector from '../app/organisms/navigation/Selector';
import { AtoZ } from '../app/organisms/navigation/common';
import MembersList from './MembersList';

const drawerPostie = new Postie();

function Members() {
  const {
    roomList,
    notifications,
  } = initMatrix;

  const directIds = [...roomList.directs].sort(AtoZ);
  const expertId = localStorage.getItem('ritual_expert_uuid'); //"e40d9a38-85ad-4881-ab45-8d1c63a8c28d";
  const [, forceUpdate] = useState({});

  function selectorChanged(selectedRoomId, prevSelectedRoomId) {
    if (!drawerPostie.hasTopic('selector-change')) return;
    const addresses = [];
    if (drawerPostie.hasSubscriber('selector-change', selectedRoomId)) addresses.push(selectedRoomId);
    if (drawerPostie.hasSubscriber('selector-change', prevSelectedRoomId)) addresses.push(prevSelectedRoomId);
    if (addresses.length === 0) return;
    drawerPostie.post('selector-change', addresses, selectedRoomId);
  }

  function notiChanged(roomId, total, prevTotal) {
    if (total === prevTotal) return;
    if (drawerPostie.hasTopicAndSubscriber('unread-change', roomId)) {
      drawerPostie.post('unread-change', roomId);
    }
  }

  function roomListUpdated() {
    const {
      spaces,
      rooms,
      directs,
    } = initMatrix.roomList;

    if (!(
      spaces.has(navigation.selectedRoomId)
      || rooms.has(navigation.selectedRoomId)
      || directs.has(navigation.selectedRoomId))
    ) {
      selectRoom(null);
    }
    forceUpdate({});
  }

  useEffect(() => {
    roomList.on(cons.events.roomList.ROOMLIST_UPDATED, roomListUpdated);
    navigation.on(cons.events.navigation.ROOM_SELECTED, selectorChanged);
    notifications.on(cons.events.notifications.NOTI_CHANGED, notiChanged);
    return () => {
      roomList.removeListener(cons.events.roomList.ROOMLIST_UPDATED, roomListUpdated);
      navigation.removeListener(cons.events.navigation.ROOM_SELECTED, selectorChanged);
      notifications.removeListener(cons.events.notifications.NOTI_CHANGED, notiChanged);
    };
  }, []);

  return (
    <>
      <MembersList expertId={expertId} matrixIds={directIds} drawerPostie={drawerPostie} />
    </>
  );
}

export default Members;
