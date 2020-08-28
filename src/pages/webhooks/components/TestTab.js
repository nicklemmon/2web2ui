import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getEventSamples, testWebhook } from 'src/actions/webhooks';
import { showAlert } from 'src/actions/globalAlert';
import Loading from 'src/components/loading';
import { Button, CodeBlock, Panel, Stack } from 'src/components/matchbox';

export class TestTab extends Component {
  state = {
    testSent: false,
    sampleEvent: null,
  };

  componentWillReceiveProps(nextProps) {
    if (!this.state.sampleEvent && nextProps.samples) {
      this.setState({ sampleEvent: this.buildTestRequest(this.props.webhook, nextProps.samples) });
    }
  }

  componentDidMount() {
    const { webhook, samples } = this.props;

    if (!samples) {
      this.props.getEventSamples(['delivery']);
    }

    if (!this.state.sampleEvent && samples) {
      this.setState({ sampleEvent: this.buildTestRequest(webhook, samples) });
    }
  }

  buildTestRequest(webhook, payload) {
    const parser = document.createElement('a');
    parser.href = webhook.target;

    const requestLines = [
      `POST ${parser.pathname} HTTP/1.1`,
      `Host: ${parser.hostname}`,
      'Content-Type: application/json',
      'X-MessageSystems-Batch-ID: 77c2b630-d712-11e4-9642-efc2723b99c1', // hardcoded value in the API
    ];

    if (webhook.auth_token) {
      requestLines.push(`X-MessageSystems-Webhook-Token: ${webhook.auth_token}`);
    }
    if (webhook.auth_type === 'oauth2') {
      requestLines.push('Authorization: Bearer <OAUTH2 ACCESS TOKEN>');
    } else if (webhook.auth_type === 'basic') {
      requestLines.push('Authorization: Basic <BASE64 ENCODED CREDENTIALS>');
    }

    requestLines.push('Connection: close');
    requestLines.push('');
    requestLines.push(JSON.stringify(payload, null, 2));

    return requestLines.join('\n');
  }

  testWebhook = () => {
    const { testWebhook, webhook, samples, showAlert } = this.props;

    return testWebhook({ id: webhook.id, subaccount: webhook.subaccount, message: samples }).then(
      () => {
        showAlert({ type: 'success', message: 'The test was successful!' });
        this.setState({ testSent: true });
      },
    );
  };

  render() {
    if (this.props.samplesLoading) {
      return <Loading />;
    }

    const { webhook, testResponse, testLoading } = this.props;
    const { testSent } = this.state;

    const buttonText = testSent
      ? testLoading
        ? 'Sending...'
        : 'Re-send batch'
      : 'Send Test Batch';

    return (
      <>
        <Panel.LEGACY.Section>
          <Stack>
            <p>
              The test sends the following request to this webhook's target URL ({webhook.target})
            </p>
            <CodeBlock code={this.state.sampleEvent || 'generating...'} height={300} />
          </Stack>
        </Panel.LEGACY.Section>
        <Panel.LEGACY.Section>
          <Button variant="primary" disabled={testLoading} onClick={this.testWebhook}>
            {buttonText}
          </Button>
        </Panel.LEGACY.Section>
        {!testLoading && testSent && testResponse && testResponse.status <= 299 && (
          <Panel.LEGACY.Section>
            <Stack>
              <p>The server responded like this:</p>
              <CodeBlock code={JSON.stringify(testResponse, null, '  ')} height={300} />
            </Stack>
          </Panel.LEGACY.Section>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  samples: webhooks.samples,
  samplesLoading: webhooks.samplesLoading,
  testLoading: webhooks.testLoading,
  testResponse: webhooks.testResponse,
});

export default connect(mapStateToProps, { getEventSamples, testWebhook, showAlert })(TestTab);
