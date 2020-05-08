import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, TreeSelect, Button, message } from 'antd';
import { connect } from 'umi';
import { isEmpty } from '@/utils/utils';
import styles from '../../System.less';

const DepartmentForm = connect(({ systemDepartment: { tree, department }, loading }) => ({
  tree,
  department,
  // 数组写多个无效，直接使用model又不够细粒度。
  getLoading: loading.effects['systemDepartment/fetchById'],
  addLoading: loading.effects['systemDepartment/add'],
  updateLoading: loading.effects['systemDepartment/update'],
}))(
  ({
    getLoading,
    addLoading,
    updateLoading,
    visible,
    isEdit,
    id,
    department,
    tree,
    closeModal,
    dispatch,
  }) => {
    const loading = getLoading || addLoading || updateLoading;
    const [form] = Form.useForm();
    const { resetFields, setFieldsValue } = form;

    // 【修改时，获取部门表单数据】
    useEffect(() => {
      if (visible && isEdit) {
        dispatch({
          type: 'systemDepartment/fetchById',
          payload: {
            id,
          },
        });
      }
      return () => {
        if (isEdit) {
          dispatch({
            type: 'systemDepartment/clear',
          });
        }
      };
    }, [visible, isEdit, id, dispatch]);

    // 【修改时，回显部门表单】
    useEffect(() => {
      // 👍 将条件判断放置在 effect 中
      if (visible && isEdit) {
        if (!isEmpty(department)) {
          setFieldsValue(department);
        }
      }
    }, [visible, isEdit, department, setFieldsValue]);

    // 【添加与修改】
    const handleAddOrUpdate = (values) => {
      if (isEdit) {
        Object.assign(values, { id });
        dispatch({
          type: 'systemDepartment/update',
          payload: {
            ...values,
          },
          callback: () => {
            resetFields();
            closeModal();
            message.success('部门修改成功。');
          },
        });
      } else {
        dispatch({
          type: 'systemDepartment/add',
          payload: {
            ...values,
          },
          callback: () => {
            resetFields();
            closeModal();
            message.success('部门添加成功。');
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
      <Modal
        destroyOnClose
        title={isEdit ? '修改' : '新增'}
        visible={visible}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name="departmentForm"
          className={styles.form}
          initialValues={{
            parentId: id && id.toString(),
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
            label="父部门"
            name="parentId"
            rules={[{ required: true, message: '请选择一个父部门！' }]}
          >
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={tree}
              placeholder="请选择部门。"
              treeDefaultExpandAll
            />
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
            label="描述"
            name="description"
            rules={[{ message: '请将描述长度保持在1至50字符之间！', min: 1, max: 150 }]}
          >
            <Input.TextArea placeholder="请输入部门描述。" autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button onClick={closeModal}>取消</Button>
            <Button type="primary" loading={loading} htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);

export default DepartmentForm;
