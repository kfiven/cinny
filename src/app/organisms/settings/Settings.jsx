import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Settings.scss';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import settings from '../../../client/state/settings';
import {
  toggleSystemTheme, toggleMarkdown, toggleMembershipEvents, toggleNickAvatarEvents,
  toggleNotifications,
} from '../../../client/action/settings';
import logout from '../../../client/action/logout';
import { usePermission } from '../../hooks/usePermission';

import Text from '../../atoms/text/Text';
import Chip from '../../atoms/chip/Chip';
import IconButton from '../../atoms/button/IconButton';
import Button from '../../atoms/button/Button';
import Toggle from '../../atoms/button/Toggle';
import SegmentedControls from '../../atoms/segmented-controls/SegmentedControls';

import PopupWindow, { PWContentSelector } from '../../molecules/popup-window/PopupWindow';
import SettingTile from '../../molecules/setting-tile/SettingTile';
import ImportE2ERoomKeys from '../../molecules/import-export-e2e-room-keys/ImportE2ERoomKeys';
import ExportE2ERoomKeys from '../../molecules/import-export-e2e-room-keys/ExportE2ERoomKeys';

import ProfileEditor from '../profile-editor/ProfileEditor';

import SettingsIC from '../../../../public/res/ic/outlined/settings.svg';
import SunIC from '../../../../public/res/ic/outlined/sun.svg';
import LockIC from '../../../../public/res/ic/outlined/lock.svg';
import BellIC from '../../../../public/res/ic/outlined/bell.svg';
import InfoIC from '../../../../public/res/ic/outlined/info.svg';
import PowerIC from '../../../../public/res/ic/outlined/power.svg';
import CrossIC from '../../../../public/res/ic/outlined/cross.svg';
import ShieldEmptyIC from '../../../../public/res/ic/outlined/shield-empty.svg';

import CinnySVG from '../../../../public/res/svg/cinny.svg';

function GeneralSection() {
  const userId = initMatrix.matrixClient.getUserId();

  const [devices, setDevices] = useState(null);
  const mx = initMatrix.matrixClient;

  useEffect(() => {
    let isUnmounted = false;

    async function loadDevices() {
      try {
        await mx.downloadKeys([userId], true);
        const myDevices = mx.getStoredDevicesForUser(userId);

        if (isUnmounted) return;
        setDevices(myDevices);
      } catch {
        setDevices([]);
      }
    }
    loadDevices();

    return () => {
      isUnmounted = true;
    };
  }, [userId]);

  return (
    <div className="settings-content">
      <SettingTile
        title=""
        content={(
          <ProfileEditor userId={initMatrix.matrixClient.getUserId()} />
        )}
      />

      <SettingTile
        title="My Sessions"
        content={(
          <div className="session-info__chips">
            {devices === null && <Text variant="b2">Loading sessions...</Text>}
            {devices?.length === 0 && <Text variant="b2">No session found.</Text>}
            {devices !== null && (devices.map((device) => (
              <Chip
                key={device.deviceId}
                iconSrc={ShieldEmptyIC}
                text={device.getDisplayName() || device.deviceId}
              />
            )))}
          </div>
        )}
      />
    </div>
  );
}

function AppearanceSection() {
  const [, updateState] = useState({});

  return (
    <div className="settings-content">
      <SettingTile
        title="Follow system theme"
        options={(
          <Toggle
            isActive={settings.useSystemTheme}
            onToggle={() => { toggleSystemTheme(); updateState({}); }}
          />
        )}
        content={<Text variant="b3">Use light or dark mode based on the system&apos;s settings.</Text>}
      />
      {(() => {
        if (!settings.useSystemTheme) {
          return (
            <SettingTile
              title="Theme"
              content={(
                <SegmentedControls
                  selected={settings.getThemeIndex()}
                  segments={[
                    { text: 'Light' },
                    { text: 'Silver' },
                    { text: 'Dark' },
                    { text: 'Butter' },
                  ]}
                  onSelect={(index) => settings.setTheme(index)}
                />
            )}
            />
          );
        }

        return null;
      })()}
      <SettingTile
        title="Markdown formatting"
        options={(
          <Toggle
            isActive={settings.isMarkdown}
            onToggle={() => { toggleMarkdown(); updateState({}); }}
          />
        )}
        content={<Text variant="b3">Format messages with markdown syntax before sending.</Text>}
      />
      <SettingTile
        title="Hide membership events"
        options={(
          <Toggle
            isActive={settings.hideMembershipEvents}
            onToggle={() => { toggleMembershipEvents(); updateState({}); }}
          />
        )}
        content={<Text variant="b3">Hide membership change messages from room timeline. (Join, Leave, Invite, Kick and Ban)</Text>}
      />
      <SettingTile
        title="Hide nick/avatar events"
        options={(
          <Toggle
            isActive={settings.hideNickAvatarEvents}
            onToggle={() => { toggleNickAvatarEvents(); updateState({}); }}
          />
        )}
        content={<Text variant="b3">Hide nick and avatar change messages from room timeline.</Text>}
      />
    </div>
  );
}

function NotificationsSection() {
  const [permission, setPermission] = usePermission('notifications', window.Notification?.permission);

  const [, updateState] = useState({});

  const renderOptions = () => {
    if (window.Notification === undefined) {
      return <Text className="set-notifications__not-supported">Not supported in this browser.</Text>;
    }

    if (permission === 'granted') {
      return (
        <Toggle
          isActive={settings._showNotifications}
          onToggle={() => {
            toggleNotifications();
            setPermission(window.Notification?.permission);
            updateState({});
          }}
        />
      );
    }

    return (
      <Button
        variant="primary"
        onClick={() => window.Notification.requestPermission().then(setPermission)}
      >
        Request permission
      </Button>
    );
  };

  return (
    <div className="set-notifications settings-content">
      <SettingTile
        title="Show desktop notifications"
        options={renderOptions()}
        content={<Text variant="b3">Show notifications when new messages arrive.</Text>}
      />
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="set-security settings-content">
      <SettingTile
        title={`Device ID: ${initMatrix.matrixClient.getDeviceId()}`}
      />
      <SettingTile
        title={`Device key: ${initMatrix.matrixClient.getDeviceEd25519Key().match(/.{1,4}/g).join(' ')}`}
        content={<Text variant="b3">Use this device ID-key combo to verify or manage this session from Element client.</Text>}
      />
      <SettingTile
        title="Export E2E room keys"
        content={(
          <>
            <Text variant="b3">Export end-to-end encryption room keys to decrypt old messages in other session. In order to encrypt keys you need to set a password, which will be used while importing.</Text>
            <ExportE2ERoomKeys />
          </>
        )}
      />
      <SettingTile
        title="Import E2E room keys"
        content={(
          <>
            <Text variant="b3">{'To decrypt older messages, Export E2EE room keys from Element (Settings > Security & Privacy > Encryption > Cryptography) and import them here. Imported keys are encrypted so you\'ll have to enter the password you set in order to decrypt it.'}</Text>
            <ImportE2ERoomKeys />
          </>
        )}
      />
    </div>
  );
}

function AboutSection() {
  return (
    <div className="settings-content set__about">
      <div className="set-about__branding">
        <img width="60" height="60" src={CinnySVG} alt="Cinny logo" />
        <div>
          <Text variant="h2" weight="medium">
            Cinny
            <span className="text text-b3" style={{ margin: '0 var(--sp-extra-tight)' }}>{`v${cons.version}`}</span>
          </Text>
          <Text>Yet another matrix client</Text>

          <div className="set-about__btns">
            <Button onClick={() => window.open('https://github.com/ajbura/cinny')}>Source code</Button>
            <Button onClick={() => window.open('https://cinny.in/#sponsor')}>Support</Button>
          </div>
        </div>
      </div>
      <div className="set-about__credits">
        <Text variant="s1" weight="medium">Credits</Text>
        <ul>
          <li>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */ }
            <Text>The <a href="https://github.com/matrix-org/matrix-js-sdk" rel="noreferrer noopener" target="_blank">matrix-js-sdk</a> is © <a href="https://matrix.org/foundation" rel="noreferrer noopener" target="_blank">The Matrix.org Foundation C.I.C</a> used under the terms of <a href="http://www.apache.org/licenses/LICENSE-2.0" rel="noreferrer noopener" target="_blank">Apache 2.0</a>.</Text>
          </li>
          <li>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */ }
            <Text>The <a href="https://twemoji.twitter.com" target="_blank" rel="noreferrer noopener">Twemoji</a> emoji art is © <a href="https://twemoji.twitter.com" target="_blank" rel="noreferrer noopener">Twitter, Inc and other contributors</a> used under the terms of <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer noopener">CC-BY 4.0</a>.</Text>
          </li>
          <li>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */ }
            <Text>The <a href="https://cinny.in/" target="_blank" rel="noreferrer noopener">Cinny</a> client is © <a href="https://github.com/ajbura/cinny/graphs/contributors" target="_blank" rel="noreferrer noopener">Ajay Bura (ajbura) and other contributors</a> used under the terms of the <a href="https://github.com/ajbura/cinny/blob/dev/LICENSE" target="_blank" rel="noreferrer noopener">MIT License</a>.</Text>
          </li>
          <li>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */ }
            <Text>The <a href="https://github.com/0aoq/SimpleCSS" target="_blank" rel="noreferrer noopener">SimpleCSS</a> package is © <a href="https://github.com/0aoq" target="_blank" rel="noreferrer noopener">0aoq and other contributors</a> used under the terms of the <a href="https://github.com/0aoq/SimpleCSS/blob/master/LICENSE" target="_blank" rel="noreferrer noopener">MIT License</a>.</Text>
          </li>
          <li>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */ }
            <Text>Some packages are supplied by the <a href="https://zbase.dev/~/tidy/?.getPackage" target="_blank" rel="noreferrer noopener">Zerobase Package API</a>, and are licensed under the <a href="http://www.apache.org/licenses/LICENSE-2.0" rel="noreferrer noopener" target="_blank">Apache 2.0</a> license.</Text>
          </li>
        </ul>
        <Text variant="s1" weight="medium">chat.zbase.dev Roadmap</Text>
        <ul>
          <li>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */ }
            { /* eslint-disable-next-line max-len */ }
            <Text>Support mobile devices (iOS, Android, etc.) by adding support for collapsing sidebars and adding a mobile-friendly UI. (Planned for public repository too.)</Text>
          </li>
          <li>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */ }
            { /* eslint-disable-next-line max-len */ }
            <Text>Add support for Matrix space creaion within the app.</Text>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Settings({ isOpen, onRequestClose }) {
  const settingSections = [{
    name: 'General',
    iconSrc: SettingsIC,
    render() {
      return <GeneralSection />;
    },
  }, {
    name: 'Appearance',
    iconSrc: SunIC,
    render() {
      return <AppearanceSection />;
    },
  }, {
    name: 'Notifications',
    iconSrc: BellIC,
    render() {
      return <NotificationsSection />;
    },
  }, {
    name: 'Security & Privacy',
    iconSrc: LockIC,
    render() {
      return <SecuritySection />;
    },
  }, {
    name: 'Help & About',
    iconSrc: InfoIC,
    render() {
      return <AboutSection />;
    },
  }];
  const [selectedSection, setSelectedSection] = useState(settingSections[0]);

  const handleLogout = () => {
    /* eslint-disable no-restricted-globals, no-alert */
    const _confirm = confirm('Confirm logout');
    if (_confirm) logout();
  };

  return (
    <PopupWindow
      className="settings-window"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Settings"
      contentTitle={selectedSection.name}
      drawer={(
        <>
          {
            settingSections.map((section) => (
              <PWContentSelector
                key={section.name}
                selected={selectedSection.name === section.name}
                onClick={() => setSelectedSection(section)}
                iconSrc={section.iconSrc}
              >
                {section.name}
              </PWContentSelector>
            ))
          }
          <PWContentSelector
            variant="danger"
            onClick={handleLogout}
            iconSrc={PowerIC}
          >
            Logout
          </PWContentSelector>
        </>
      )}
      contentOptions={<IconButton src={CrossIC} onClick={onRequestClose} tooltip="Close" />}
    >
      {selectedSection.render()}
    </PopupWindow>
  );
}

Settings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default Settings;
