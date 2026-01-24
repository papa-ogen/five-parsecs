import type { IMotivation, ICharacterClass, ICrewType, IBackground } from '@five-parsecs/parsec-api';
import { App, Button, Divider, Form, Input, Modal, Segmented, Space } from 'antd';
import { useState } from 'react';

import BackgroundRoller from './BackgroundRoller';
import ClassRoller from './ClassRoller';
import CrewTypeRoller from './CrewTypeRoller';
import MotivationRoller from './MotivationRoller';

export interface CrewMemberData {
  name: string;
  crewType: ICrewType | null;
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

  // Crew member attributes
  const [crewType, setCrewType] = useState<ICrewType | null>(null);
  const [background, setBackground] = useState<IBackground | null>(null);
  const [motivation, setMotivation] = useState<IMotivation | null>(null);
  const [characterClass, setCharacterClass] = useState<ICharacterClass | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      message.error('Please enter a crew member name');
      return;
    }
    
    onSubmit({
      name,
      crewType,
      background,
      motivation,
      characterClass,
    });
    
    // Reset form
    setName('');
    setCrewType(null);
    setBackground(null);
    setMotivation(null);
    setCharacterClass(null);
    setActiveSection('crewType');
  };

  // Check if all required data is generated
  const isComplete = name.trim() && crewType && background && motivation && characterClass;

  const handleCancel = () => {
    setName('');
    setCrewType(null);
    setBackground(null);
    setMotivation(null);
    setCharacterClass(null);
    setActiveSection('crewType');
    onClose();
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'crewType':
        return (
          <CrewTypeRoller
            selectedCrewType={crewType}
            onSelect={setCrewType}
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
              { label: 'Crew Type', value: 'crewType' },
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
