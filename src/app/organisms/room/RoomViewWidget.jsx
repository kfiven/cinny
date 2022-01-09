import React from 'react';
import PropTypes from 'prop-types';

function RoomViewWidget({ widget }) {
  console.log(widget);
  return ( <></>
  );
}

RoomViewWidget.propTypes = {
  widget: PropTypes.object.isRequired,
};

export default RoomViewWidget;
