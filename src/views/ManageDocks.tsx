import React, { useState, useRef } from 'react';
import { Table, Row, Col, Modal, Form, DatePicker, Select, Switch, notification, Button, Input, Space, Layout, theme } from 'antd';
import { DeleteTwoTone, SearchOutlined, FileAddTwoTone, ReconciliationTwoTone } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import type { FilterConfirmProps, TableRowSelection } from 'antd/es/table/interface';

import { useDockList } from '../hooks/useDockList';
import { DataIndex, Dock, DockItems, NotificationType } from '../interfaces/DockInterfaces';
import { convertDateFormat, generateRandomString } from '../helpers/utils';
import { confirmDeleteItem, openDeleteModal } from './DockHandlers';


const ManageDocks = () => {
    const searchInput = useRef<any>(null);

    const [items, setItems] = useState<DockItems>(useDockList());
    const [itemsSearch, setItemsSearch] = useState<DockItems | null>();
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState<string>('');
    const [interactionItem, setInteractionItem] = useState<Dock | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const { Search } = Input;
    const { Option } = Select;
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const { Header, Content } = Layout;
    const { token: { colorBgContainer }, } = theme.useToken();

    const openNotificationWithIcon = (type: NotificationType, message: string, description: string) => {
        api[type]({
            message,
            description,
        });
    };

    const getColumnSearchProps = (
        dataIndex: DataIndex
    ) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value: any, record: Dock) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            sorter: {
                compare: (a: any, b: any) => {
                    a = a.lastSchedulingDate.toLowerCase()
                    b = b.lastSchedulingDate.toLowerCase()
                    return a > b ? -1 : b > a ? 1 : 0
                }
            },
            ...getColumnSearchProps('id')
        },
        {
            title: 'Última Fecha Programada',
            dataIndex: 'lastSchedulingDate',
            key: 'lastSchedulingDate',
            render: (text: string) => <div>{convertDateFormat(text)} <br /> {convertDateFormat(text, true)}</div>,
            sorter: {
                compare: (a: any, b: any) => {
                    a = a.lastSchedulingDate.toLowerCase()
                    b = b.lastSchedulingDate.toLowerCase()
                    return a > b ? -1 : b > a ? 1 : 0
                }
            }
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            sorter: {
                compare: (a: any, b: any) => {
                    a = a.lastSchedulingDate.toLowerCase()
                    b = b.lastSchedulingDate.toLowerCase()
                    return a > b ? -1 : b > a ? 1 : 0
                }
            },
            ...getColumnSearchProps('name')
        },
        {
            title: 'Cross Docking',
            dataIndex: 'hasCrossDocking',
            key: 'hasCrossDocking',
            render: (text: boolean) => <div>{text ? 'Si' : 'No'}</div>,
            filters: [
                { text: 'Si', value: true },
                { text: 'No', value: false },
            ],
            filterSearch: true,
            onFilter: (value: boolean, item: Dock) => item.hasCrossDocking === value,
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => {
                return (
                    <Row>
                        <Col>
                            <Button onClick={(e: any) => deleteAllHandler(text)}><DeleteTwoTone twoToneColor="#eb2f96" /></Button>
                        </Col>
                    </Row>
                )
            }
        }
    ];

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const deleteAllHandler = (event: string) =>
        openDeleteModal(event, items, setInteractionItem, setDeleteModal);

    const onSearch = (value: string) => {
        setItemsSearch(items.filter(item => item.id.toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()) || item.name.toLowerCase()
                .includes((value as string).toLowerCase())));
    }

    const deleteItem = () => {
        const message = "Registro Eliminado";
        const description = "El registro ha sido eliminado con exito";

        setDeleteModal(false);
        confirmDeleteItem(interactionItem, setItems);
        openNotificationWithIcon('success', message, description);
        setInteractionItem(null);
    };

    const handleSave = (values: any) => {
        const message = "Registro Creado";
        const description = "El registro ha sido creado con exito";
        const { $d } = values.date;
        const newItem: Dock = {
            id: generateRandomString(8) + '-' + generateRandomString(4) + '-' + generateRandomString(4) + '-' + generateRandomString(4) + '-' + generateRandomString(12),
            name: values.name,
            lastSchedulingDate: $d.toString(),
            hasCrossDocking: values.hasCrossDocking ? values.hasCrossDocking : false
        }

        setItems([...items, newItem]);
        openNotificationWithIcon('success', message, description);
        form.resetFields();
        setOpen(false);
    };

    return (
        <Layout>
            {contextHolder}
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Row justify="left" align="top">
                        <Col span={5}>
                            <h2><ReconciliationTwoTone twoToneColor="#389e0d" /> Entradas de Cedis Principal</h2>
                        </Col>
                    </Row>
                </Header>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <Row>
                        <Col span={5} push={1}>
                            <Button
                                block
                                onClick={() => setOpen(true)}
                            >
                                <FileAddTwoTone />
                                Nueva Entrada
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Search placeholder="Buscar por Id o Nombre" onSearch={onSearch} style={{ width: 250 }} />
                        </Col>
                    </Row>
                    <br />
                    <Row justify="center">
                        <Col span={23}>
                            <Table columns={columns} dataSource={!itemsSearch ? items : itemsSearch} bordered pagination={{ defaultPageSize: 8, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}/>
                        </Col>
                    </Row>
                </Content>
            </Layout>

            <Modal
                title="Nueva Entrada"
                centered
                open={open}
                onOk={form.submit}
                onCancel={() => { form.resetFields(); setOpen(false); }}
                width={1000}
            >
                <Form form={form} onFinish={handleSave}>
                    <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
                        <Select style={{ width: 100 }}>
                            <Option value="Dock A">Dock A</Option>
                            <Option value="Dock B">Dock B</Option>
                            <Option value="Dock C">Dock C</Option>
                            <Option value="Dock D">Dock D</Option>
                            <Option value="Dock E">Dock E</Option>
                            <Option value="Dock F">Dock F</Option>
                            <Option value="Dock G">Dock G</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Fecha programada" name="date" rules={[{ required: true }]}>
                        <DatePicker showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }} />
                    </Form.Item>
                    <Form.Item label="Cross-Docking" name="hasCrossDocking">
                        <Switch>
                            Si
                        </Switch>
                    </Form.Item>
                    <Form.Item label="Descripcion" name="description" >
                        <Input.TextArea showCount maxLength={100} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Eliminar registro"
                centered
                open={deleteModal}
                footer={[
                    <Button key='back' onClick={() => setDeleteModal(false)}>Cancel</Button>,
                    <Button type="primary" danger onClick={deleteItem}>Delete</Button>
                ]}
                width={1000}
            >
                <p>Deseas eliminar el registro con nombre <span className="text-bold">{interactionItem?.name}</span> fecha programada <span className="text-bold">{convertDateFormat(interactionItem?.lastSchedulingDate)}</span>? </p>
            </Modal>
        </Layout>
    )
}

export default ManageDocks;