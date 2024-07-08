import React from 'react';

interface PopupProps {
  isVisible: boolean;
  payload: any;
}

const BalanceInfo: React.FC<{ data: any }> = ({ data }) => (
  <table className="popup-table">
    <tbody>
      <tr>
        <th>Account Name</th>
        <td>{data.accountName}</td>
      </tr>
      <tr>
        <th>Balance</th>
        <td>${data.balance.toFixed(2)}</td>
      </tr>
      <tr>
        <th>Username</th>
        <td>{data.username}</td>
      </tr>
    </tbody>
  </table>
);

const TransferInfo: React.FC<{ data: any }> = ({ data }) => (
  <table className="popup-table">
    <tbody>
      <tr>
        <th>Amount</th>
        <td>${data.amount.toFixed(2)}</td>
      </tr>
      <tr>
        <th>From</th>
        <td>{data.debitedAccountName}</td>
      </tr>
      <tr>
        <th>To</th>
        <td>{data.creditedAccountName}</td>
      </tr>
      <tr>
        <th>Receiver</th>
        <td>{data.receiverUsername}</td>
      </tr>
      <tr>
        <th>New Balance</th>
        <td>${data.newBalance.toFixed(2)}</td>
      </tr>
      <tr>
        <th>Sender</th>
        <td>{data.username}</td>
      </tr>
    </tbody>
  </table>
);



const Popup: React.FC<PopupProps> = ({ isVisible, payload }) => {
  console.log('Popup props:', { isVisible, payload }); // Add this line for debugging

  if (!isVisible || !payload || !payload.additional_data) {
    console.log('Popup not visible or no data'); // Add this line for debugging
    return null;
  }

  const additionalData = payload.additional_data;

  return (
    <div className="popup">
      {additionalData.get_balance && (
        <div className="popup-item">
          <h3>Account Balance</h3>
          <BalanceInfo data={additionalData.get_balance} />
        </div>
      )}
      {additionalData.transfer_funds && (
        <div className="popup-item">
          <h3>Transfer Details</h3>
          <TransferInfo data={additionalData.transfer_funds} />
        </div>
      )}
    </div>
  );
};

export default Popup;