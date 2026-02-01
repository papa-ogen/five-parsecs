import type { UnitSystem } from '@five-parsecs/parsec-api';
import { Card, Select, Space, Typography } from 'antd';

import { useSettings } from '../contexts/AppContext';

const UNIT_SYSTEM_OPTIONS: { value: UnitSystem; label: string }[] = [
  { value: 'imperial', label: 'Imperial (ft)' },
  { value: 'metric', label: 'Metric (cm)' },
];

const Settings = () => {
  const { unitSystem, setUnitSystem } = useSettings();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Settings
        </Typography.Title>
        <Space align="center" size="middle">
          <Typography.Text type="secondary">Unit system</Typography.Text>
          <Select<UnitSystem>
            value={unitSystem}
            onChange={setUnitSystem}
            options={UNIT_SYSTEM_OPTIONS}
            style={{ minWidth: 140 }}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default Settings;
