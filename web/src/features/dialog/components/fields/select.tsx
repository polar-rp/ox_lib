import { MultiSelect, Select } from '@mantine/core';
import { ISelect } from '../../../../typings';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ISelect;
  index: number;
  control: Control<FormValues>;
}

const SelectField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  const formattedData = props.row.options.map((opt) => ({
    value: String(opt.value),
    label: String(opt.label ?? opt.value),
    disabled: 'disabled' in opt ? (opt as any).disabled : false,
  }));

  const commonProps = {
    data: formattedData,
    value: controller.field.value,
    name: controller.field.name,
    ref: controller.field.ref,
    onBlur: controller.field.onBlur,
    onChange: controller.field.onChange,
    disabled: props.row.disabled,
    label: props.row.label,
    description: props.row.description,
    withAsterisk: props.row.required,
    clearable: props.row.clearable,
    searchable: props.row.searchable,
    leftSection: props.row.icon ? <LibIcon icon={props.row.icon} /> : null,
  };

  return (
    <>
      {props.row.type === 'select' ? (
        <Select {...commonProps} />
      ) : (
        props.row.type === 'multi-select' && (
          <MultiSelect 
            {...commonProps} 
            maxValues={props.row.maxSelectedValues} 
          />
        )
      )}
    </>
  );
};

export default SelectField;