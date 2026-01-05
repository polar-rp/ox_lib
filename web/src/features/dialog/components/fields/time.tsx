import { TimeInput } from '@mantine/dates';
import { Control, useController } from 'react-hook-form';
import { ITimeInput } from '../../../../typings/dialog';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ITimeInput;
  index: number;
  control: Control<FormValues>;
}

const TimeField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  const formatValue = (value: any) => {
    if (!value) return '';
    const date = new Date(value);
    return date.toISOString().substring(11, 16);
  };

  return (
    <TimeInput
      value={typeof controller.field.value === 'number' ? formatValue(controller.field.value) : controller.field.value}
      name={controller.field.name}
      ref={controller.field.ref}
      onBlur={controller.field.onBlur}
      onChange={(event) => {
        const val = event.currentTarget.value;
        if (!val) {
          controller.field.onChange(null);
          return;
        }
        const [hours, minutes] = val.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        controller.field.onChange(date.getTime());
      }}
      label={props.row.label}
      description={props.row.description}
      disabled={props.row.disabled}
      withAsterisk={props.row.required}
      leftSection={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
    />
  );
};

export default TimeField;