import React, { useEffect, useRef, useCallback } from 'react'; // Added useEffect, useRef, useCallback
import styles from './tabs.module.scss';
import Button from '../Button';

interface TabProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> { // Use Omit for clarity
    activeTab: number | string;
    onTabChange: (id: string | number) => void; 
    tabs: Array<{
        id: number | string;
        label: React.ReactNode | string;
        children: React.ReactNode;
    }>;
    // className is already included via HTMLProps
}

function Tabs(props: TabProps) {
    const {
        tabs,
        onTabChange,
        activeTab: activeTabId, // Renamed prop for clarity
        className,
        ...rest
    } = props;

    const tabListRef = useRef<HTMLDivElement>(null); // Ref for the container of buttons
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]); // Refs for individual buttons

    const length = tabs.length;

    // Find the index of the currently active tab based on its ID
    const activeTabIndex = Math.max(0, tabs.findIndex(tab => tab.id === activeTabId));

    // Ensure buttonRefs array has the correct size
    useEffect(() => {
        buttonRefs.current = buttonRefs.current.slice(0, tabs.length);
    }, [tabs.length]);


    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (length <= 1) return; // No navigation needed for 0 or 1 tab

        let nextIndex = activeTabIndex;

        if (event.key.toLowerCase() === 'l') { 
            nextIndex = (activeTabIndex + 1) % length;
        } else if (event.key.toLowerCase() === 'h') { 
            nextIndex = (activeTabIndex - 1 + length) % length;
        } else {
            return; 
        }

        if (nextIndex !== activeTabIndex) {
            event.preventDefault(); 
            const nextTabId = tabs[nextIndex].id; 
            onTabChange(nextTabId);
            // buttonRefs.current[nextIndex]?.focus(); 
        }
    }, [activeTabIndex, length, onTabChange, tabs]);


    if (length === 0) {
        return null;
    }

    // Get the content of the active tab
    const activeTabContent = tabs[activeTabIndex]?.children;

    return (
        // The outer div might not need role="tablist" if the inner one has it
        <div className={styles.tabs} {...rest}>
            <div
                ref={tabListRef} // Add ref
                className={`${styles.tabList} ${className || ''}`} // Simplified className logic
                role="tablist"
                aria-orientation="horizontal"
                onKeyDown={handleKeyDown} // Add keydown listener here
                tabIndex={-1} // Make focusable programmatically if needed, but focus will be on buttons
            >
                {tabs.map((tab, index) => (
                    <Button
                        ref={el => buttonRefs.current[index] = el} // Assign ref to each button
                        type="button"
                        aria-selected={activeTabIndex === index}
                        className={styles.tabItem}
                        role="tab"
                        key={tab.id}
                        id={`tab-${tab.id}`}
                        aria-controls={`tabpanel-${tab.id}`} 
                        tabIndex={activeTabIndex === index ? 0 : -1}
                        onClick={() => {
                            onTabChange(tab.id);
                        }}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>
            <div
                className={styles.tabContent}
                role="tabpanel"
                id={`tabpanel-${tabs[activeTabIndex].id}`}
                aria-labelledby={`tab-${tabs[activeTabIndex].id}`}
            >
                {activeTabContent}
            </div>
        </div>
    );
}

export default Tabs;
