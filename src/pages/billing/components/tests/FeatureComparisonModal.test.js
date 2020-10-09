import React from 'react';
import { shallow } from 'enzyme';
import {
  ComparisonModal,
  RenderCell,
  HeaderRow,
  GroupHeading,
  Row,
} from '../FeatureComparisonModal';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import styles from './FeatureComparisonModalHibana.module.scss';
jest.mock('src/hooks/useHibanaOverride');
jest.mock('../../context/FeatureChangeContext');
useHibanaOverride.mockReturnValue(styles);

jest.mock('src/pages/billing/constants', () => ({
  FEATURE_COMPARISON: {
    featureGroup1: {
      featureA: {
        PLANA: true,
        PLANB: '15 days',
        PLANC: 'test /n string',
      },
    },
    featureGroup2: {
      featureA: {
        conditionFlag: 'is_visible',
        PLANA: true,
        PLANB: '15 days',
        PLANC: 'test /n string',
      },
    },
  },
  PLANS: ['PLANA', 'PLANB', 'PLANC'],
}));
const PLANS = ['PLANA', 'PLANB', 'PLANC'];
describe('FeatureComparisonModal: ', () => {
  describe('ComparisonModal: ', () => {
    const props = {
      open: true,
      handleClose: jest.fn(),
      flags: { is_visible: true },
    };
    it('should render correctly', () => {
      const wrapper = shallow(<ComparisonModal {...props} />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Row)).toHaveLength(2);
    });
    it('should not render rows without the flag', () => {
      const flags = { is_visible: undefined };
      const wrapper = shallow(<ComparisonModal {...props} flags={flags} />);
      expect(wrapper.find(Row)).toHaveLength(1);
    });
  });
  describe('Row: ', () => {
    const props = {
      featureName: 'Signals Predictive Analytics',
      featureValues: {
        testAccount: true,
        starterPlans: true,
        premierPlans: true,
      },
    };
    it('should render correctly', () => {
      const wrapper = shallow(<Row featureName={props.featureName} {...props.featureValues} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('GroupHeading: ', () => {
    const props = {
      groupName: 'Standard Features',
      colSpan: PLANS.length,
    };
    it('should render correctly', () => {
      const wrapper = shallow(<GroupHeading {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('HeaderRow:', () => {
    const props = {
      plans: PLANS,
    };
    it('should render correctly', () => {
      const wrapper = shallow(<HeaderRow {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('renderCell: ', () => {
    it('should render a icon when value passed is boolean', () => {
      const wrapper = shallow(<RenderCell cellValue={true} />);
      expect(wrapper).toContainExactlyOneMatchingElement('Check');
    });
    it('should render a node when value is a string containing \n', () => {
      const wrapper = shallow(<RenderCell cellValue={'test string \n'} />);
      expect(wrapper).toContainMatchingElements(3, 'div');
    });
  });
});
