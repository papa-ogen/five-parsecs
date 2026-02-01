import { CampaignStatus } from '@five-parsecs/parsec-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, message, Space } from 'antd';

import { api } from '../../../services/api';
import { useCampaign } from '../../contexts/AppContext';

export function StartCampaign() {
  const { selectedCampaign } = useCampaign();
  const queryClient = useQueryClient();

  // Fetch crew data
  const { data: crew } = useQuery({
    queryKey: ['campaignCrew', selectedCampaign?.crewId],
    queryFn: () => api.campaignCrews.getById(selectedCampaign!.crewId),
    enabled: !!selectedCampaign?.crewId,
  });

  // Fetch all characters to count crew members
  const { data: allCharacters } = useQuery({
    queryKey: ['campaignCharacters'],
    queryFn: api.campaignCharacters.getAll,
  });

  const updateCampaignMutation = useMutation({
    mutationFn: (data: { status: CampaignStatus }) =>
      api.campaigns.update(selectedCampaign!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({
        queryKey: ['campaign', selectedCampaign?.id],
      });
    },
  });

  const updateCrewMutation = useMutation({
    mutationFn: (data: { credits: number }) =>
      api.campaignCrews.update(crew!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignCrew', crew?.id] });
    },
  });

  if (!selectedCampaign || !crew) {
    return null;
  }

  // Get crew members for this crew
  const crewMembers =
    allCharacters?.filter((char) => crew.characterIds.includes(char.id)) || [];

  const crewSize = selectedCampaign.crewSize ?? 6;
  const hasEnoughMembers = crewMembers.length === crewSize;

  // Check if there are no pending rolls
  const noPendingRolls =
    crew.gadgetCount === 0 &&
    crew.gearCount === 0 &&
    crew.lowTechWeaponCount === 0 &&
    crew.militaryWeaponCount === 0 &&
    crew.highTechWeaponCount === 0;

  // Check if ship is set up
  const hasShip = !!crew.ship;

  // Check if campaign is already started
  const isAlreadyStarted =
    selectedCampaign.status === CampaignStatus.IN_PROGRESS;

  const canStart =
    hasEnoughMembers && noPendingRolls && hasShip && !isAlreadyStarted;

  const handleStartCampaign = () => {
    if (!canStart) {
      return;
    }

    // Calculate credits: 1 per crew member
    const creditsToAdd = crewMembers.length;
    const newCredits = crew.credits + creditsToAdd;

    // Update campaign status
    updateCampaignMutation.mutate(
      { status: CampaignStatus.IN_PROGRESS },
      {
        onSuccess: () => {
          // Update crew credits
          updateCrewMutation.mutate(
            { credits: newCredits },
            {
              onSuccess: () => {
                message.success(
                  `Campaign started! Added ${creditsToAdd} credits (1 per crew member).`
                );
              },
              onError: (error) => {
                message.error(
                  `Failed to update credits: ${
                    error instanceof Error ? error.message : 'Unknown error'
                  }`
                );
              },
            }
          );
        },
        onError: (error) => {
          message.error(
            `Failed to start campaign: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        },
      }
    );
  };

  if (isAlreadyStarted) {
    return null;
  }

  return (
    <Card size="small" title="🚀 Start Campaign" type="inner">
      <Space orientation="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <strong>Requirements to start:</strong>
          <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
            <li style={{ color: hasEnoughMembers ? '#52c41a' : '#ff4d4f' }}>
              {hasEnoughMembers ? '✓' : '✗'} {crewSize} crew members (
              {crewMembers.length}/{crewSize})
            </li>
            <li style={{ color: noPendingRolls ? '#52c41a' : '#ff4d4f' }}>
              {noPendingRolls ? '✓' : '✗'} No pending item rolls
            </li>
            <li style={{ color: hasShip ? '#52c41a' : '#ff4d4f' }}>
              {hasShip ? '✓' : '✗'} Ship configured
            </li>
          </ul>
        </div>

        <Button
          type="primary"
          size="large"
          onClick={handleStartCampaign}
          disabled={!canStart}
          loading={
            updateCampaignMutation.isPending || updateCrewMutation.isPending
          }
        >
          Start Campaign
        </Button>

        {canStart && (
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            Starting the campaign will add {crewMembers.length} credit(s) to
            your crew.
          </div>
        )}
      </Space>
    </Card>
  );
}

export default StartCampaign;
