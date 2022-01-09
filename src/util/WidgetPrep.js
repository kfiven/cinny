/**
 * Only used by matrix widgets
 * @typedef MatrixWidget
 * extends Widget
 * @type {{
 *   stateKey: string,
 *   waitForIframeLoad: bool,
 * }}
 */

/**
 * @typedef BigBlueButtWidgetData
 * @type {{curl: string, title: string}}
 */
/**
 * Common Widget type
 * Fully implemented by vector and matrix widgets
 * Keep in mind name is OPTIONAL
 * @typedef Widget
 * @type {{
 *   name: string | null,
 *   type: string | "bigbluebutton",
 *   url: string,
 *   creatorUserId: string,
 *   eventType: string | "im.vector.modular.widgets" | "m.widget",
 *   data: object | BigBlueButtWidgetData | null,
 *   mWidgetAdditionalData: MatrixWidget | null,
 * }}
 */

class RoomWidget {
  constructor(room) {
    this.room = room;
    /**
     * @type {Widget[]}
     */
    this.widgets = [];

    this.fetchWidgetsVector();
    this.fetchWidgetsMatrix();
  }

  /**
   * @private
   * Add "m.widgets" room-based Version 2 widgets
   * @see https://docs.google.com/document/d/1uPF7XWY_dXTKVKV7jZQ2KmsI19wn9-kFRgQ1tFQP7wQ (Proposed) Version 2.0
   * @see https://github.com/matrix-org/matrix-doc/issues/1236
   * @todo keep an eye on this
   * @todo string interpolation
   */
  fetchWidgetsMatrix() {
    this.fetchWidgets('m.widgets')
      .forEach((w) => {
        this.widgets.push({
          name: w.content.name, // OPTIONAL
          type: w.content.type, // e.g. "m.grafana"
          url: w.content.url, // Only https and ~~http~~
          data: w.content.data,
          eventType: w.event.type, // m.matrix
          // User's ID (should be the same as ev.event.sender)
          creatorUserId: w.content.creatorUserId,
          matrixWidgetAdditionalData: {
            waitForIframeLoad: w.content.waitForIframeLoad,
            stateKey: w.event.state_key,
          },
        });
      });
  }

  /**
   * @private
   * @param {string} widgetType Widget type to search for
   * @param {Function} howToAdd how to add the widget
   * @returns {{content: object, event: object}}
   */
  fetchWidgets(widgetType) {
    const tempList = [];
    const widgetStateEvents = this.room.currentState.getStateEvents(widgetType);

    // If there are no widgets, return
    if (widgetStateEvents && widgetStateEvents.length === 0) return tempList;

    widgetStateEvents.forEach((ev) => {
      const eventContent = ev.getContent();
      // Check if widget is empty (e.g. deleted)
      if (Object.entries(eventContent).length !== 0) {
        // By specification we MUST only allow "http:" and "https:" URI schemes
        // But let's only allow https for now
        if (eventContent.url?.startsWith('https://')
          && eventContent.data.curl?.startsWith('https://')) {
          // Now we can add them (event is in event)
          tempList.push({ content: eventContent, event: ev.event });
        } else {
          // We want to notify the advanced user about the measurement taken
          // eslint-disable-next-line no-console
          console.log('Widget not added, URI schema not allowed for security reasons', eventContent);
        }
      }
    });

    return tempList;
  }

  /**
   * @private
   * Add "im.vector.modular.widgets" widgets, riot's / element's format
   * @see https://docs.google.com/document/d/1TiWNDcEOULeRYQpkJHQDjgIW32ohIJSi5MKv9oRdzCo
   * @todo Missing url $key interpolation
   */
  fetchWidgetsVector() {
    const a = this.fetchWidgets('im.vector.modular.widgets');
    a.forEach((w) => {
      this.widgets.push({
        name: w.content.name, // OPTIONAL
        type: w.content.type,
        url: w.content.url,
        data: w.content.data,
        creatorUserId: w.content.sender,
        eventType: w.event.type, // vector widgets
      });
    });
  }

  get widgetNames() {
    const names = this.widgets.map((w) => w.name);
    // names.unshift("Chat");
    return names;
  }

  widgetByName(name) {
    return this.widgets.find((w) => w.name === name);
  }
}

export default RoomWidget;
