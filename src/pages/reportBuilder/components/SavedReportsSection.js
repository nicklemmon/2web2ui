import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PRESET_REPORT_CONFIGS } from '../constants/presetReport';
// import { Typeahead, TypeaheadItem } from 'src/components/typeahead/Typeahead';
import { Button, Grid, Select } from 'src/components/matchbox';
import { Edit, FolderOpen, Save } from '@sparkpost/matchbox-icons';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';

const options = PRESET_REPORT_CONFIGS.map(report => {
  return { label: report.name, value: report.key };
});

const StyledButton = styled(Button)`
  position: relative;
  top: 40%;
`;

const SavedReportsSection = props => {
  /* eslint-disable no-unused-vars */
  const [modalStatus, setModalStatus] = useState('');

  return (
    <Grid>
      <Grid.Column lg={7} sm={12} xs={12}>
        <Select
          placeholder="Select a Report"
          data-id="report-select"
          label="Report"
          options={options}
          value={props.selectedItem?.key}
          onChange={e => props.handleReportChange(e.target.value)}
        />
      </Grid.Column>
      {props.isSavedReportsEnabled && (
        <Grid.Column lg={5} sm={12} xs={12}>
          <StyledButton flat onClick={() => setModalStatus('edit')}>
            Edit Details
            <Button.Icon as={Edit} ml="200" />
          </StyledButton>
          <StyledButton flat onClick={() => setModalStatus('save')}>
            Save Changes
            <Button.Icon as={Save} ml="200" />
          </StyledButton>
          <StyledButton flat onClick={() => setModalStatus('view')}>
            View All Reports
            <Button.Icon as={FolderOpen} ml="200" />
          </StyledButton>
        </Grid.Column>
      )}
    </Grid>
  );

  // TODO: refactor typeahead to be able to have new behavior
  // return (
  //   <Typeahead
  //     renderItem={item => <TypeaheadItem label={item.name} />}
  //     canChange
  //     label="Report"
  //     itemToString={report => (report ? report.name : '')}
  //     name="ReportTypeahead"
  //     placeholder="Select a Report"
  //     onChange={props.handleReportChange}
  //     selectedItem={props.selectedItem}
  //     results={PRESET_REPORT_CONFIGS}
  //   />
  // );
};

const mapStateToProps = state => ({
  isSavedReportsEnabled: selectCondition(isUserUiOptionSet('allow_saved_reports'))(state),
});

export default connect(mapStateToProps)(SavedReportsSection);
