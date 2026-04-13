import { LeftOutlined } from '@ant-design/icons';
import { Form, Input, message, Modal, Switch } from 'antd';
import { useRef, useState } from 'react';
import { useAddressManager } from '@/services';
import type { Address } from '@/types';
import { formRules } from '@/utils';
import style from './index.module.css';

export const useEditAddressDialog = () => {
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const address = Form.useWatch<Address>(undefined, form);

  const addressRef = useRef<Address | { id: number; isDefault: boolean }>({
    id: -1,
    isDefault: false,
  }); // 初始address
  const isAdd = addressRef.current.id === -1;

  const [messageApi, messageContextHolder] = message.useMessage();
  const { getTargetAddress, addAddress, updateAddress, deleteAddress } = useAddressManager({
    onSuccess: () => messageApi.success('操作成功'),
    onError: () => messageApi.error('操作失败'),
  });

  // #region 弹窗
  const openDialog = async (addressId?: number) => {
    let address;
    if (addressId) {
      // 修改
      address = await getTargetAddress(addressId);
      addressRef.current = address;
      form.setFieldsValue(address);
    } else {
      // 新增
      addressRef.current = { id: -1, isDefault: false };
      form.resetFields();
    }
    setVisible(true);
  };
  const closeDialog = () => {
    setVisible(false);
  };
  // #endregion

  // #region 动作响应
  const onSave = async () => {
    if (isAdd) {
      await addAddress(address);
    } else {
      // 表单校验（保存时）
      if (addressRef.current.isDefault && !address.isDefault) {
        // 服务器限制只能设置默认地址，因此在此限制不能取消默认地址
        messageApi.error('至少要有一个默认地址');
        return;
      }
      await updateAddress(address);
    }
    closeDialog();
  };

  const [modal, modalContextHolder] = Modal.useModal();
  const onDelete = () => {
    modal.confirm({
      title: '删除地址',
      content: '确定要删除这个地址吗？',
      okText: '删除',
      cancelText: '取消',
      width: 300,
      onOk: async function () {
        await deleteAddress(addressRef.current.id);
        closeDialog();
      },
    });
  };
  // #endregion

  const context = (
    <div className={`${style['edit-module']} ${visible && style['active']}`}>
      <div className={style['module-header']}>
        <LeftOutlined onClick={closeDialog} />
        <span className={style['module-title']}>{isAdd ? '新增地址' : '修改地址'}</span>
      </div>

      <div className={style['module-content']}>
        <Form form={form} className={style['layui-form']}>
          <Form.Item name="id" style={{ display: 'none' }}>
            <Input placeholder="请输入收货人姓名" className={style['receive-name']} id="id" />
          </Form.Item>
          <div className={`${style['content-item']} ${style['border-1px']}`}>
            <label htmlFor="receiveName">收货姓名</label>
            <Form.Item name="receiveName" noStyle>
              <Input
                placeholder="请输入收货人姓名"
                className={style['receive-name']}
                id="receiveName"
              />
            </Form.Item>
          </div>
          <div className={`${style['content-item']} ${style['border-1px']}`}>
            <label htmlFor="receivePhone">手机号码</label>
            <Form.Item name="receivePhone" noStyle rules={formRules.phone}>
              <Input
                type="tel"
                placeholder="请输入收货人电话"
                className={style['receive-phone']}
                id="receivePhone"
              />
            </Form.Item>
          </div>
          <div className={`${style['content-item']} ${style['border-1px']}`}>
            <label htmlFor="receiveRegion">收货地区</label>
            <Form.Item name="receiveRegion" noStyle>
              <Input
                placeholder="请选择省/市/区街道"
                className={style['receive-region']}
                id="receiveRegion"
              />
            </Form.Item>
          </div>
          <div className={`${style['content-item']} ${style['border-1px']}`}>
            <label htmlFor="receiveDetail">详细地址</label>
            <Form.Item name="receiveDetail" noStyle>
              <Input
                placeholder="请输入街道地址"
                className={style['receive-detail']}
                id="receiveDetail"
              />
            </Form.Item>
          </div>

          <div className={`${style['content-item']} ${style['border-1px']} ${style.last}`}>
            <label>设为默认地址</label>
            <Form.Item name="isDefault" valuePropName="checked" noStyle>
              <Switch className={style['btn-default']} />
            </Form.Item>
          </div>
          {!isAdd && (
            <span className={style['btn-remove']} onClick={onDelete}>
              删除收货地址
            </span>
          )}
        </Form>
        <div className={style['btn-save']} onClick={onSave}>
          保存
        </div>
        {messageContextHolder}
        {modalContextHolder}
      </div>
    </div>
  );

  return { context, openDialog, closeDialog };
};
