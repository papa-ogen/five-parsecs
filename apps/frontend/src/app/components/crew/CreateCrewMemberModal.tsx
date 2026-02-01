import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import type { IMotivation, ICharacterClass, IBackground, ISpeciesAbility } from '@five-parsecs/parsec-api';
import { useQuery } from '@tanstack/react-query';
import { App, Button, Card, Divider, Form, Input, Modal, Segmented, Space, Table, Tag } from 'antd';
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

interface CreateCrewMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CrewMemberData) => void;
}

type CrewSection = 'crewType' | 'background' | 'motivation' | 'class';

export function CreateCrewMemberModal({ open, onClose, onSubmit }: CreateCrewMemberModalProps) {
  const [name, setName] = useState('');
  const [activeSection, setActiveSection] = useState<CrewSection>('crewType');
  const { message } = App.useApp();

  // Crew member attributes (species type rolled on frontend; speciesId picked from species with that type)
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

  // When species type is rolled, pick a random species with that type and fetch abilities
  useEffect(() => {
    if (!rolledSpeciesType || !allSpecies) {
      setSpeciesId(null);
      setSpeciesAbilities(null);
      return;
    }

    const matching = allSpecies.filter(
      (s) => s.speciesTypeId === rolledSpeciesType.speciesTypeId
    );
    if (matching.length === 0) {
      setSpeciesId(null);
      setSpeciesAbilities(null);
      return;
    }
    const picked = matching[Math.floor(Math.random() * matching.length)];
    setSpeciesId(picked.id);
    const species = picked;

    if (species?.abilitiesId) {
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

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'crewType':
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
            <Space>
              {rolledSpeciesType ? (
                <Tag icon={<CheckCircleFilled />} color="success">
                  Crew Type: {rolledSpeciesType.name}
                </Tag>
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
            value={activeSection}
            onChange={(value) => setActiveSection(value as CrewSection)}
            options={[
              { label: 'Species Type', value: 'crewType' },
              { label: 'Background', value: 'background' },
              { label: 'Motivation', value: 'motivation' },
              { label: 'Class', value: 'class' },
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
