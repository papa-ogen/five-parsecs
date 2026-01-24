import { TrophyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ReactNode } from 'react';

interface DiceRollerProps {
  isRolling: boolean;
  rollingText?: string;
  resultText?: string;
  resultIcon?: ReactNode;
  onRoll: () => void;
  disabled?: boolean;
  buttonText?: string;
}

export function DiceRoller({
  isRolling,
  rollingText = '',
  resultText,
  resultIcon,
  onRoll,
  disabled = false,
  buttonText,
}: DiceRollerProps) {
  const getButtonText = () => {
    if (buttonText) return buttonText;
    if (isRolling) return 'Rolling...';
    if (resultText) return 'Roll Again';
    return 'Roll the Dice!';
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Dice Rolling Area */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '40px',
          marginBottom: '24px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        }}
      >
        {isRolling ? (
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              animation: 'pulse 0.5s infinite',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🎰 {rollingText} 🎰
          </div>
        ) : resultText ? (
          <div>
            {resultIcon || (
              <TrophyOutlined
                style={{
                  fontSize: '48px',
                  color: '#ffd700',
                  marginBottom: '16px',
                }}
              />
            )}
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
              {resultText}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '48px', color: 'white' }}>
            🎲
          </div>
        )}
      </div>

      {/* Roll Button */}
      <Button
        type="primary"
        size="large"
        onClick={onRoll}
        disabled={isRolling || disabled}
        loading={isRolling}
        style={{
          fontSize: '18px',
          height: '50px',
          paddingLeft: '40px',
          paddingRight: '40px',
          marginBottom: '24px',
        }}
      >
        {getButtonText()}
      </Button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export default DiceRoller;
