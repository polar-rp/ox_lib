import { IDateInput } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import { DatePickerInput, DateValue, DatesRangeValue } from '@mantine/dates';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: IDateInput;
  index: number;
  control: Control<FormValues>;
}

const dateValueToTimestamp = (date: DateValue): number | null => {
  if (!date) return null;
  if (typeof date === 'string') return new Date(date).getTime();
  return date.getTime();
};

const DateField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required, min: props.row.min, max: props.row.max },
  });

  return (
    <>
      {props.row.type === 'date' && (
        <DatePickerInput
          type="default"
          value={controller.field.value ? new Date(controller.field.value) : null}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={(date) => controller.field.onChange(dateValueToTimestamp(date))}
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          valueFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          leftSection={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
        />
      )}
      {props.row.type === 'date-range' && (
        <DatePickerInput
          type="range"
          value={
            controller.field.value && Array.isArray(controller.field.value) && controller.field.value[0]
              ? (controller.field.value.map((date: number) => new Date(date)) as [Date, Date])
              : [null, null]
          }
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={(dates: DatesRangeValue) => {
            if (dates && Array.isArray(dates)) {
              controller.field.onChange(dates.map(dateValueToTimestamp));
            } else {
              controller.field.onChange(null);
            }
          }}
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          valueFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          leftSection={props.row.icon && <LibIcon icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
        />
      )}
    </>
  );
};

export default DateField;
