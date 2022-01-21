import React from 'react';
import './Welcome.scss';

import Text from '../../atoms/text/Text';

import RitualSvg from '../../../../public/res/svg/ritual.svg';

function Welcome() {
  return (
    <div className="app-welcome flex--center">
      <div>
        <img className="app-welcome__logo noselect" src={RitualSvg} alt="Ritual logo" />
        <Text className="app-welcome__heading" variant="h1" weight="medium" primary>RitualX</Text>
        <Text className="app-welcome__subheading" variant="s1">Your home to your relationship</Text>
      </div>
    </div>
  );
}

export default Welcome;
