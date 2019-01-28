import Edit from './edit';
import yup from 'yup';

const schema = yup.object().shape({
  answers: yup.array().min(2).of(yup.string().trim().min(1).max(500).required()).required(),
  correct: yup.number().required()
});

const initState = () => ({
  answers: ['', ''],
  correct: ''
});

export default {
  name: 'Single Choice',
  type: 'ASSESSMENT',
  subtype: 'SC',
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};
