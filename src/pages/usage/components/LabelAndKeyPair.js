import React from 'react';
import { Definition } from 'src/components/text';

export const LabelAndKeyPair = ({ label, value }) => {
  return (
    <Definition dark>
      <Definition.Label>{label}</Definition.Label>
      <Definition.Value>{value}</Definition.Value>
    </Definition>
  );
};
