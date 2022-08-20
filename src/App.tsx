import React, { useState } from 'react';
import logo from './logo.svg';
import { Button, Modal } from 'antd';
import YTable from './components/table';
import Cascader from './components/cascader';
// import './App.less';
import './App.css';

const MyComponents = {
  DatePicker: function DatePicker(props: any) {
    return (
      <div className={props.className}>
        Imagine a {props.color} datepicker here.
      </div>
    );
  },
};

// function BlueDatePicker() {
//   return <MyComponents.DatePicker color="blue" />;
// }
const BlueDatePicker: React.FC<{ className: string }> = ({ className }) => {
  return <MyComponents.DatePicker className={className} color="blue" />;
};

// ----------------------

function PhotoStory() {
  return <div>This is photo!</div>;
}
function VideoStory() {
  return <div>This is video!</div>;
}
const components: Record<string, any> = {
  photo: PhotoStory,
  video: VideoStory,
};

function Story(props: any) {
  const SpecificStory = components[props.storyType];
  return <SpecificStory />;
}

// ----------------------

const YButton = (props: any) => {
  const { kind, ...other } = props;
  const className = kind === 'primary' ? 'PrimaryButton' : 'SecondaryButton';
  return <Button className={className} {...other} />;
};

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // ---------------- Cascader
  const [options, setOptions] = useState([
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
            },
            {
              value: 'yeo',
              label: 'Yeo Key',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <main className="App-main">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <Button className="mt12" type="primary">
          Button
        </Button>
        <div className="mt12">
          <YTable />
        </div>

        <BlueDatePicker className="mt12" />

        <div className="mt12">
          <Story storyType="photo" />
        </div>
        <div className="mt12">
          <Story storyType="video" />
        </div>

        <div className="mt12" style={{ fontSize: '0' }}>
          <YButton kind="primary" onClick={() => console.log('clicked!')}>
            Hello World!
          </YButton>
          <Button
            style={{ marginLeft: '12px' }}
            type="primary"
            onClick={showModal}
          >
            级联
          </Button>
        </div>
      </main>

      <Modal
        title="级联组件"
        width="68%"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Cascader options={options} />
      </Modal>
    </div>
  );
}

export default App;
