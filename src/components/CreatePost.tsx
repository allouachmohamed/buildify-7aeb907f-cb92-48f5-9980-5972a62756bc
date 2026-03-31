
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CreatePost() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please write something to post');
      return;
    }

    setIsPosting(true);

    try {
      const { error } = await supabase.from('posts').insert({
        user_id: user?.id,
        content: content.trim(),
      });

      if (error) throw error;

      setContent('');
      toast.success('Post created successfully!');
      
      // Trigger a custom event to refresh the feed
      window.dispatchEvent(new CustomEvent('post-created'));
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-0 focus-visible:ring-0 p-0 text-base"
              disabled={isPosting}
            />
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
              >
                <ImagePlus className="h-5 w-5 mr-2" />
                Photo
              </Button>
              
              <Button
                type="submit"
                disabled={isPosting || !content.trim()}
                className="font-semibold"
              >
                {isPosting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}