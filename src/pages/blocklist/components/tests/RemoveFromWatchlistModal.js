import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';

import { RemoveFromWatchlistModal } from '../RemoveFromWatchlistModal';

describe('Stop Monitoring Modal', () => {
  const closeModal = jest.fn();
  const deleteMonitor = jest.fn().mockResolvedValue();
  const showAlert = jest.fn();
  const monitorToDelete = 'sparkpost.io';
  const subject = ({ ...props }) => {
    const defaults = { closeModal, monitorToDelete, deleteMonitor, showAlert };

    return render(
      <TestApp>
        <RemoveFromWatchlistModal {...defaults} {...props} />
      </TestApp>,
    );
  };

  it('renders the modal correctly for an ip address', () => {
    const { getAllByText, getByText } = subject({ monitorToDelete: '1.2.3.4' });

    expect(getAllByText('Remove from Watchlist')).toHaveLength(2);
    expect(
      getByText(
        "Removing IP 1.2.3.4 from your watchlist means you won't get notified of changes, but don't worry you can always add it again later.",
      ),
    ).toBeInTheDocument();
  });

  it('renders the modal correctly for a sending domain', () => {
    const { getAllByText, getByText } = subject({ monitorToDelete: 'test.com' });

    expect(getAllByText('Remove from Watchlist')).toHaveLength(2);
    expect(
      getByText(
        "Removing domain test.com from your watchlist means you won't get notified of changes, but don't worry you can always add it again later.",
      ),
    ).toBeInTheDocument();
  });

  it('upon clicking the confirm button, deletes the resource, shows alert, and closes the modal', async () => {
    const { getAllByText } = subject();

    await fireEvent.click(getAllByText('Remove from Watchlist')[1]);
    expect(deleteMonitor).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });
});
