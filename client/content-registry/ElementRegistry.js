import ComponentRegistry from './ComponentRegistry';
import elementList from 'components/content-elements';
import { getComponentName } from 'tce-core/utils';

const ATTRS = ['name', 'type', 'subtype', 'version', 'schema', 'initState', 'ui'];
const options = ['element', elementList, ATTRS, getComponentName];

export default Vue => new ComponentRegistry(Vue, ...options);
