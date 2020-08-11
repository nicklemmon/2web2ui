import React from 'react';
import { Grid } from 'src/components/matchbox';
import { Heading } from 'src/components/text';
import CodeBlock from './CodeBlock';

import OGStyles from './ApiDetails.module.scss';
import hibanaStyles from './ApiDetailsHibana.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

const ApiDetails = () => {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);
  const Tab = () => <span className={styles.tab} />;
  const White = ({ children }) => <span className={styles.white}>{children}</span>;

  const codeBlock = (
    <small className={styles.blue}>
      {'{'}
      <br />
      <Tab />
      "results": {'{'}
      <br />
      <Tab />
      <Tab />
      "result": "<White>undeliverable</White>",
      <br />
      <Tab />
      <Tab />
      "valid": <White>false</White>,<br />
      <Tab />
      <Tab />
      "reason": "<White>Invalid Domain</White>",
      <br />
      <Tab />
      <Tab />
      "is_role": <White>false</White>,<br />
      <Tab />
      <Tab />
      "is_disposable": <White>false</White>,<br />
      <Tab />
      <Tab />
      "is_free": <White>false</White>,<br />
      <Tab />
      <Tab />
      "did_you_mean": "<White>harry.potter@hogwarts.edu</White>"<br />
      <Tab />
      {'}'}
      <br />
      {'}'}
    </small>
  );

  const exampleMethod = (
    <div>
      <div className={styles.SubHeader}>GET</div>
      <small>
        <code className={styles.ExampleMethod}>
          /api/v1/recipient-validation/single/{'{'}address{'}'}
        </code>
      </small>
    </div>
  );

  return (
    <Grid>
      <Grid.Column xs={12} md={6} lg={5}>
        <Heading as="h3" looksLike="h5" className={styles.Header}>
          Integrate Now
        </Heading>
        <p>Validate an email the moment you receive it, in real-time.</p>
        <p>Block fake emails and catch typos with a single API request.</p>
        {exampleMethod}
      </Grid.Column>
      <Grid.Column xs={12} md={6} lgOffset={1}>
        <div className={styles.CodeSection}>
          <CodeBlock>{codeBlock}</CodeBlock>
        </div>
      </Grid.Column>
    </Grid>
  );
};

export default ApiDetails;
