import Alert from './Alert/Alert.jsx';
import Confirm from './Confirm/Confirm.jsx';
import Notice from './Notice/Notice.jsx';
import Loading from './Loading/Loading.jsx';

// 可能有多种使用方式，导入使用{}，既可以export，也可以export default对象解构
export { Alert, Confirm, Notice, Loading };// 非键值对简写
export default { Alert, Confirm, Notice, Loading };// 键值对简写