import { RocketOutlined } from '@ant-design/icons';
import { Card, Layout, Space, Typography } from 'antd';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import BattleHelper from './battle/BattleHelper';
import CampaignDetails from './components/campaigns/CampaignDetails';
import Campaigns from './components/campaigns/Campaigns';
import CampaignShip from './components/campaigns/CampaignShip';
import CreateCampaign from './components/campaigns/CreateCampaign';
import CrewDetails from './components/campaigns/CrewDetails';
import CrewFlavor from './components/campaigns/CrewFlavor';
import StartCampaign from './components/campaigns/StartCampaign';
import Crew from './components/crew/Crew';
import { AppProvider } from './contexts/AppContext';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function HomePage() {
  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Title level={2}>Welcome to Five Parsecs!</Title>
        <Paragraph>
          Your crew management and character creation system for Five Parsecs From Home.
        </Paragraph>

        <Space align="end">
          <Campaigns />
          <CreateCampaign />
        </Space>
      </Card>

      <CampaignDetails />

      <CrewDetails />

      <Crew />

      <CrewFlavor />

      <CampaignShip />

      <StartCampaign />
    </Space>
  );
}

const headerLinkStyle = {
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: 14,
  marginLeft: 24,
};
const headerLinkActiveStyle = { ...headerLinkStyle, color: '#fff', fontWeight: 600 };

export function App() {
  const location = useLocation();

  return (
    <AppProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#001529',
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <Link
            to="/"
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RocketOutlined style={{ marginRight: 8 }} />
            Five Parsecs From Home
          </Link>
          <Space size="middle" style={{ marginLeft: 32 }}>
            <Link
              to="/"
              style={location.pathname === '/' ? headerLinkActiveStyle : headerLinkStyle}
            >
              Campaign
            </Link>
            <Link
              to="/battle-helper"
              style={
                location.pathname === '/battle-helper'
                  ? headerLinkActiveStyle
                  : headerLinkStyle
              }
            >
              Battle Helper
            </Link>
          </Space>
        </Header>

        <Content style={{ padding: '50px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/battle-helper" element={<BattleHelper />} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Five Parsecs Character Manager ©2026
        </Footer>
      </Layout>
    </AppProvider>
  );
}

export default App;
