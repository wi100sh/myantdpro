import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Input, Modal, Switch, message, Radio, TreeSelect, Button } from 'antd';
import { isEmpty } from 'lodash';
import styles from '../../System.less';

const ApiForm = connect(({ systemApi: { tree, api }, loading }) => ({
  tree,
  api,
  loading: loading.effects[('systemApi/fetchById', 'systemApi/add', 'systemApi/update')],
}))(({ loading, children, isEdit, id, api, tree, dispatch }) => {
  const [form] = Form.useForm();
  const { resetFields, setFieldsValue } = form;

  // 【模态框显示隐藏属性】
  const [visible, setVisible] = useState(false);

  // 【模态框显示隐藏函数】
  const showModalHandler = (e) => {
    if (e) e.stopPropagation();
    setVisible(true);
  };
  const hideModelHandler = () => {
    setVisible(false);
  };

  // 【修改时，获取接口数据】
  useEffect(() => {
    if (visible && isEdit) {
      dispatch({
        type: 'systemApi/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemApi/clear',
      });
    };
  }, [visible, isEdit, id, dispatch]);

  // 【修改时，回显接口表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible && isEdit) {
      if (!isEmpty(api)) {
        setFieldsValue(api);
      }
    }
  }, [visible, isEdit, api, setFieldsValue]);

  // 【保证任何时候添加上级菜单都有默认值】
  useEffect(() => {
    if (visible && !isEdit) {
      if (id) {
        setFieldsValue({ parentId: id.toString() });
      }
    }
  }, [visible, isEdit, id, setFieldsValue]);

  // 【添加与修改】
  const handleAddOrUpdate = (values) => {
    if (isEdit) {
      dispatch({
        type: 'systemApi/update',
        payload: {
          type: 2,
          ...values,
          id,
          oldParentId: api.parentId,
        },
        callback: () => {
          resetFields();
          hideModelHandler();
          message.success('修改接口成功。');
        },
      });
    } else {
      dispatch({
        type: 'systemApi/add',
        payload: {
          type: 2,
          ...values,
          oldParentId: id,
        },
        callback: () => {
          resetFields();
          hideModelHandler();
          message.success('添加接口成功。');
        },
      });
    }
  };

  // 【表单布局】
  const layout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
  };
  const tailLayout = {
    wrapperCol: {
      xs: { offset: 0, span: 24 },
      sm: { offset: 5, span: 19 },
    },
  };

  return (
    <>
      <span onClick={showModalHandler}>{children}</span>
      <Modal
        forceRender
        destroyOnClose
        title={isEdit ? '修改' : '新增'}
        visible={visible}
        onCancel={hideModelHandler}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name="menuForm"
          className={styles.form}
          initialValues={{
            status: true,
          }}
          onFinish={handleAddOrUpdate}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请将名称长度保持在1至20字符之间！',
                min: 1,
                max: 20,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="编码"
            name="code"
            rules={[
              {
                required: true,
                message: '请将编码长度保持在1至50字符之间！',
                min: 1,
                max: 50,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="URL"
            name="uri"
            rules={[
              {
                required: true,
                message: '请将URL长度保持在3至100字符之间！',
                min: 3,
                max: 100,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true }]}
            valuePropName="checked"
          >
            <Switch checkedChildren="开" unCheckedChildren="关" />
          </Form.Item>
          <Form.Item
            label="方法类型"
            name="method"
            rules={[{ required: true, message: '请选择方法类型。' }]}
          >
            <Radio.Group>
              <Radio value="GET">GET</Radio>
              <Radio value="POST">POST</Radio>
              <Radio value="DELETE">DELETE</Radio>
              <Radio value="PUT">PUT</Radio>
              <Radio value="PATCH">PATCH</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="父菜单" name="parentId">
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={tree}
              placeholder="请选择菜单"
              treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button onClick={hideModelHandler}>取消</Button>
            <Button type="primary" loading={loading} htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default ApiForm;