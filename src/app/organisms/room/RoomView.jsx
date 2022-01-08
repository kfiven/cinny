import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './RoomView.scss';

import EventEmitter from 'events';

import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import RoomTimelineType from '../../../client/state/RoomTimeline';

import RoomViewHeader from './RoomViewHeader';
import RoomViewContent from './RoomViewContent';
import RoomViewFloating from './RoomViewFloating';
import RoomViewInput from './RoomViewInput';
import RoomViewCmdBar from './RoomViewCmdBar';
import RoomViewChat from './RoomViewChat';
import RoomViewWidgets from "./RoomViewWidgets";

const chatString = 'Chat';
const viewEvent = new EventEmitter();

function RoomView({ roomTimeline, eventId }) {
  /**
   * @typedef Widget
   * @type {{name: string, type: string, data: object}}
    */
  /**
   * @type {Widget[]} List of Widgets
   */
  const widgets = [];
  /**
   * @type {[string[], Function]}
   */
  const [tabs, setTabs] = React.useState(null);
  /**
   * @type {[string | null, Function]}
   */
  const [activeTab, setActiveTab] = React.useState(null);

  const roomViewRef = useRef(null);
  // eslint-disable-next-line react/prop-types
  const { roomId } = roomTimeline;

  useEffect(() => {
    const settingsToggle = (isVisible) => {
      const roomView = roomViewRef.current;
      roomView.classList.toggle('room-view--dropped');

      const roomViewContent = roomView.children[2];
      if (isVisible) {
        setTimeout(() => {
          if (!navigation.isRoomSettings) return;
          roomViewContent.style.visibility = 'hidden';
        }, 200);
      } else roomViewContent.style.visibility = 'visible';
    };
    navigation.on(cons.events.navigation.ROOM_SETTINGS_TOGGLED, settingsToggle);
    return () => {
      navigation.removeListener(cons.events.navigation.ROOM_SETTINGS_TOGGLED, settingsToggle);
    };
  }, []);

  useEffect(() => {
    /**
     * @type {MatrixEvent[]}
     */
    const widgetStateEvents = roomTimeline.room.currentState.getStateEvents('im.vector.modular.widgets');

    if (tabs) return null;
    if (widgetStateEvents && widgetStateEvents.length === 0) return null;

    widgetStateEvents.forEach((ev) => {
      const eventContent = ev.getContent();
      // Check if widget is empty
      if (Object.entries(eventContent).length !== 0) widgets.push(eventContent);
    });

    if (widgets.length === 0) return null;

    const tabNames = [chatString];
    widgets.forEach((w) => tabNames.push(w.name));
    setActiveTab(chatString);
    setTabs(tabNames);

    return () => {
      setTabs(null);
      setActiveTab(null);
      widgets.length = 0;
    };
  }, [roomTimeline]);

  return (
    <div className="room-view" ref={roomViewRef}>
      <RoomViewHeader roomId={roomId} />
      <span>
        {tabs && activeTab && (
          <RoomViewWidgets
            roomId={roomId}
            onChange={(tab) => setActiveTab(tab ?? chatString)}
          />
        )}
      </span>
      <RoomViewChat
        roomTimeline={roomTimeline}
        eventId={eventId}
        roomId={roomId}
        viewEvent={viewEvent}
        hidden={Boolean(activeTab && activeTab !== chatString)}
      />
    </div>
  );
}

RoomView.defaultProps = {
  eventId: null,
};
RoomView.propTypes = {
  roomTimeline: PropTypes.instanceOf(RoomTimelineType).isRequired,
  eventId: PropTypes.string,
};

export default RoomView;
