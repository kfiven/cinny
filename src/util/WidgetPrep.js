/* eslint-disable class-methods-use-this */
/**
 * @typedef BigBlueButtWidgetData
 * @type {{curl: string, title: string}}
 */
/**
 * @typedef Widget
 * @type {{name: string, type: string, data: object | BigBlueButtWidgetData}}
  */

class RoomWidget {
  constructor(room) {
    this.room = room;
    /**
     * @type {Widget[]}
     */
    this.widgets = [];

    this.getWidgetsVector();
  }

  getWidgetsVector() {
    /**
     * Get the list of widgets
     * @type {MatrixEvent[]}
     */
    // eslint-disable-next-line no-undef
    const widgetStateEvents = this.room.currentState.getStateEvents('im.vector.modular.widgets');

    // If there are no widgets, return
    if (widgetStateEvents && widgetStateEvents.length === 0) return null;

    // Create a nice list of Widgets
    widgetStateEvents.forEach((ev) => {
      const eventContent = ev.getContent();

      // We only want the widgets to be https
      if (eventContent.url?.startsWith('https://')
         && eventContent.data.curl?.startsWith('https://')) {
        // Check if widget is empty (e.g. deleted)
        if (Object.entries(eventContent).length !== 0) {
          this.widgets.push({
            name: eventContent.name,
            type: eventContent.type,
            url: eventContent.url,
            data: eventContent.data,
            sender: ev.event.sender,
            eventType: ev.event.type, // vector widgets
          });
        }
      } else console.log('Widget is not https, skipping:', eventContent);
    });
    return null;
  }

  get widgetNames() {
    return this.widgets.map((w) => w.name);
  }

  widgetByName(name) {
    return this.widgets.find((w) => w.name === name);
  }
}

export default RoomWidget;
