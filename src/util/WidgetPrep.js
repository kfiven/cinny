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
 *   _urlRaw: string,
 *   url: string,
 *   creatorUserId: string,
 *   eventType: string | "im.vector.modular.widgets" | "m.widget",
 *   data: object | BigBlueButtWidgetData | null,
 *   mWidgetAdditionalData: MatrixWidget | null,
 *   id: string,
 *   roomId: string,
 * }}
 */

class RoomWidget {
  constructor(room) {
    this.room = room;
    this.matrixClient = room.client;

    this.userId = this.matrixClient.getUserId();
    this.user = this.matrixClient.getUser(this.userId);

    /**
     * @type {Widget[]}
     */
    this.widgets = [];

    this.fetchWidgetsVector();
    this.fetchWidgetsMatrix();
  }

  /**
   * @private
   * @param {string} widgetType Widget type to search for
   * @returns {{content: object, event: object}}
   */
  fetchWidgets(widgetType) {
    const widgetStateEvents = this.room.currentState.getStateEvents(widgetType);

    const tempList = [];
    widgetStateEvents.forEach((ev) => {
      const eventContent = ev.getContent();
      // Check if widget is empty (e.g. deleted)
      if (Object.entries(eventContent).length !== 0) {
        // By specification we MUST only allow "http:" and "https:" URI schemes
        // But let's only allow https for now
        if (eventContent.url?.startsWith('https://')) {
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
   * Add "m.widgets" room-based Version 2 widgets
   * @see https://docs.google.com/document/d/1uPF7XWY_dXTKVKV7jZQ2KmsI19wn9-kFRgQ1tFQP7wQ (Proposed) Version 2.0
   * @see https://github.com/matrix-org/matrix-doc/issues/1236
   * @todo keep an eye on this
   * @todo string interpolation
   */
  fetchWidgetsMatrix() {
    this.fetchWidgets('m.widgets')
      .forEach((w) => {
        this.widgets.push(this.patchWidget({
          name: w.content.name, // OPTIONAL
          type: w.content.type, // e.g. "m.grafana"
          _urlRaw: w.content.url, // Only https and ~~http~~
          url: w.content.url,
          data: w.content.data,
          eventType: w.event.type, // m.matrix
          // User's ID (should be the same as ev.event.sender)
          creatorUserId: w.content.creatorUserId,
          matrixWidgetAdditionalData: {
            waitForIframeLoad: w.content.waitForIframeLoad,
            stateKey: w.event.state_key,
          },
          id: w.event.event_id,
          roomId: w.event.room_id,
        }));
      });
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
      // Non-custom widgets require special handling
      // if (w.content.type === 'm.custom') {
      this.widgets.push(this.patchWidget({
        name: w.content.name, // OPTIONAL
        type: w.content.type,
        _urlRaw: w.content.url,
        url: w.content.url,
        data: w.content.data,
        creatorUserId: w.content.sender,
        eventType: w.event.type, // vector widgets
        id: w.event.event_id,
        roomId: w.event.room_id,
      }));
    });
  }

  /**
   * @private
   * @param {string} url Url to interpolate
   * @param {Object} custom Optional keys to interpolate
   * @returns {string}
   */
  doUrlStringInterpolation(url, custom = {}) {
    let modifiedUrl = url;
    const keys = Object.keys(custom);
    keys.forEach((key) => {
      modifiedUrl = modifiedUrl.replace(`$${key}`, custom[key]);
    });

    // Vector spec also mentions URL-individual replacements
    // Here, none are taken
    return modifiedUrl
      .replace('$matrix_user_id', this.userId)
      .replace('$matrix_room_id', this.room.name)
      .replace('$matrix_display_name', this.user.displayName)
      .replace('$matrix_avatar_url', this.user.avatarUrl);
  }

  /**
   * Patch widgets
   * @param {Widget} rawWidget
   * @returns {Widget} patched widget
   */
  patchWidget(rawWidget) {
    const widget = rawWidget;
    widget.url = this.doUrlStringInterpolation(widget.url, widget.data);

    if (widget.type === 'custom' || widget.type === 'm.custom') {
      return widget;
    }
    if (widget.type === 'jitsi' || widget.type === 'm.jitsi') {
      const oUrl = new URL(widget.url);
      widget.url = `https://${oUrl.searchParams.get('conferenceDomain') ?? 'meet.element.io'}/${oUrl.searchParams.get('confId')}#jitsi_meet_external_api_id=1&config.startAudioOnly=false&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.MAIN_TOOLBAR_BUTTONS=%5B%5D&interfaceConfig.VIDEO_LAYOUT_FIT=%22height%22&appData.localStorageContent=null`;
    }
    if (widget.type === 'etherpad' || widget.type === 'm.etherpad') {
      widget.url = `https://scalar.vector.im/etherpad/p/${widget.data.padname}?userName=${this.userId}&showControls=true&showChat=false&chatAndUsers=false&alwaysShowChat=false`;
    }

    return widget;
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
