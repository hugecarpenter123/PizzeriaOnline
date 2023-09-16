import { useNavigationState, NavigationState  } from '@react-navigation/native';

const useActiveRouteName = () => {
  const navigationState = useNavigationState((state) => state);

  const findActiveRouteName = (state: NavigationState): string => {
    const route = state.routes[state.index];

    if (route.state) {
      // If the route has nested navigators, recursively find the active route
      return findActiveRouteName(route.state as NavigationState);
    }

    return route.name;
  };

  return findActiveRouteName(navigationState);
};

export default useActiveRouteName;