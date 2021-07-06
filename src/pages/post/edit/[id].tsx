import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../../utils/createUrqlClient';

export const EditPost = ({}) => {
  return <div>hello</div>;
};

export default withUrqlClient(createUrqlClient)(EditPost);
