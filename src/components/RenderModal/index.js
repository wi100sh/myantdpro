import React, { useState } from 'react';
import { Modal as AntModal } from 'antd';

const RenderPropsModal = ({ children }) => {
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

  const Modal = ({ children: child, ...resProps }) => (
    <AntModal destroyOnClose visible={visible} onCancel={hideModelHandler} footer={null} {...resProps}>
      {child}
    </AntModal>
  );

  return children({
    showModalHandler,
    hideModelHandler,
    Modal,
  });
};

export default RenderPropsModal;
