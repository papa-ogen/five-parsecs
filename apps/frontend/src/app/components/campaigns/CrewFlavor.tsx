import { CampaignStatus, type ICampaignCrew } from '@five-parsecs/parsec-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, message, Space, Typography } from 'antd';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

const { Text } = Typography;

export function CrewFlavor() {
  const { selectedCampaign } = useCampaign();
  const queryClient = useQueryClient();

  const { data: crew } = useQuery({
    queryKey: ['campaignCrew', selectedCampaign?.crewId],
    queryFn: () => api.campaignCrews.getById(selectedCampaign!.crewId),
    enabled: !!selectedCampaign?.crewId,
  });

  const { data: weMetThroughOptions } = useQuery({
    queryKey: ['crewFlavor', 'weMetThrough'],
    queryFn: () => api.crewFlavor.getWeMetThrough(),
    enabled: !!selectedCampaign?.crewId,
  });

  const { data: characterizedAsOptions } = useQuery({
    queryKey: ['crewFlavor', 'characterizedAs'],
    queryFn: () => api.crewFlavor.getCharacterizedAs(),
    enabled: !!selectedCampaign?.crewId,
  });

  const updateCrewMutation = useMutation({
    mutationFn: (data: Partial<ICampaignCrew>) =>
      api.campaignCrews.update(crew!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignCrew', crew?.id] });
    },
  });

  const crewSize = selectedCampaign?.crewSize ?? 6;
  const hasEnoughMembers = (crew?.characterIds?.length ?? 0) >= crewSize;
  const isCampaignStarted = selectedCampaign?.status === CampaignStatus.IN_PROGRESS;

  if (!selectedCampaign || !crew || !hasEnoughMembers || isCampaignStarted) {
    return null;
  }

  const handleRollWeMetThrough = () => {
    if (!weMetThroughOptions?.length) {
      message.warning('No options available');
      return;
    }
    const rolled = weMetThroughOptions[Math.floor(Math.random() * weMetThroughOptions.length)];
    updateCrewMutation.mutate(
      { weMetThrough: rolled.name },
      {
        onSuccess: () => message.success(`How we met: ${rolled.name}`),
        onError: () => message.error('Failed to save'),
      }
    );
  };

  const handleRollCharacterizedAs = () => {
    if (!characterizedAsOptions?.length) {
      message.warning('No options available');
      return;
    }
    const rolled = characterizedAsOptions[Math.floor(Math.random() * characterizedAsOptions.length)];
    updateCrewMutation.mutate(
      { caracterizedAs: rolled.name },
      {
        onSuccess: () => message.success(`We are best characterized as: ${rolled.name}`),
        onError: () => message.error('Failed to save'),
      }
    );
  };

  return (
    <Card size="small" title="Crew Flavor (optional)" type="inner">
      <Space orientation="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text strong>How we met</Text>
          {crew.weMetThrough ? (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary">{crew.weMetThrough}</Text>
            </div>
          ) : null}
          <Button
            type="default"
            size="small"
            onClick={handleRollWeMetThrough}
            disabled={updateCrewMutation.isPending}
            loading={updateCrewMutation.isPending}
            style={{ marginTop: 8 }}
          >
            Roll once
          </Button>
        </div>
        <div>
          <Text strong>We are best characterized as</Text>
          {crew.caracterizedAs ? (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary">{crew.caracterizedAs}</Text>
            </div>
          ) : null}
          <Button
            type="default"
            size="small"
            onClick={handleRollCharacterizedAs}
            disabled={updateCrewMutation.isPending}
            loading={updateCrewMutation.isPending}
            style={{ marginTop: 8 }}
          >
            Roll once
          </Button>
        </div>
      </Space>
    </Card>
  );
}

export default CrewFlavor;
