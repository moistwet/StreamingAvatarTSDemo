


import React from 'react';
import './Popup.css';

interface PopupProps {
  isVisible: boolean;
  payload: any;
  onClose: () => void;
}

const BalanceInfo: React.FC<{ data: any }> = ({ data }) => (
  <div className="popup-content">
    <div className="popup-username">{data.username}</div>
    <div className="popup-account-name">{data.accountName}</div>
    <div className="popup-balance-container">
      <div className="popup-balance-currency">SGD</div>
      <div className="popup-balance-amount">{data.balance.toFixed(2)}</div>
    </div>
  </div>
);


const TransferInfo: React.FC<{ data: any }> = ({ data }) => (
  <div className="popup-content">
    <div className="popup-username">{data.username}</div>
    <div className="popup-account-name">Transfer Details</div>
    <div className="popup-transfer-details">
      <div>Amount: ${data.amount.toFixed(2)}</div>
      <div>From: {data.debitedAccountName}</div>
      <div>To: {data.creditedAccountName}</div>
      <div>Receiver: {data.receiverUsername}</div>
      <div>New Balance: ${data.newBalance.toFixed(2)}</div>
    </div>
  </div>
);

const Popup: React.FC<PopupProps> = ({ isVisible, payload, onClose }) => {
  console.log('Popup props:', { isVisible, payload });

  if (!isVisible || !payload || !payload.additional_data) {
    console.log('Popup not visible or no data');
    return null;
  }

  const additionalData = payload.additional_data;

  const renderContent = () => {
    if (additionalData.get_balance) {
      return <BalanceInfo data={additionalData.get_balance} />;
    } else if (additionalData.transfer_funds) {
      // Implement TransferInfo component if needed
      return <div>Transfer Info (Not implemented)</div>;
    } else {
      return <div>Unsupported operation</div>;
    }
  };

  return (
    <div className={`popup ${isVisible ? 'visible' : ''}`}>
      {renderContent()}
      <button className="popup-cancel-button" onClick={onClose}>Cancel</button>
    </div>
  );
};

export default Popup;