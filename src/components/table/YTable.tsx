import { Button, Space, Table } from 'antd';
// import { Button, Space, Table, Tag, Tooltip } from 'antd';
// const { Column } = Table;
const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const YTable = () => (
  <Table
    dataSource={data}
    columns={[
      {
        key: 'firstName',
        dataIndex: 'firstName',
        title: 'First Name',
      },
      {
        key: 'lastName',
        dataIndex: 'lastName',
        title: 'Last Name',
      },
      {
        key: 'age',
        dataIndex: 'age',
        title: 'Age',
        width: '10%',
      },
      {
        key: 'action',
        dataIndex: 'action',
        title: 'Action',
        render: (_: any, record: any) => {
          return (
            <Space size="middle">
              <Button type="link" block>
                Invite {record.lastName}
              </Button>
              <Button type="link" block>
                Delete
              </Button>
            </Space>
          );
        },
      },
    ]}
  >
    {/* <Column title="First Name" dataIndex="firstName" key="firstName" />
    <Column title="Last Name" dataIndex="lastName" key="lastName" />
    <Column title="Age" dataIndex="age" key="age" width="10%" />
    <Column
      title="Address"
      dataIndex="address"
      key="address"
      ellipsis={{
        showTitle: false,
      }}
      render={(address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      )}
    />
    <Column
      title="Tags"
      dataIndex="tags"
      key="tags"
      render={(tags) => (
        <>
          {tags.map((tag: any) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      )}
    />
    <Column
      title="Action"
      key="action"
      render={(record) => (
        <Space size="middle">
          <Button type="link" block>
            Invite {record.lastName}
          </Button>
          <Button type="link" block>
            Delete
          </Button>
        </Space>
      )}
    /> */}
  </Table>
);

export default YTable;
