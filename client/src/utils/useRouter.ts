import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default () => {
  const history = useHistory();
  const location = useLocation();

  const routeHistory = useCallback(
    (path: string, state: { [index: string]: string }) => {
      history.push({
        pathname: path,
        state: state,
      });
    },
    [history],
  );

  return [history, routeHistory];
};
