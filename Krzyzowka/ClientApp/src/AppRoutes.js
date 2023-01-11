import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Quiz } from "./components/Quiz";
import { Crossword } from './components/Crossword';
import { Leaderboard } from "./components/Leaderboard";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/quiz',
    element: <Quiz /> 
  },
  {
    path: '/crossword',
    element: <Crossword />
  },
  {
    path: '/leaderboard',
    //requireAuth: true,
    element: <Leaderboard />
  },
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
