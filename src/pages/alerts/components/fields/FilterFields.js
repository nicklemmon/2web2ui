import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, change } from 'redux-form';
import { SelectWrapper } from 'src/components/reduxFormWrappers';
import { getFormSpec } from '../../helpers/alertForm';
import { LINKS, MAILBOX_PROVIDERS } from 'src/constants';
import { ComboBoxTypeaheadWrapper } from 'src/components';
import { ExternalLink } from 'src/components/links';
import { Box, Grid, Stack } from 'src/components/matchbox';
import { getIpPools } from 'src/selectors/ipPools';
import { selectVerifiedDomains } from 'src/selectors/sendingDomains';
import { FORM_NAME } from '../../constants/formConstants';
import { listBlocklists, listMonitors } from 'src/actions/blocklist';
import { listPools } from 'src/actions/ipPools';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
import { list as listSendingIps } from 'src/actions/sendingIps';

const mbItemToString = item => MAILBOX_PROVIDERS[item] || '';

export class FilterFields extends Component {
  componentDidMount() {
    this.props.listBlocklists();
    this.props.listMonitors();
    this.props.listPools();
    this.props.listSendingDomains();
    this.props.listSendingIps();
  }

  resetSingleFilterValue = () => {
    this.props.change(FORM_NAME, 'single_filter.filter_values', []);
  };

  render() {
    const {
      blocklistMonitors,
      blocklistMonitorsPending,
      blocklists,
      blocklistsPending,
      metric,
      single_filter,
      ipPools,
      ipPoolLoading,
      sendingDomains,
      sendingDomainsLoading,
      sendingIps,
      disabled,
    } = this.props;

    const formSpec = getFormSpec(metric);

    const filterTypeaheadResults = {
      ip_pool: ipPools.map(({ id }) => id),
      mailbox_provider: Object.keys(MAILBOX_PROVIDERS),
      sending_domain: sendingDomains.map(({ domain }) => domain),
      sending_ip: sendingIps.map(({ external_ip }) => external_ip),
      blacklist_provider: blocklists.map(({ code }) => code),
      blacklist_resource: blocklistMonitors.map(({ resource }) => resource),
    };

    const extraProps = {
      none: {
        disabled: true,
        placeholder: 'No facet type selected',
      },
      ip_pool: {
        disabled: disabled || ipPoolLoading || ipPools.length === 0,
        placeholder: ipPoolLoading
          ? 'Loading your IP Pools...'
          : ipPools.length === 0
          ? 'No Options Available'
          : 'Type To Search',
      },
      mailbox_provider: {
        disabled: disabled,
        itemToString: mbItemToString,
        placeholder: 'Type To Search',
        helpText: (
          <>
            For a breadown of popular inbox providers, see our{' '}
            <ExternalLink to={LINKS.MAILBOX_PROVIDERS}>alerts guide</ExternalLink>
          </>
        ),
      },
      sending_domain: {
        disabled: disabled || sendingDomainsLoading || sendingDomains.length === 0,
        placeholder: sendingDomainsLoading
          ? 'Loading your Sending Domains...'
          : sendingDomains.length === 0
          ? 'No Options Available'
          : 'Type To Search',
      },
      sending_ip: {
        disabled,
        placeholder: 'Type To Search',
      },
      blacklist_provider: {
        disabled: disabled || blocklistsPending,
        placeholder: 'Type To Search',
      },
      blacklist_resource: {
        disabled: disabled || blocklistMonitorsPending || blocklistMonitors.length === 0,
        placeholder: 'Type To Search',
      },
    };

    const renderSingleFilter = () => (
      <Grid>
        <Box marginTop="400" />
        <Grid.Column sm={12} md={3} lg={3}>
          <Field
            name="single_filter.filter_type"
            component={SelectWrapper}
            options={formSpec.filterOptions}
            disabled={disabled}
            onChange={this.resetSingleFilterValue}
            label="Facet"
          />
        </Grid.Column>
        <Grid.Column sm={12} md={9} lg={9}>
          <Field
            name="single_filter.filter_values"
            component={ComboBoxTypeaheadWrapper}
            results={filterTypeaheadResults[single_filter.filter_type] || []}
            key={single_filter.filter_type}
            {...extraProps[single_filter.filter_type]}
            label="&nbsp;"
          />
        </Grid.Column>
      </Grid>
    );

    /**
     * Determine if a filter should be rendered depending on the state of the filters
     *
     * @param {Object} single filter field object
     * @returns {boolean} true or false depending on the filter should be rendered
     */
    const shouldRenderFilter = filter => {
      const emptyIP = filter.value === 'sending_ip' && sendingIps.length <= 0;
      return !emptyIP;
    };

    const renderMultiFilters = () => {
      const multiFilters = formSpec.filterOptions
        .filter(option => shouldRenderFilter(option))
        .map(({ label, value }) => (
          <Field
            key={value}
            name={value}
            id={`combobox_${label}`}
            component={ComboBoxTypeaheadWrapper}
            results={filterTypeaheadResults[value]}
            label={label}
            {...extraProps[value]}
          />
        ));
      return <Stack space="500">{multiFilters}</Stack>;
    };

    return (
      <Box marginBottom="400">
        {formSpec.filterType === 'single' && renderSingleFilter()}
        {formSpec.filterType === 'multi' && renderMultiFilters()}
      </Box>
    );
  }
}

const mapStateToProps = state => {
  const selector = formValueSelector(FORM_NAME);

  return {
    blocklists: state.blocklist.blocklists,
    blocklistsPending: state.blocklist.blocklistsPending,
    blocklistMonitors: state.blocklist.monitors,
    blocklistMonitorsPending: state.blocklist.monitorsPending,
    single_filter: selector(state, 'single_filter') || {},
    metric: selector(state, 'metric'),
    ipPools: getIpPools(state) || [],
    sendingDomains: selectVerifiedDomains(state) || [],
    sendingIps: state.sendingIps.list || [],
    ipPoolsLoading: state.ipPools.listLoading,
    sendingDomainsLoading: state.sendingDomains.listLoading,
  };
};

const mapDispatchToProps = {
  listBlocklists,
  listMonitors,
  listPools,
  listSendingDomains,
  listSendingIps,
  change,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterFields);
