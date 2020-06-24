import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm } from 'redux-form';
import { Box, Grid } from 'src/components/matchbox';
import { FilterDropdown } from 'src/components';
import * as suppressionActions from 'src/actions/suppressions';
import DatePicker from 'src/components/datePicker/DatePicker';
import { selectSearchInitialValues } from 'src/selectors/suppressions';
import { TYPES, SOURCES, RELATIVE_DATE_OPTIONS } from '../constants';

export class SuppressionSearch extends Component {
  componentDidMount() {
    this.props.refreshSuppressionDateRange({
      relativeRange: this.props.search.dateOptions.relativeRange || 'day',
    });
  }

  componentDidUpdate(prevProps) {
    const { search } = this.props;
    if (search !== prevProps.search) {
      this.props.searchSuppressions(search);
    }
  }

  handleTypesSelection = selected => {
    const types = _.compact(_.map(selected, (val, key) => (val ? key : undefined)));
    this.props.updateSuppressionSearchOptions({ types });
  };

  handleSourcesSelection = selected => {
    const sources = _.compact(_.map(selected, (val, key) => (val ? key : undefined)));
    this.props.updateSuppressionSearchOptions({ sources });
  };

  render() {
    const { dateOptions } = this.props.search;
    return (
      <Grid>
        <Grid.Column xs={12} md={6}>
          <Box mb={['300', null, null, '0']}>
            {dateOptions.from && dateOptions.to && (
              <DatePicker
                {...dateOptions}
                relativeDateOptions={RELATIVE_DATE_OPTIONS}
                onChange={this.props.refreshSuppressionDateRange}
                disabled={this.props.loading}
              />
            )}
          </Box>
        </Grid.Column>
        <Grid.Column xs={6} md={3}>
          <FilterDropdown
            label="Type"
            id="types-filter-dropdown"
            formName="filterForm"
            options={TYPES}
            namespace="types"
            displayValue="Type"
            onClose={this.handleTypesSelection}
          />
        </Grid.Column>

        <Grid.Column xs={6} md={3}>
          <FilterDropdown
            label="Sources"
            id="source-filter-dropdown"
            formName="filterForm"
            options={SOURCES}
            namespace="sources"
            displayValue="Sources"
            onClose={this.handleSourcesSelection}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

const formName = 'filterForm';
const formOptions = {
  form: formName,
};

const mapStateToProps = state => ({
  search: state.suppressions.search,
  list: state.suppressions.list,
  loading: state.suppressions.listLoading,
  initialValues: selectSearchInitialValues(state),
});
export default connect(
  mapStateToProps,
  suppressionActions,
)(reduxForm(formOptions)(SuppressionSearch));
