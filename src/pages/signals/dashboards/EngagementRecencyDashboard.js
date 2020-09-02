import React, { Component } from 'react';
import { connect } from 'react-redux';
import { list as getSubaccounts } from 'src/actions/subaccounts';
import { Grid, Panel } from 'src/components/matchbox';
import Page from '../components/SignalsPage';
import EngagementRecencyOverview from '../containers/EngagementRecencyOverviewContainer';
import FacetFilter from '../components/filters/FacetFilter';
import DateFilter from '../components/filters/DateFilter';
import SubaccountFilter from '../components/filters/SubaccountFilter';
import facets from '../constants/facets';
import { ENGAGEMENT_RECENCY_INFO } from '../constants/info';
import { PageDescription } from 'src/components/text';
import { hasSubaccounts } from 'src/selectors/subaccounts';
export class EngagementRecencyDashboard extends Component {
  componentDidMount() {
    this.props.getSubaccounts();
  }

  render() {
    const { subaccounts, hasSubaccounts } = this.props;

    return (
      <Page title={<>Engagement Recency</>}>
        <PageDescription>{ENGAGEMENT_RECENCY_INFO}</PageDescription>
        <Panel.LEGACY>
          <Panel.LEGACY.Section>
            <Grid>
              <Grid.Column xs={12} md={4}>
                <DateFilter label="Date Range" />
              </Grid.Column>
            </Grid>
          </Panel.LEGACY.Section>
          <Panel.LEGACY.Section>
            <Grid>
              {hasSubaccounts && (
                <Grid.Column md={4} xs={12}>
                  <SubaccountFilter label="Subaccount" />
                </Grid.Column>
              )}
              {/* eslint-disable-next-line */}
              <FacetFilter facets={facets} label="Breakdown" />
            </Grid>
          </Panel.LEGACY.Section>
        </Panel.LEGACY>
        <EngagementRecencyOverview defaults={{ perPage: 25 }} subaccounts={subaccounts} hideTitle />
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  subaccounts: state.subaccounts.list,
  hasSubaccounts: hasSubaccounts(state),
});

const mapDispatchToProps = {
  getSubaccounts,
};

export default connect(mapStateToProps, mapDispatchToProps)(EngagementRecencyDashboard);
