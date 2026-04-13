import { RightOutlined } from '@ant-design/icons';
import { Form, Input, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import { useLogin } from '@/services';
import { formRules } from '@/utils';
import style from './index.module.css';

const ModuleName = '_Login_';

export const Login = () => {
  const [type, setType] = useState<'phone' | 'password'>('phone');

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  // #region 表单校验（输入时）
  const [isSubmittable, setSubmittable] = useState(false);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  // #endregion

  // 登录方式切换动画
  const formContainerRef = useRef<HTMLDivElement>(null);
  const onTypeChange = () => {
    setType(type === 'phone' ? 'password' : 'phone');
    if (formContainerRef.current) {
      formContainerRef.current.classList.add(style.animate);
      setTimeout(() => {
        formContainerRef.current?.classList.remove(style.animate);
      }, 1000);
    }
  };

  const onNextByPhone = () => {
    messageApi.info('暂不支持此功能，请选择账号密码登录');
  };

  // #region 表单提交
  const [messageApi, contextHolder] = message.useMessage();
  const navigator = useNavigate();

  const { mutate: onSubmit } = useLogin(values?.id, values?.password, {
    onSuccess: () => {
      messageApi.success('登录成功');
      setTimeout(() => {
        navigator(-1);
      }, 2000);
    },
    onError: e => messageApi.error(e.message || '登录失败'),
  });
  // #endregion

  return (
    <ErrorBoundary>
      <div className={`${ModuleName} ${style.container}`}>
        <div className={style.top}>
          <img src="/images/logo.svg" className={style.logo} />
          <span className={style.welcome}>欢迎登录小米有品</span>
        </div>

        <div className={style['content-wrapper']}>
          <div className={style.content} ref={formContainerRef}>
            <Form className={style.login} form={form}>
              <div className={`${type === 'phone' ? style.phone : style.pwd}`}>
                <h5>小米账号登录</h5>
                <div className={type === 'phone' ? style['phone-content'] : style['pwd-content']}>
                  {type === 'phone' && (
                    <>
                      <Form.Item
                        className={style['phone-input-wrapper']}
                        name="phone"
                        rules={formRules.phone}
                      >
                        <Input
                          type="number"
                          placeholder="请输入手机号"
                          className={style['phone-input']}
                          addonBefore={
                            <>
                              +86 <RightOutlined />
                            </>
                          }
                        />
                      </Form.Item>
                      <Form.Item>
                        <div
                          className={`${style['btn-next']} ${isSubmittable && style.active}`}
                          onClick={() => onNextByPhone()}
                        >
                          下一步
                        </div>
                      </Form.Item>
                    </>
                  )}

                  {type === 'password' && (
                    <>
                      <Form.Item
                        className={style['pwd-input-wrapper']}
                        name="id"
                        rules={formRules.id}
                      >
                        <Input
                          type="text"
                          placeholder="邮箱/手机号码/小米ID"
                          className={style['name-input']}
                        />
                      </Form.Item>
                      <Form.Item
                        className={style['pwd-input-wrapper']}
                        name="password"
                        rules={formRules.password}
                      >
                        <Input
                          type="password"
                          placeholder="请输入密码"
                          className={style['pwd-input']}
                        />
                      </Form.Item>
                      <Form.Item>
                        <div
                          className={`${style['btn-next']} ${isSubmittable && style.active}`}
                          onClick={() => onSubmit()}
                        >
                          登录
                        </div>
                      </Form.Item>
                    </>
                  )}

                  <div className={style.tips}>
                    {type === 'phone' ? (
                      <span className={style['login-pwd']} onClick={() => onTypeChange()}>
                        用户名密码登录
                      </span>
                    ) : (
                      <span className={style['login-phone']} onClick={() => onTypeChange()}>
                        手机号登录
                      </span>
                    )}{' '}
                    | <Link to="/register">立即注册</Link> | <a>忘记密码？</a>
                  </div>

                  <div className={style.other}>
                    <h6>- 其它方式登录- </h6>
                    <img src="/images/login_other.png" alt="" />
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
        {contextHolder}
      </div>
    </ErrorBoundary>
  );
};
