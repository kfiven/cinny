import React, { useState } from 'react';
import settings from '../../../client/state/settings';
import Toggle from '../../atoms/button/Toggle';
import Text from '../../atoms/text/Text';
import './ManageWidgetPrivacy.scss';

function ManageWidgetPrivacy() {
  const [, updateState] = useState({});

  const a = settings.getWidgetUrlPrivacySettings ?? [];
  // a.push({ domain: 'scalar.vector.im', isAllowed: true });

  if (!a) return <>None known yet</>;

  return (
    <div className="manage-widget-privacy-content">
      <span />
      {a.length === 0
        ? (
          <Text>None known yet</Text>
        )
        : a.map((item) => (
          <div key={item.domain} className="manage-widget-privacy-content-item">
            <Toggle
              isActive={item.isAllowed}
              onToggle={() => {
                settings.setWidgetUrlPrivacySetting(item.domain, !item.isAllowed);
                updateState({});
              }}
            />
            <span />
            <Text>{item.domain}</Text>
          </div>
        ))}
    </div>
  );
}

export default ManageWidgetPrivacy;
