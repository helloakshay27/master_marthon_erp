import React, { useState } from "react";
import { DropdownCollapseIcon } from "../..";

const CollapsibleCard = ({ 
  title, 
  children, 
  isInitiallyCollapsed = false, 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(isInitiallyCollapsed);

  const toggleCardBody = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="card mx-3 mt-3">
      <div className="card-header3">
        <h3 className="card-title">{title}</h3>
        <div className="card-tools">
          <button type="button" className="btn btn-tool" onClick={toggleCardBody}>
              <DropdownCollapseIcon isCollapsed={isCollapsed} />
           
          </button>
        </div>
      </div>

      {!isCollapsed && <div className="card-body pt-0 mt-0">{children}</div>}
    </div>
  );
};

export default CollapsibleCard;
