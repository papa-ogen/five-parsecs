import { RocketOutlined } from '@ant-design/icons';
import { Card, Layout, Space, Typography } from 'antd';

import CampaignDetails from './components/campaigns/CampaignDetails';
import Campaigns from './components/campaigns/Campaigns';
import CampaignShip from './components/campaigns/CampaignShip';
import CreateCampaign from './components/campaigns/CreateCampaign';
import CrewDetails from './components/campaigns/CrewDetails';
import CrewTable from './components/campaigns/CrewTable';
import StartCampaign from './components/campaigns/StartCampaign';
import Crew from './components/crew/Crew';
import { AppProvider } from './contexts/AppContext';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export function App() {
  return (
    <AppProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            <RocketOutlined style={{ marginRight: '8px' }} />
            Five Parsecs From Home
          </div>
        </Header>
        
        <Content style={{ padding: '50px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
              
              <CampaignShip />
              
              <Crew />

              <CrewTable />

              <StartCampaign />
            </Space>
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
