import { RocketOutlined } from '@ant-design/icons';
import { Layout, Typography, Button, Card, Space } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          <RocketOutlined style={{ marginRight: '8px' }} />
          Five Parsecs From Home
        </div>
      </Header>
      
      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
              <Title level={2}>Welcome to Five Parsecs!</Title>
              <Paragraph>
                Your crew management and character creation system for Five Parsecs From Home.
              </Paragraph>
              <Button type="primary" size="large">
                Create New Character
              </Button>
            </Card>

            <Card title="Quick Start">
              <Space direction="vertical">
                <Paragraph>
                  • API running on <code>http://localhost:9999</code>
                </Paragraph>
                <Paragraph>
                  • Frontend running on <code>http://localhost:5555</code>
                </Paragraph>
                <Paragraph>
                  • Ant Design v6 installed and configured
                </Paragraph>
              </Space>
            </Card>
          </Space>
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Five Parsecs Character Manager ©2026
      </Footer>
    </Layout>
  );
}

export default App;
