import React from 'react';
import PropTypes from 'prop-types';
import RoomViewContent from './RoomViewContent';
import RoomViewFloating from './RoomViewFloating';
import RoomViewInput from './RoomViewInput';
import RoomViewCmdBar from './RoomViewCmdBar';
import './RoomViewChat.scss';

function RoomViewChat({
  roomTimeline,
  eventId,
  roomId,
  viewEvent,
  hidden,
}) {
  return (
    <div className={`room-view__content-wrapper ${hidden ? 'hidden' : ''}`}>
      <div className="room-view__scrollable">
        <RoomViewContent
          eventId={eventId}
          roomTimeline={roomTimeline}
        />
        <RoomViewFloating
          roomId={roomId}
          roomTimeline={roomTimeline}
        />
      </div>
      <div className="room-view__sticky">
        <RoomViewInput
          roomId={roomId}
          roomTimeline={roomTimeline}
          viewEvent={viewEvent}
        />
        <RoomViewCmdBar
          roomId={roomId}
          roomTimeline={roomTimeline}
          viewEvent={viewEvent}
        />
      </div>
    </div>
  );
}

RoomViewChat.propTypes = {
  hidden: PropTypes.bool.isRequired,
};

export default RoomViewChat;
