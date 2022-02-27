import React, { useState, useEffect } from 'react';
import './Room.scss';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import settings from '../../../client/state/settings';
import RoomTimeline from '../../../client/state/RoomTimeline';

import Welcome from '../welcome/Welcome';
import RoomView from './RoomView';
import RoomSettings from './RoomSettings';
import PeopleDrawer from './PeopleDrawer';

function Room() {
  const [roomTimeline, setRoomTimeline] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [isDrawer, setIsDrawer] = useState(settings.isPeopleDrawer);

  const mx = initMatrix.matrixClient;
  const handleRoomSelected = (rId, pRoomId, eId) => {
    if (mx.getRoom(rId)) {
      setRoomTimeline(new RoomTimeline(rId, initMatrix.notifications));
      setEventId(eId);
    } else {
      // TODO: add ability to join room if roomId is invalid
      setRoomTimeline(null);
      setEventId(null);
    }
  };
  const handleDrawerToggling = (visiblity) => setIsDrawer(visiblity);
  useEffect(() => {
    navigation.on(cons.events.navigation.ROOM_SELECTED, handleRoomSelected);
    settings.on(cons.events.settings.PEOPLE_DRAWER_TOGGLED, handleDrawerToggling);
    return () => {
      navigation.removeListener(cons.events.navigation.ROOM_SELECTED, handleRoomSelected);
      settings.removeListener(cons.events.settings.PEOPLE_DRAWER_TOGGLED, handleDrawerToggling);
      roomTimeline?.removeInternalListeners();
    };
  }, []);

  if (roomTimeline === null) return <Welcome />;

  /* on first load we need to check the visibility of the people drawer */
  if (window.localStorage.getItem('drawers') === 'false') {
    // hide .navigation__wrapper if people drawer is hidden (it's not a bug, it's a feature)
    document.querySelector('.navigation__wrapper').style.display = 'none';
    // this creates a kinda "zen" mode where the room view is the only thing visible
  } else {
     document.querySelector('.navigation__wrapper').style.display = 'block';
  }

  return (
    <div className="room">
      <div className="room__content">
        <RoomSettings roomId={roomTimeline.roomId} />
        <RoomView roomTimeline={roomTimeline} eventId={eventId} />
      </div>
      { isDrawer && <PeopleDrawer roomId={roomTimeline.roomId} />}
    </div>
  );
}

export default Room;
