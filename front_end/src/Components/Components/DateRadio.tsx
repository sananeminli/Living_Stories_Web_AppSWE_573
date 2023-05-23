import { Radio } from 'antd';
import React from 'react';

type Option = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  options: Option[];
  onChange: (value: string) => void;
  value: string;
};

export function RadioGroup({ options, onChange, value }: RadioGroupProps) {
  return (
    <Radio.Group options={options} onChange={e => onChange(e.target.value)} value={value} />
  );
}
