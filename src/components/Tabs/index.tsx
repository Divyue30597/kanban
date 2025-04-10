import { useState } from "react";
import styles from "./tabs.module.scss";

interface Tab extends React.HTMLProps<HTMLDivElement> {
  activeTab?: number | string;
  onTabChange: (id: string | number) => void;
  tabs: Array<{
    id: number | string;
    label: React.ReactNode | string;
    children: React.ReactNode;
  }>;
}

function Tabs(props: Tab) {
  const {
    tabs,
    onTabChange,
    activeTab: propActiveTab,
    onKeyDown,
    ...rest
  } = props;

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div
      className={styles.tabs}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      {...rest}
    >
      <div className={styles.tabList}>
        {tabs.map((tab, index) => (
          <button
            type="button"
            disabled={activeTab === index}
            className={styles.tabItem}
            key={tab.id}
            onClick={() => {
              handleTabClick(index);
              onTabChange(propActiveTab || tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab].children}</div>
    </div>
  );
}

export default Tabs;
