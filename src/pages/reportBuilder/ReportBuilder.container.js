import React, { createContext, useContext } from 'react';
import { connect } from 'react-redux';
import { refreshReportOptions } from 'src/actions/reportOptions';
import ReportBuilder from './ReportBuilder';

const ReportBuilderContext = createContext({});

const ReportBuilderProvider = ({ children, reportOptions, refreshReportOptions }) => {
  const contextValue = {
    reportOptions,
    refreshReportOptions,
  };

  return (
    <ReportBuilderContext.Provider value={contextValue}>{children}</ReportBuilderContext.Provider>
  );
};

const ReportBuilderContainer = props => {
  return (
    <ReportBuilderProvider {...props}>
      <ReportBuilder />
    </ReportBuilderProvider>
  );
};

//TODO: Replace with useReducer or some locally managed reportOptions
const mapStateToProps = state => {
  return { reportOptions: state.reportOptions };
};

export const useReportBuilderContext = () => useContext(ReportBuilderContext);

export default connect(mapStateToProps, { refreshReportOptions })(ReportBuilderContainer);
