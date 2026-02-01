import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import type { IMotivation, ICharacterClass, IBackground, ISpeciesAbility } from '@five-parsecs/parsec-api';
import { useQuery } from '@tanstack/react-query';
import { App, Button, Card, Divider, Form, Input, Modal, Segmented, Space, Table, Tag, Typography } from 'antd';
import { useState, useEffect } from 'react';

import { api } from '../../../services/api';

import BackgroundRoller from './BackgroundRoller';
import ClassRoller from './ClassRoller';
import CrewMemberDescription from './CrewMemberDescription';
import CrewTypeRoller, { type RolledSpeciesType } from './CrewTypeRoller';
import MotivationRoller from './MotivationRoller';

export interface CrewMemberData {
  name: string;
  speciesId: string;
  background: IBackground | null;
  motivation: IMotivation | null;
  characterClass: ICharacterClass | null;
}

const HUMAN_SPECIES_ID = '1';

interface CreateCrewMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CrewMemberData) => void;
  /** When 'first-timer', auto-select Human as species. */
  crewCompositionMethod?: string;
}

type CrewSection = 'crewType' | 'background' | 'motivation' | 'class';

export function CreateCrewMemberModal({
  open,
  onClose,
  onSubmit,
  crewCompositionMethod,
}: CreateCrewMemberModalProps) {
  const [name, setName] = useState('');
  const [activeSection, setActiveSection] = useState<CrewSection>('crewType');
  const { message } = App.useApp();

  // Crew member attributes: we always resolve to a concrete speciesId (never store speciesTypeId).
  // Human/Bot: pick random species with that type. Primary Alien/Strange: speciesId from roller.
  const [rolledSpeciesType, setRolledSpeciesType] = useState<RolledSpeciesType | null>(null);
  const [speciesId, setSpeciesId] = useState<string | null>(null);
  const [background, setBackground] = useState<IBackground | null>(null);
  const [motivation, setMotivation] = useState<IMotivation | null>(null);
  const [characterClass, setCharacterClass] = useState<ICharacterClass | null>(null);
  const [speciesAbilities, setSpeciesAbilities] = useState<ISpeciesAbility | null>(null);

  // Fetch all species
  const { data: allSpecies } = useQuery({
    queryKey: ['species'],
    queryFn: api.species.getAll,
  });

  // First-timer: auto-select Human and skip species roll section
  useEffect(() => {
    if (open && crewCompositionMethod === 'first-timer') {
      setRolledSpeciesType({
        speciesTypeId: '1',
        name: 'Human',
        speciesId: HUMAN_SPECIES_ID,
      });
      setActiveSection('background');
    }
  }, [open, crewCompositionMethod]);

  const handleSubmit = () => {
    if (!name.trim()) {
      message.error('Please enter a crew member name');
      return;
    }
    if (!speciesId) {
      message.error('Please roll for crew type');
      return;
    }

    onSubmit({
      name,
      speciesId,
      background,
      motivation,
      characterClass,
    });

    // Reset form
    setName('');
    setRolledSpeciesType(null);
    setSpeciesId(null);
    setBackground(null);
    setMotivation(null);
    setCharacterClass(null);
    setActiveSection('crewType');
  };

  // Check if all required data is generated
  const isComplete =
    name.trim() && speciesId && background && motivation && characterClass;

  const handleCancel = () => {
    setName('');
    setRolledSpeciesType(null);
    setSpeciesId(null);
    setBackground(null);
    setMotivation(null);
    setCharacterClass(null);
    setActiveSection('crewType');
    onClose();
  };

  // Resolve rolled type to a concrete speciesId (saved on character; we never persist speciesTypeId)
  useEffect(() => {
    if (!rolledSpeciesType || !allSpecies) {
      setSpeciesId(null);
      setSpeciesAbilities(null);
      return;
    }

    let species: (typeof allSpecies)[number] | undefined;

    if (rolledSpeciesType.speciesId) {
      // Primary Alien or Strange Character: use the species we picked from primaryAliens/strangeCharacters
      species = allSpecies.find((s) => s.id === rolledSpeciesType.speciesId);
    }

    if (!species) {
      // No speciesId, or species not found (e.g. Human/Bot, or fallback): pick random species with this type
      const matching = allSpecies.filter(
        (s) => s.speciesTypeId === rolledSpeciesType.speciesTypeId
      );
      if (matching.length === 0) {
        setSpeciesId(null);
        setSpeciesAbilities(null);
        return;
      }
      species = matching[Math.floor(Math.random() * matching.length)];
    }

    setSpeciesId(species.id);

    if (species.abilitiesId) {
      api.speciesAbilities
        .getById(species.abilitiesId)
        .then((abilities) => setSpeciesAbilities(abilities))
        .catch((err) => {
          console.error('Failed to fetch species abilities:', err);
          setSpeciesAbilities(null);
        });
    } else {
      setSpeciesAbilities(null);
    }
  }, [rolledSpeciesType, allSpecies]);

  // Calculate stats based on species abilities
  const stats = speciesAbilities ? {
    reactions: speciesAbilities.reactions,
    speed: speciesAbilities.speed,
    combat: speciesAbilities.combat,
    toughness: speciesAbilities.toughness,
    savvy: speciesAbilities.savvy,
  } : {
    reactions: 0,
    speed: 0,
    combat: 0,
    toughness: 0,
    savvy: 0,
  };

  const isFirstTimer = crewCompositionMethod === 'first-timer';

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'crewType':
        if (isFirstTimer) {
          return (
            <Card size="small" style={{ background: '#fafafa' }}>
              <Typography.Text type="secondary">
                First-timer campaign: all crew members are Human. Continue with
                Background, Motivation, and Class below.
              </Typography.Text>
            </Card>
          );
        }
        return (
          <CrewTypeRoller
            selectedSpeciesType={rolledSpeciesType}
            onSelect={setRolledSpeciesType}
          />
        );
      case 'background':
        return (
          <BackgroundRoller
            selectedBackground={background}
            onSelect={setBackground}
          />
        );
      case 'motivation':
        return (
          <MotivationRoller
            selectedMotivation={motivation}
            onSelect={setMotivation}
          />
        );
      case 'class':
        return (
          <ClassRoller
            selectedClass={characterClass}
            onSelect={setCharacterClass}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Create Crew Member"
      open={open}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          disabled={!isComplete}
        >
          Create
        </Button>,
      ]}
    >
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Form layout="vertical">
          <Form.Item label="Name" required>
            <Input
              placeholder="Enter crew member name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onPressEnter={handleSubmit}
              autoFocus
            />
          </Form.Item>
        </Form>

        <Table
          size="small"
          pagination={false}
          columns={[
            { title: 'Reactions', dataIndex: 'reactions', key: 'reactions', align: 'center' },
            { title: 'Speed', dataIndex: 'speed', key: 'speed', align: 'center' },
            { title: 'Combat', dataIndex: 'combat', key: 'combat', align: 'center' },
            { title: 'Toughness', dataIndex: 'toughness', key: 'toughness', align: 'center' },
            { title: 'Savvy', dataIndex: 'savvy', key: 'savvy', align: 'center' },
          ]}
          dataSource={[
            { 
              key: '1', 
              reactions: stats.reactions, 
              speed: stats.speed, 
              combat: stats.combat, 
              toughness: stats.toughness, 
              savvy: stats.savvy 
            },
          ]}
        />

        <Card
          size="small" 
          title="Character Generation Progress"
          style={{ background: '#fafafa' }}
        >
          <Space orientation="vertical" size="small" style={{ width: '100%' }}>
            <Space wrap align="start">
              {rolledSpeciesType ? (
                <>
                <Space orientation="vertical" size={0}>
                  <Tag icon={<CheckCircleFilled />} color="success">
                    Crew Type:{' '}
                    {speciesId && allSpecies?.length
                      ? allSpecies.find((s) => s.id === speciesId)?.name ?? rolledSpeciesType.name
                      : rolledSpeciesType.name}
                  </Tag>
                  {speciesId && allSpecies?.length && (
                    <Typography.Text type="secondary" style={{ fontSize: '12px', display: 'block', maxWidth: 320 }}>
                      {allSpecies.find((s) => s.id === speciesId)?.description}
                    </Typography.Text>
                  )}
                </Space>
                    </>
              ) : (
                <Tag icon={<CloseCircleFilled />} color="default">
                  Crew Type: Not rolled
                </Tag>
              )}
            </Space>
            <Space>
              {background ? (
                <>
                <Tag icon={<CheckCircleFilled />} color="success">
                  Background: {background.name} 
                </Tag>
                <CrewMemberDescription data={background} />
                </>
              ) : (
                <Tag icon={<CloseCircleFilled />} color="default">
                  Background: Not rolled
                </Tag>
              )}
            </Space>
            <Space>
              {motivation ? (
                <>
                <Tag icon={<CheckCircleFilled />} color="success">
                  Motivation: {motivation.name}
                </Tag>
                <CrewMemberDescription data={motivation} />
                </>
              ) : (
                <Tag icon={<CloseCircleFilled />} color="default">
                  Motivation: Not rolled
                </Tag>
              )}
            </Space>
            <Space>
              {characterClass ? (
                <>
                <Tag icon={<CheckCircleFilled />} color="success">
                  Class: {characterClass.name}
                </Tag>
                <CrewMemberDescription data={characterClass} />
                </>
              ) : (
                <Tag icon={<CloseCircleFilled />} color="default">
                  Class: Not rolled
                </Tag>
              )}
            </Space>
          </Space>
        </Card>

        <Divider />

        <div>
          <Segmented
            value={
              isFirstTimer && activeSection === 'crewType'
                ? 'background'
                : activeSection
            }
            onChange={(value) => setActiveSection(value as CrewSection)}
            options={[
              ...(!isFirstTimer
                ? [{ label: 'Species Type', value: 'crewType' as CrewSection }]
                : []),
              { label: 'Background', value: 'background' as CrewSection },
              { label: 'Motivation', value: 'motivation' as CrewSection },
              { label: 'Class', value: 'class' as CrewSection },
            ]}
            block
          />
        </div>

        <div style={{ minHeight: '200px' }}>
          {renderSectionContent()}
        </div>
      </Space>
    </Modal>
  );
}

export default CreateCrewMemberModal;
