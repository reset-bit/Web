// 检测数据是否为空
export const isEmpty = (data: unknown): boolean => {
  return !String(data);
};

// 表单校验规则
export const formRules = {
  phone: [
    {
      validator: (_: unknown, values: number) => {
        if (String(values).length === 0) {
          return Promise.reject(new Error('请输入手机号码'));
        }
        if (!/^1[3456789]\d{9}$/.test(String(values))) {
          return Promise.reject(new Error('手机号码格式错误'));
        }
        return Promise.resolve();
      },
    },
  ],
  id: [
    {
      required: true,
      message: '请输入邮箱/手机号码/小米ID',
    },
  ],
  password: [
    {
      validator: (_: unknown, values: string) => {
        const length = String(values).length;
        if (length === 0) {
          return Promise.reject(new Error('请输入密码'));
        } else if (length < 3 || length > 10) {
          return Promise.reject(new Error('密码长度在3-10之间'));
        }
        return Promise.resolve();
      },
    },
  ],
  username: [
    {
      required: true,
      message: '请输入用户名',
    },
  ],
};
