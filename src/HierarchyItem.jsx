import React, { useState, useImperativeHandle, forwardRef } from 'react';

const HierarchyItem = forwardRef(({ name, children, onItemClick }, ref) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleExpandCollapseClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNameClick = () => {
    console.log(`Clicked on: ${name}`);
    if (onItemClick) {
      onItemClick(name);
    }
  };

  useImperativeHandle(ref, () => ({
    expandCollapse: (expand) => setIsCollapsed(!expand),
  }));

  return (
    <div style={{ paddingLeft: '20px', marginTop: '5px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={handleExpandCollapseClick} style={{ display: 'inline-block' }}>
          {isCollapsed ? '▶' : '▼'}
        </button>
        <button
          onClick={handleNameClick}
          style={{
            display: 'inline-block',
            marginLeft: '5px',
            width: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            backgroundColor: 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            padding: '0',
            color: 'white',
          }}
          title={name}
          ref={ref}
        >
          {name}
        </button>
      </div>
      {!isCollapsed && <div>{children}</div>}
    </div>
  );
});

export default HierarchyItem;
