import { LeftOutlined } from '@ant-design/icons';
import { Cascader, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import { useRegister } from '@/services';
import { formRules } from '@/utils';
import style from './index.module.css';

const ModuleName = '_Register_';
export const Register = () => {
  const [isChecked, setChecked] = useState(false);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  // #region 表单校验
  const [isSubmittable, setSubmittable] = useState(false);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  // #endregion

  // #region 表单提交
  const [messageApi, contextHolder] = message.useMessage();
  const navigator = useNavigate();

  const { mutate: onSubmit } = useRegister(values?.username, values?.password, values?.phone, {
    onSuccess: () => {
      messageApi.success('注册成功，请登录');
      setTimeout(() => {
        navigator('/login', { state: { from: 'register' } });
      }, 2000);
    },
    onError: e => messageApi.error(e.message || '注册失败'),
  });
  // #endregion

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style.container}`}>
        <div className={style.header}>
          <Link to="/login">
            <LeftOutlined />
          </Link>
        </div>
        <h5>注册小米账号</h5>
        <p>系统会根据您选择的国家/地区的法律法规存储您的个人信息</p>
        <Form className={style.content} form={form}>
          <Form.Item className={style['content-item']}>
            <Cascader
              placeholder="请选择国家/地区"
              options={[
                { value: 'China', label: '中国', children: [{ value: 'BeiJing', label: '北京' }] },
              ]}
            />
          </Form.Item>
          <Form.Item className={style['content-item']} name="username" rules={formRules.username}>
            <Input type="text" className={style.username} placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item className={style['content-item']} name="password" rules={formRules.password}>
            <Input type="password" className={style.pwd} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item className={style['content-item']} name="phone" rules={formRules.phone}>
            <Input type="number" className={style.phone} placeholder="绑定手机号" />
          </Form.Item>
          <div
            className={`${style['btn-next']} ${isSubmittable && isChecked && style.active}`}
            onClick={() => onSubmit()}
          >
            下一步
          </div>
          <p className={style.protocol}>
            <i
              className={`${style.checkbox} ${isChecked && style.checked}`}
              onClick={() => setChecked(!isChecked)}
            ></i>
            已阅读并同意小米账号<a href="">用户协议</a>和<a href="">隐私政策</a>
          </p>
        </Form>
        {contextHolder}
      </div>
    </ErrorBoundary>
  );
};
