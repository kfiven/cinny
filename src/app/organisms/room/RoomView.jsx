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

const chatString = 'Chat';
const viewEvent = new EventEmitter();

function RoomView({ roomTimeline, eventId }) {
  /**
   * @typedef Widget
   * @type {{name: string, type: string, data: object | BigBlueButtWidgetData}}
    */
  /**
   * @typedef BigBlueButtWidgetData
   * @type {{curl: string, title: string}}
   */
  /**
   * @type {[Widget[], Function]} List of Widgets
   */
  // const [widgetList, setWidgetList] = React.useState(null);
  const [widgetClass, setWidgetClass] = React.useState(null);
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
    const widgets = new RoomWidget(roomTimeline.room);
    const widgetsObj = widgets.widgets;
    // setWidgetList(widgetsObj);
    setWidgetClass(widgets);

    // If no real widgets, return
    if (widgetsObj.length === 0) return null;

    // Create a list of tabs, incl. the chat tab

    const tabNames = widgets.widgetNames;
    tabNames.unshift(chatString);
    setActiveTab(chatString);
    setTabs(tabNames);

    return null;
  }, [roomTimeline]);

  function getIframe() {
    if (!activeTab || activeTab === chatString) return (<></>);
    if (widgetClass.widgets.length === 0) return (<></>);

    const widget = widgetClass.widgetByName(activeTab);
    console.log(widget);

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
        {tabs && activeTab && (
          <TabView
            activeTab={activeTab}
            tabs={tabs}
            onChange={(tab) => {
              setActiveTab(tab);
              console.log('tab:', tab);
            }}
          />
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
