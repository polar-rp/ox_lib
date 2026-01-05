import { Button, Group, Modal, Stack } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';

import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';

import { useFieldArray, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

export type FormValues = { test: { value: any }[] };

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<FormValues>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
  setFields(data);
  setVisible(true);

  fieldForm.remove();

  data.rows.forEach((row, index) => {
    let defaultValue: any = null;

    if (row.type === 'checkbox') {
      defaultValue = row.checked ?? false;
    } else if (
      row.type === 'date' ||
      row.type === 'date-range' ||
      row.type === 'time'
    ) {
      if (row.default === true) {
        defaultValue = new Date().getTime();
      } else if (Array.isArray(row.default)) {
        defaultValue = row.default.map((d: string) => new Date(d).getTime());
      } else if (row.default) {
        defaultValue = new Date(row.default as string).getTime();
      }
    } else {
      defaultValue = ('default' in row && row.default !== undefined) ? row.default : null;
    }

    fieldForm.insert(index, { value: defaultValue });

    if ((row.type === 'select' || row.type === 'multi-select') && row.options) {
      row.options = (row.options as any[]).map((option) =>
        typeof option === 'string' || !option.label
          ? { value: option.value || option, label: option.label || option.value || option }
          : option
      ) as OptionValue[];
    }
  });
});

  useNuiEvent('closeInputDialog', () => handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);

    const values: any[] = [];

    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];
      let value = data.test[i]?.value;

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString && value != null) {
        if (Array.isArray(value)) {
          value = value.map((timestamp: number) => dayjs(timestamp).format(row.format || 'DD/MM/YYYY'));
        } else {
          value = dayjs(value).format(row.format || 'DD/MM/YYYY');
        }
      }

      values.push(value);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  const allowCancel = fields.options?.allowCancel !== false;

  return (
    <Modal
      opened={visible}
      onClose={() => handleClose(allowCancel ? false : true)}
      centered
      closeOnEscape={allowCancel}
      closeOnClickOutside={false}
      size={fields.options?.size || 'xs'}
      withCloseButton={false}
      overlayProps={{ opacity: 0.5 }}
      transitionProps={{ transition: 'fade', duration: 150 }}
      title={fields.heading}

    >
      <form onSubmit={onSubmit}>
        <Stack>
          {fieldForm.fields.map((item, index) => {
            const row = fields.rows[index];
            if (!row) return null;

            return (
              <React.Fragment key={item.id}>
                {row.type === 'input' && (
                  <InputField
                    register={form.register(`test.${index}.value`, { required: row.required })}
                    row={row}
                    index={index}
                  />
                )}

                {row.type === 'checkbox' && (
                  <CheckboxField
                    register={form.register(`test.${index}.value`, { required: row.required })}
                    row={row}
                    index={index}
                  />
                )}

                {(row.type === 'select' || row.type === 'multi-select') && (
                  <SelectField row={row} index={index} control={form.control} />
                )}

                {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}

                {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}

                {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}

                {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}

                {(row.type === 'date' || row.type === 'date-range') && (
                  <DateField control={form.control} row={row} index={index} />
                )}

                {row.type === 'textarea' && (
                  <TextareaField
                    register={form.register(`test.${index}.value`, { required: row.required })}
                    row={row}
                    index={index}
                  />
                )}
              </React.Fragment>
            );
          })}

          <Group justify="flex-end" gap={10}>
            <Button
              variant="default"
              onClick={() => handleClose(true)}
              disabled={!allowCancel}
              mr={3}
            >
              {locale.ui.cancel}
            </Button>

            <Button variant="filled" type="submit">
              {locale.ui.confirm}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default InputDialog;