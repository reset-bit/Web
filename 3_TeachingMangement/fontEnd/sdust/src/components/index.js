import Func from './Func';
import RoleFunc from './RoleFunc';
import UserRole from './UserRole';
import Student from './Student';
import Classroom from './Classroom';
import Class from './Class';
import Staff from './Staff';
import Password from './Password';

export default {
        Func: {
                component: Func,
                remark: '此组件可以完成系统功能管理'
        },
        RoleFunc: {
                component: RoleFunc,
                remark: '此组件可以完成角色及角色功能管理'
        },
        UserRole: {
                component: UserRole,
                remark: '此组件可以完成用户及用户角色分配'
        },
        Student: {
                component: Student,
                remark: '此组件可以完成学生管理'
        },
        Classroom: {
                component: Classroom,
                remark: '此组件可以完成教室管理'
        },
        Class: {
                component: Class,
                remark: '此组件可以完成班级管理'
        },
        Staff: {
                component: Staff,
                remark: '此组件可以完成员工管理'
        },
        Password: {
                component: Password,
                remark: '此组件可以完成密码修改'
        }
};