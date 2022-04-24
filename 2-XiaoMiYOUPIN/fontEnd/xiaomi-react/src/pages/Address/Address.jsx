import { connect } from 'react-redux';
import { addressActions } from '../../store';
import UIAddress from './UIAddress.jsx';

const mapStateToProps = state => {
        return {
                list: state.address.list
        };
};
const mapDispatchToProps = dispatch => {
        return {
                init: () => dispatch(addressActions.init()),
                remove: id => dispatch(addressActions.remove(id)),
                setDefault: id => dispatch(addressActions.setDefault(id))
        };
};

export default connect(mapStateToProps, mapDispatchToProps)(UIAddress);