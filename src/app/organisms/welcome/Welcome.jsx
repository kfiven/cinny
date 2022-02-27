import React from 'react';
import './Welcome.scss';

import Text from '../../atoms/text/Text';

import CinnySvg from '../../../../public/res/svg/cinny.svg';

import { selectRoom } from '../../../client/action/navigation';

function Welcome() {
  if (window.localStorage.getItem('currentRoomId') !== null) {
    setTimeout(() => {
      selectRoom(window.localStorage.getItem('currentRoomId'));
    }, 500);

    /* return opening screen */
    return (
    <div className="app-welcome flex--center">
      <div>
        <Text className="app-welcome__heading" variant="h1" weight="medium" primary>Opening Room</Text>
        <Text className="app-welcome__subheading" variant="s1">Loading your previous room...</Text>
      </div>
    </div>
    );
  }

  /* return the welcome screen */
  return (
    <div className="app-welcome flex--center">
      <div>
        <img className="app-welcome__logo noselect" src={CinnySvg} alt="Cinny logo" />
        <Text className="app-welcome__heading" variant="h1" weight="medium" primary>Welcome to Cinny</Text>
        <Text className="app-welcome__subheading" variant="s1">Yet another matrix client</Text>
      </div>
    </div>
  );
}

export default Welcome;
