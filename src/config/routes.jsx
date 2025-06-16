import Feed from '@/components/pages/Feed';
import Search from '@/components/pages/Search';
import NewPost from '@/components/pages/NewPost';
import Saved from '@/components/pages/Saved';
import Profile from '@/components/pages/Profile';
import StoryViewer from '@/components/pages/StoryViewer';

export const routes = [
  {
    path: '/',
    element: <Feed />
  },
  {
    path: '/search',
    element: <Search />
  },
  {
    path: '/new-post',
    element: <NewPost />
  },
  {
    path: '/saved',
    element: <Saved />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/story/:userId',
    element: <StoryViewer />
  }
];