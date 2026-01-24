import type { IOrigin, IMotivation, ICharacterClass, ISpecialCircumstance } from '@five-parsecs/parsec-api';
import { App, Button, Divider, Form, Input, Modal, Segmented, Space } from 'antd';
import { useState } from 'react';

import CircumstancesRoller from './CircumstancesRoller';
import ClassRoller from './ClassRoller';
import MotivationRoller from './MotivationRoller';
import OriginRoller from './OriginRoller';

export interface CrewMemberData {
  name: string;
  origin: IOrigin | null;
  motivation: IMotivation | null;
  characterClass: ICharacterClass | null;
  circumstances: ISpecialCircumstance | null;
}

interface CreateCrewMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CrewMemberData) => void;
}

type CrewSection = 'origin' | 'motivation' | 'class' | 'circumstances';

export function CreateCrewMemberModal({ open, onClose, onSubmit }: CreateCrewMemberModalProps) {
  const [name, setName] = useState('');
  const [activeSection, setActiveSection] = useState<CrewSection>('origin');
  const { message } = App.useApp();

  // Crew member attributes
  const [origin, setOrigin] = useState<IOrigin | null>(null);
  const [motivation, setMotivation] = useState<IMotivation | null>(null);
  const [characterClass, setCharacterClass] = useState<ICharacterClass | null>(null);
  const [circumstances, setCircumstances] = useState<ISpecialCircumstance | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      message.error('Please enter a crew member name');
      return;
    }
    
    onSubmit({
      name,
      origin,
      motivation,
      characterClass,
      circumstances,
    });
    
    // Reset form
    setName('');
    setOrigin(null);
    setMotivation(null);
    setCharacterClass(null);
    setCircumstances(null);
    setActiveSection('origin');
  };

  // Check if all required data is generated
  const isComplete = name.trim() && origin && motivation && characterClass && circumstances;

  const handleCancel = () => {
    setName('');
    setOrigin(null);
    setMotivation(null);
    setCharacterClass(null);
    setCircumstances(null);
    setActiveSection('origin');
    onClose();
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'origin':
        return (
          <OriginRoller
            selectedOrigin={origin}
            onSelect={setOrigin}
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
      case 'circumstances':
        return (
          <CircumstancesRoller
            selectedCircumstance={circumstances}
            onSelect={setCircumstances}
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
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
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

        <Divider />

        <div>
          <Segmented
            value={activeSection}
            onChange={(value) => setActiveSection(value as CrewSection)}
            options={[
              { label: 'Origin', value: 'origin' },
              { label: 'Motivation', value: 'motivation' },
              { label: 'Class', value: 'class' },
              { label: 'Circumstances', value: 'circumstances' },
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
