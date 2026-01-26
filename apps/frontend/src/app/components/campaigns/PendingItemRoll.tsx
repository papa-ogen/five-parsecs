import { Button, Space, Statistic } from 'antd';

interface PendingItemRollProps {
  title: string;
  count: number;
  onRoll: () => void;
}

export function PendingItemRoll({ title, count, onRoll }: PendingItemRollProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <Space orientation="vertical" size="small">
      <Statistic title={title} value={count} />
      <Button type="primary" onClick={onRoll}>
        Roll {title}
      </Button>
    </Space>
  );
}

export default PendingItemRoll;
