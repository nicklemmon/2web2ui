import React from 'react';
import classnames from 'classnames';
import { Search } from '@sparkpost/matchbox-icons';
import { Grid, Label, Select, TextField } from 'src/components/matchbox';
import { onEnter } from 'src/helpers/keyEvents';
import withSignalOptions from '../../containers/withSignalOptions';
import styles from './FacetFilter.module.scss';
import facets from '../../constants/facets';
const initialFacets = facets;

export class FacetFilter extends React.Component {
  state = {
    prevFacetSearchTerm: '',
    searchTerm: '',
  };

  // note, hydrate searchTerm from signalOptions
  static getDerivedStateFromProps(props, state) {
    const facetSearchTerm = props.signalOptions.facetSearchTerm || '';

    return {
      prevFacetSearchTerm: facetSearchTerm,
      searchTerm:
        state.prevFacetSearchTerm !== facetSearchTerm ? facetSearchTerm : state.searchTerm,
    };
  }

  handleFacetChange = event => {
    const { changeSignalOptions } = this.props;
    changeSignalOptions({ facet: event.currentTarget.value, facetSearchTerm: '' });
    this.setState({ searchTerm: '' });
  };

  handleFacetSearch = () => {
    const { changeSignalOptions, signalOptions } = this.props;

    if (signalOptions.facetSearchTerm !== this.state.searchTerm) {
      changeSignalOptions({ facetSearchTerm: this.state.searchTerm });
    }
  };

  handleSearchChange = event => {
    this.setState({ searchTerm: event.currentTarget.value });
  };

  render() {
    const {
      signalOptions: { facet },
      facets = initialFacets,
    } = this.props;
    const { searchTerm } = this.state;

    const OPTIONS = [
      { label: 'No Breakdown', value: '' },
      ...facets.map(({ key, label }) => ({ label: `By ${label}`, value: key })),
    ];

    return (
      <Grid.Column lg={facet ? 7 : 3} xl={facet ? 7 : 3}>
        <div className={classnames(styles.FacetFilter, facet && styles.FacetSelected)}>
          <Select
            label="Breakdown"
            id="facet-filter-select"
            onChange={this.handleFacetChange}
            options={OPTIONS}
            value={facet}
          />
          {facet && (
            <div>
              <Label
                className={styles.HiddenLabel}
                id="facet-filter-search"
                label="Search by Breakdown"
              />

              <TextField
                className={styles.FacetSearchField}
                id="facet-filter-search"
                onChange={this.handleSearchChange}
                onKeyPress={onEnter(this.handleFacetSearch)}
                onBlur={this.handleFacetSearch}
                placeholder="Search"
                prefix={<Search />}
                value={searchTerm}
              />
            </div>
          )}
        </div>
      </Grid.Column>
    );
  }
}

export default withSignalOptions(FacetFilter);
