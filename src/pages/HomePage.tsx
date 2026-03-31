
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CreatePost from '../components/CreatePost';
import PostFeed from '../components/PostFeed';
import { Button } from '../components/ui/button';
import { Home, Search, Bell, User, LogOut } from 'lucide-react';

export default function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mobile-container">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold gradient-text">Social</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-muted-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-container p-4">
        <CreatePost />
        <PostFeed />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="mobile-container">
          <div className="flex items-center justify-around p-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2 text-primary">
                <Home className="h-6 w-6" />
                <span className="text-xs mt-1">Home</span>
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2 text-muted-foreground">
                <Search className="h-6 w-6" />
                <span className="text-xs mt-1">Search</span>
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2 text-muted-foreground">
                <Bell className="h-6 w-6" />
                <span className="text-xs mt-1">Notifications</span>
              </Button>
            </Link>
            <Link to={`/profile/${user?.user_metadata?.username}`}>
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2 text-muted-foreground">
                <User className="h-6 w-6" />
                <span className="text-xs mt-1">Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}