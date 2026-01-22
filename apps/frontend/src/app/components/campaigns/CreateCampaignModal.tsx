import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Modal } from 'antd';
import { Controller, useForm } from 'react-hook-form';

import { campaignSchema, type CampaignFormData } from './campaignSchema';

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CampaignFormData) => Promise<void>;
}

export function CreateCampaignModal({ open, onClose, onSubmit }: CreateCampaignModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmitForm = async (data: CampaignFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Create New Campaign"
      open={open}
      onOk={handleSubmit(onSubmitForm)}
      onCancel={handleCancel}
      confirmLoading={isSubmitting}
      okText="Create Campaign"
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Campaign Name <span style={{ color: 'red' }}>*</span>
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter campaign name"
                status={errors.name ? 'error' : ''}
              />
            )}
          />
          {errors.name && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {errors.name.message}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={4}
                placeholder="Enter campaign description (optional)"
                status={errors.description ? 'error' : ''}
              />
            )}
          />
          {errors.description && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {errors.description.message}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default CreateCampaignModal;
