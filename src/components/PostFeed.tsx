
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url?: string;
    is_verified?: boolean;
  };
}

export default function PostFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url,
            is_verified
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Listen for new posts
    const handlePostCreated = () => {
      fetchPosts();
    };

    window.addEventListener('post-created', handlePostCreated);

    return () => {
      window.removeEventListener('post-created', handlePostCreated);
    };
  }, []);

  const handleDelete = async (postId: string) => {
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
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={handleDelete}
          currentUserId={user?.id}
        />
      ))}
    </div>
  );
}