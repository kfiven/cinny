import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './RoomView.scss';

import EventEmitter from 'events';

import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import RoomTimelineType from '../../../client/state/RoomTimeline';
import TabView from '../../molecules/tab-view/TabView';

import RoomViewHeader from './RoomViewHeader';
import RoomViewChat from './RoomViewChat';
import RoomWidget from '../../../util/WidgetPrep';
import settings from '../../../client/state/settings';
import Button from '../../atoms/button/Button';
import Text from '../../atoms/text/Text';
import IconButton from '../../atoms/button/IconButton';
import ExternalIC from '../../../../public/res/ic/outlined/external.svg';

const chatString = 'Chat';
const viewEvent = new EventEmitter();

function RoomView({ roomTimeline, eventId }) {
  // used to reload the component
  const [, updateState] = React.useState({});

  /**
   * @type {[RoomWidget, Function]} List of Widgets
   */
  const [widgetClass, setWidgetClass] = React.useState(null);
  /**
   * @type {[string | null, Function]}
   */
  const [activeTab, setActiveTab] = React.useState(chatString);

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

  // For room widgets on room change
  useEffect(() => {
    setWidgetClass(new RoomWidget(roomTimeline.room)); // Needs to be done on room change
    setActiveTab(chatString); // Reset to Chat tab
  }, [roomTimeline]);

  let currentWidget = null;
  // Get Iframe if a widget is selected
  function getIframe() {
    if (activeTab === chatString) return (<></>);
    if (widgetClass.widgets.length === 0) return (<></>);

    const widget = widgetClass.widgetByName(activeTab);

    const domain = (new URL(widget.url)).hostname;
    const isAllowed = settings.getWidgetUrlPrivacySetting(domain) ?? false;

    if (isAllowed !== true) {
      return (
        <div className="widget-blocked">
          <Text>Widget is not yet in your list of trusted domains</Text>
          <Button
            variant="primary"
            onClick={() => {
              settings.setWidgetUrlPrivacySetting((new URL(widget.url).hostname), true);
              updateState({}); // Reload component
            }}
          >
            Allow
          </Button>
        </div>
      );
    }

    currentWidget = widget;

    return (
      <iframe
        className="widget-iframe"
        src={widget.url}
        title={`Widget: ${widget.name}`}
      />
    );
  }

  return (
    <div className="room-view" ref={roomViewRef}>
      <RoomViewHeader roomId={roomId} />
      <span>
        {widgetClass
          && widgetClass.widgetNames
          && widgetClass.widgetNames.length !== 0
          && activeTab
          && (
            <div className="room-widget-tab">
              <TabView
                activeTab={activeTab}
                tabs={[chatString, ...widgetClass.widgetNames]}
                onChange={(tab) => {
                  setActiveTab(tab);
                }}
              />
              <IconButton
                disabled={activeTab === chatString}
                tooltip={activeTab === chatString
                  ? 'The chat cannot be popped out'
                  : 'Popout current widget'}
                src={ExternalIC}
                size="extra-small"
                onClick={() => {
                  window.open(currentWidget.url, currentWidget.name, 'width=800,height=600');
                  setActiveTab(chatString);
                }}
              />
            </div>
          )}
      </span>
      <RoomViewChat
        classList="room-view__content-wrapper"
        roomTimeline={roomTimeline}
        eventId={eventId}
        roomId={roomId}
        viewEvent={viewEvent}
        hidden={Boolean(activeTab && activeTab !== chatString)}
      />
      {getIframe()}
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
