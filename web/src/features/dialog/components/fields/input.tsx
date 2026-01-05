import { PasswordInput, TextInput, useMantineTheme } from '@mantine/core';
import React from 'react';
import { IInput } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  register: UseFormRegisterReturn;
  row: IInput;
  index: number;
}

const InputField: React.FC<Props> = (props) => {
  const theme = useMantineTheme();

  const commonProps = {
    ...props.register,
    defaultValue: props.row.default,
    label: props.row.label,
    description: props.row.description,
    placeholder: props.row.placeholder,
    minLength: props.row.min,
    maxLength: props.row.max,
    disabled: props.row.disabled,
    withAsterisk: props.row.required,
    leftSection: props.row.icon ? <LibIcon icon={props.row.icon} fixedWidth /> : null,
  };

  return (
    <>
      {!props.row.password ? (
        <TextInput {...commonProps} />
      ) : (
        <PasswordInput
          {...commonProps}
          styles={{
            visibilityToggle: {
              color: theme.colors.dark[2],
            },
          }}
          visibilityToggleIcon={({ reveal }) => (
            <LibIcon
              icon={reveal ? 'eye-slash' : 'eye'}
              style={{ cursor: 'pointer' }}
              fixedWidth
            />
          )}
        />
      )}
    </>
  );
};

export default InputField;