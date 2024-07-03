import React from 'react';

interface PopupProps {
  isVisible: boolean;
  dataKey: string;
  dataValue: string;
}

const Popup: React.FC<PopupProps> = ({ isVisible, dataKey, dataValue }) => {
  if (!isVisible) return null;

  return (
    <div className="popup">
      <h3>{dataKey}</h3>
      <p>{dataValue}</p>
    </div>
  );
};

export default Popup;