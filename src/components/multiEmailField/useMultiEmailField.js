import { useState } from 'react';
import { isEmailAddress } from 'src/helpers/email';
import _ from 'lodash';

const useMultiEmailField = (value = '', emailList = [], error = '') => {
  const [multiEmailValue, setMultiEmailValue] = useState(value);
  const [multiEmailError, setMultiEmailError] = useState(error);
  const [multiEmailList, setMultiEmailList] = useState(emailList);

  const handleMultiEmailKeyDownAndBlur = e => {
    // Remove the last email from the list when the user deletes
    // and no in progress value is present in the field
    if (e.keyCode === 8 && !multiEmailValue) {
      setMultiEmailList(
        multiEmailList.filter((email, index) => index + 1 !== multiEmailList.length),
      );
    }

    if (e.type === 'blur' || e.keyCode === 32 || e.keyCode === 13) {
      if (e.type === 'keydown') {
        e.preventDefault(); // Prevents spaces from being written to the field and prevents the enter key from submitting the form
      }

      const isValidEmail = isEmailAddress(multiEmailValue);

      // A valid email address is entered, and it is added to the array
      if (isValidEmail) {
        setMultiEmailList([...multiEmailList, { email: multiEmailValue }]);
        setMultiEmailValue('');

        return;
      }

      // Throw an error on the field if:
      // 1. There is some text entry in the field
      // 2. The entered email is not valid or
      // 3. The entered email already exists in the list
      if (multiEmailValue && !isValidEmail) {
        setMultiEmailError('Please enter a valid email address');
      }
    }
  };

  const handleMultiEmailChange = e => {
    setMultiEmailValue(e.target.value);
    setMultiEmailError('');
  };

  const handleMultiEmailRemove = target => {
    const nextEmailList = multiEmailList.filter(item => !_.isEqual(target, item));

    setMultiEmailList(nextEmailList);
  };

  return {
    multiEmailValue,
    multiEmailList,
    multiEmailError,
    setMultiEmailValue,
    setMultiEmailError,
    setMultiEmailList,
    handleMultiEmailChange,
    handleMultiEmailKeyDownAndBlur,
    handleMultiEmailRemove,
  };
};

export default useMultiEmailField;
