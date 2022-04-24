import { addressActions } from '../../store';
import { connect } from 'react-redux';
import UIAddress from './UIAddress';

/**
 * @param state address子仓库中state
 * @param props 父组件传给本组件的props
 *
 * connect会在父组件与子组件之间添加connect层，props传递劫持。故在mapStateToProps、mapDispatchToProps暴露props。
 * 另，数据同步更新。
 * */
const mapStateToProps = (state, props) => {
        return {
                list: state.address.list
        };
};
/**
 * @param dispatch 显式提交事件函数
 * @param props 父组件传给本组件的props
 * */
const mapDispatchToProps = (dispatch, props) => {
        return {
                init: () => dispatch(addressActions.init()),
                add: address => dispatch(addressActions.add(address)),
                update: address => dispatch(addressActions.update(address)),
                remove: id =>dispatch(addressActions.remove(id)),
                setDefault: id => dispatch(addressActions.setDefault(id))
        };
};
// 直接传递UIAddress，在本文件中负责仓库交互逻辑。
// 原本由父组件为UIAddress传递数据及数据操作函数，现在将业务逻辑抽象出来
export default connect(mapStateToProps, mapDispatchToProps)(UIAddress);