import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector, clearFields } from 'redux-form';
import { RadioGroup } from 'src/components/reduxFormWrappers';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { FORMS, ROLES } from 'src/constants';
import SubaccountAssignment from './SubaccountAssignment';

const ADMIN_ROLE = {
  label: <strong>Admin</strong>,
  value: ROLES.ADMIN,
  helpText:
    'Has access to all features, including the ability to invite additional users.'
};

const REPORTING_ROLE = {
  label: <strong>Reporting</strong>,
  value: ROLES.REPORTING,
  helpText:
    'Has access to reporting and read-only access to templates.'
};

const SUPERUSER_ROLE = {
  label: <strong>Super User</strong>,
  value: ROLES.SUPERUSER
};


export class RoleRadioGroup extends React.Component {
  componentDidUpdate(prevProps) {
    const { selectedRole: prevRole } = prevProps;
    const { clearFields, selectedRole } = this.props;

    // Reset subaccount assignment fields when selecting a non reporting role
    if (prevRole === ROLES.REPORTING && selectedRole !== ROLES.REPORTING) {
      clearFields(FORMS.INVITE_USER, false, false, 'useSubaccount', 'subaccount');
    }
  }

  renderRoles() {
    const {
      selectedRole,
      hasSubaccounts,
      useSubaccountChecked,
      allowSuperUser,
      allowSubaccountAssignment
    } = this.props;

    return [
      ADMIN_ROLE,
      {
        ...REPORTING_ROLE,
        children: allowSubaccountAssignment &&
          hasSubaccounts && (
          <SubaccountAssignment
            selectedRole={selectedRole}
            useSubaccountChecked={useSubaccountChecked}
          />
        )
      },
      allowSuperUser && SUPERUSER_ROLE
    ].filter(Boolean);
  }

  render() {
    const { disabled, ...rest } = this.props;

    const roles = this.renderRoles();
    const options = roles.map((role) => ({ ...role, disabled }));

    return <RadioGroup title="Role" grid={{ xs: 12, sm: 12, md: 6 }} options={options} {...rest} />;
  }
}

RoleRadioGroup.propTypes = {
  disabled: propTypes.bool.isRequired,
  allowSuperUser: propTypes.bool.isRequired,
  allowSubaccountAssignment: propTypes.bool.isRequired
};

RoleRadioGroup.defaultProps = {
  disabled: false,
  allowSuperUser: false
};

const mapStateToProps = (state) => ({
  selectedRole: formValueSelector(FORMS.INVITE_USER)(state, 'access'),
  hasSubaccounts: hasSubaccounts(state),
  useSubaccountChecked: formValueSelector(FORMS.INVITE_USER)(state, 'useSubaccount')
});

const mapDispatchToProps = { clearFields };

export default connect(mapStateToProps, mapDispatchToProps)(RoleRadioGroup);
