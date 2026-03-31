
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import PostCard from '../components/PostCard';
import { ArrowLeft, MapPin, Link2, Calendar, BadgeCheck, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  is_verified?: boolean;
  website?: string;
  location?: string;
  email?: string;
  created_at: string;
}

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user_id: string;
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user?.user_metadata?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch user's posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);
      } catch (error: any) {
        toast.error('Failed to load profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter((post) => post.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mobile-container p-4">
          <p className="text-center text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mobile-container">
          <div className="flex items-center gap-4 p-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="font-bold text-lg">{profile.full_name}</h1>
              <p className="text-sm text-muted-foreground">{posts.length} posts</p>
            </div>
            {isOwnProfile && (
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Info */}
      <div className="mobile-container">
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile ? (
              <Button variant="outline" className="font-semibold">
                Edit Profile
              </Button>
            ) : (
              <Button className="font-semibold">Follow</Button>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{profile.full_name}</h2>
              {profile.is_verified && (
                <BadgeCheck className="h-5 w-5 text-primary fill-primary" />
              )}
            </div>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="mb-3 text-foreground">{profile.bio}</p>
          )}

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1">
                <Link2 className="h-4 w-4" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-bold text-foreground">0</span>{' '}
              <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold text-foreground">0</span>{' '}
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>

        {/* Posts Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-12">
            <TabsTrigger value="posts" className="font-semibold">
              Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="font-semibold">
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="p-4 pt-0">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts yet</p>
              </div>
            ) : (
              <div className="mt-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      ...post,
                      profiles: {
                        username: profile.username,
                        full_name: profile.full_name,
                        avatar_url: profile.avatar_url,
                        is_verified: profile.is_verified,
                      },
                    }}
                    onDelete={isOwnProfile ? handleDeletePost : undefined}
                    currentUserId={user?.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="media" className="p-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No media yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}