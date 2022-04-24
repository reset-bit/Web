import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UIAddressEdit extends Component {
        state = {
                model: this.props.model
        };
        // 状态派生，获取父组件传递的model。但是无法输入，因为每次输入都会触发getDerivedStateFormProps合并空对象
        // static getDerivedStateFromProps(nextProps, prevState) {
        //         return { model: {...nextProps.model} };
        // }

        // 总由组件为数据脱钩
        // isEdit应当由父组件传递，子组件可调用方法更改值。子组件应当能够进行表单状态反馈，故不能直接调用save()
        saveHandler = async  () => {
                // 表单验证...
                await this.props.save({...this.state.model});// 返回promise，报错在try（仓库）处提示，或给用户
                this.props.cancel();
                alert('编辑成功');
        };
        render() {
                return (
                        <div>
                                <input type="text" placeholder='收件人姓名' value={this.state.model.receiveName}
                                       onInput={e => this.setState({ model: {...this.state.model, receiveName: e.target.value.trim()} })}/>
                                <input type="text" placeholder='收件人电话' value={this.state.model.receivePhone}
                                       onInput={e => this.setState({ model: {...this.state.model, receivePhone: e.target.value.trim()} })}/>
                                <input type="text" placeholder='收件人地区' value={this.state.model.receiveRegion}
                                       onInput={e => this.setState({ model: {...this.state.model, receiveRegion: e.target.value.trim()} })}/>
                                <input type="text" placeholder='收件人地址' value={this.state.model.receiveDetail}
                                       onInput={e => this.setState({ model: {...this.state.model, receiveDetail: e.target.value.trim()} })}/>
                                <button onClick={this.saveHandler}>确定</button>
                                <button onClick={this.props.cancel}>取消</button>
                        </div>
                );
        }
}

UIAddressEdit.propTypes = {
        model: PropTypes.shape({
                id: PropTypes.number.isRequired,
                receiveName: PropTypes.string.isRequired,
                receivePhone: PropTypes.string.isRequired,
                receiveRegion: PropTypes.string.isRequired,
                receiveDetail: PropTypes.string.isRequired,
                isDefault: PropTypes.oneOf([0,1]).isRequired
        }).isRequired,
        save: PropTypes.func.isRequired,
        cancel: PropTypes.func.isRequired
};

export default UIAddressEdit;