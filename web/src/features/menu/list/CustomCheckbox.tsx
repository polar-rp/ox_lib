import React from 'react';
import { Checkbox, useMantineTheme } from '@mantine/core';

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const theme = useMantineTheme();

  return (
    <Checkbox
      checked={checked}
      size="md"
      readOnly
      styles={{
        root: {
          display: 'flex',
          alignItems: 'center',
        },
        input: {
          backgroundColor: theme.colors.dark[7],
          borderColor: theme.colors.dark[4],
          
          '&:checked': {
            backgroundColor: theme.colors.dark[2],
            borderColor: theme.colors.dark[2],
            '--checkbox-icon-color': theme.colors.dark[6],
          },
        },
        inner: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    />
  );
};

export default CustomCheckbox;