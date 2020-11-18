import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router, Route, Switch, Link } from 'react-router-dom';
import RouteFocusHandler from '../RouteFocusHandler';

function Subject() {
  const history = createMemoryHistory();
  history.push('/');

  return (
    <Router history={history}>
      <RouteFocusHandler />

      <nav>
        <Link to="/">Landing</Link>

        <Link to="/path/1">Path 1</Link>

        <Link to="/path/1?my=param">Add Query Params</Link>
      </nav>

      <Switch>
        <Route exact path="/">
          <h1>Landing Heading</h1>
        </Route>

        <Route exact path="/path/1" component={Page} />
      </Switch>
    </Router>
  );
}

function Page({ location }) {
  return (
    <div>
      <h1>Path 1 Heading</h1>

      <p>{location.search}</p>
    </div>
  );
}

describe('RouteFocusHandler', () => {
  it('moves focus to the document <body/> when navigating between routes', () => {
    render(<Subject />);

    screen.getByText('Path 1').focus();
    userEvent.click(screen.getByText('Path 1'));
    expect(screen.getByText('Path 1 Heading')).toBeInTheDocument();
    expect(document.activeElement).toBe(document.body);

    screen.getByText('Landing').focus();
    userEvent.click(screen.getByText('Landing'));
    expect(screen.getByText('Landing Heading')).toBeInTheDocument();
    expect(document.activeElement).toBe(document.body);
  });

  it('does not move focus to the document <body/> when only query params are updated', () => {
    render(<Subject />);

    userEvent.click(screen.getByText('Path 1'));
    userEvent.click(screen.getByText('Add Query Params'));

    expect(screen.getByText('?my=param')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByText('Add Query Params'));
  });
});
