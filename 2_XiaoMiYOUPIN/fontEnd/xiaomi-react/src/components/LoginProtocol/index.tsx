import { Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const usePolicyDialog = (): [React.ReactNode, () => void, boolean] => {
  const navigator = useNavigate();

  const [visible, setVisible] = useState(false);
  const [isAgree, setAgree] = useState(false);

  const openDialog = useCallback(() => setVisible(true), []);

  const closeDialog = () => setVisible(false);

  const dialog = (
    <Modal
      title="声明与政策"
      width={300}
      closable={false}
      maskClosable={false}
      centered
      open={visible}
      okText="同意"
      onOk={() => {
        closeDialog();
        setTimeout(() => {
          setAgree(true);
        }, 100);
      }}
      cancelText="不同意"
      onCancel={() => {
        closeDialog();
        navigator(-1);
      }}
    >
      欢迎您来到小米有品！我们依据最新法律法规要求，制定并更新了《隐私政策》、《小米有品用户协议》以及《小米账号使用协议》。您需阅读并统一相关政策条款方可进行登录。
    </Modal>
  );

  return [dialog, openDialog, isAgree];
};

type LoginGuardProps = {
  children: React.ReactNode;
};

export const LoginProtocol: React.FC<LoginGuardProps> = props => {
  const { children } = props;

  const { state } = useLocation();
  const [dialog, openDialog, isAgree] = usePolicyDialog();

  useEffect(() => {
    if (state?.from !== 'register') {
      openDialog();
    }
  }, [openDialog, state]);

  return (
    <>
      {dialog}
      {(state?.from === 'register' || isAgree) && children}
    </>
  );
};
