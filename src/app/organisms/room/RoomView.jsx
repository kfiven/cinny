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
import RoomViewWidget from './RoomViewWidget';

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
  const [widgetList, setWidgetList] = React.useState(null);
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
     * Get the list of widgets
     * @type {MatrixEvent[]}
     */
    const widgetStateEvents = roomTimeline.room.currentState.getStateEvents('im.vector.modular.widgets');

    // Should not happen
    if (tabs) return null;
    // If there are no widgets, return
    if (widgetStateEvents && widgetStateEvents.length === 0) return null;

    // Create a nice list of Widgets
    const widgets = [];
    widgetStateEvents.forEach((ev) => {
      const eventContent = ev.getContent();
      // Check if widget is empty (e.g. deleted)
      if (Object.entries(eventContent).length !== 0) {
        // We only want the widgets to be https
        if (eventContent.url?.startsWith('https://')
          && eventContent.data.curl?.startsWith('https://')) widgets.push(eventContent);
        else console.log('Widget is not https:', eventContent);
      }
    });
    setWidgetList(widgets);

    // If no real widgets, return
    if (widgets.length === 0) return null;

    // Create a list of tabs, incl. the chat tab
    const tabNames = [chatString];
    widgets.forEach((w) => tabNames.push(w.name));
    setActiveTab(chatString);
    setTabs(tabNames);

    return null;
    // return () => {
    //   setTabs(null);
    //   setActiveTab(null);
    //   widgets.length = 0;
    // };
  }, [roomTimeline]);

  function getIframe() {
    if (!activeTab || activeTab === chatString) return (<></>);
    if (!widgetList) return (<></>);
    const widget = widgetList.find((w) => w.name === activeTab);
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
              // console.log('widgets', widgets);
              // console.log('found:', widgets.find((w) => w.name === tab));
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
