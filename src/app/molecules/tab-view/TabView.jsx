import React from 'react';
import PropTypes from 'prop-types';
import './TabView.scss';

function TabView({
  tabs,
  activeTab,
  onChange,
}) {
  // const selectedTab = activeTab === null ? tabs[0] : activeTab;

  return (
    <div className="tab-view">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          className={`tab-view-item${tab === activeTab ? ' selected' : ''}`}
          onClick={() => { if (tab !== activeTab) onChange(tab); }}
          type="button"
          tabIndex={i}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

TabView.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TabView;
