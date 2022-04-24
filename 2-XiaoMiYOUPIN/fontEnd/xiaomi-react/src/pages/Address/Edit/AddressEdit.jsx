import { connect } from 'react-redux';
import { addressActions } from '../../../store';
import UIAddressEdit from './UIAddressEdit.jsx';

// 展示组件需要isEdit/model/save/cancel
// 本组件为connect包裹组件，只需要保证UIAddressEdit组件初始数据
// 父组件传递address.id，需要找到该address，其他方法由父组件传递
const mapStateToProps = (state, props) => {
        let model = { id: 0, receiveName: '', receivePhone: '', receiveRegion: '', receiveDetail: '', isDefault: 0 };
        if(props.id !== 0) {// update
                model = state.address.list.find(item => item.id === props.id);
        }
        return { model };
};
const mapDispatchToProps = (dispatch, props) => {
        return {
                save: address => {
                        // 返回一个promise对象，用于给UIAddressEdit提供保存状态信息。
                        // dispatch是否返回promise取决于参数函数
                        return dispatch(addressActions[address.id === 0 ? 'add' : 'update'](address));
                }
        };
};

export default connect(mapStateToProps, mapDispatchToProps)(UIAddressEdit);