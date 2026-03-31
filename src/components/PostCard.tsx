
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Share2, MoreHorizontal, BadgeCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Profile {
  username: string;
  full_name: string;
  avatar_url?: string;
  is_verified?: boolean;
}

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
}

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  currentUserId?: string;
}

export default function PostCard({ post, onDelete, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isOwnPost = currentUserId === post.user_id;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Card className="p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Link to={`/profile/${post.profiles?.username}`} className="flex items-start gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profiles?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground hover:underline">
                {post.profiles?.full_name || 'Unknown User'}
              </span>
              {post.profiles?.is_verified && (
                <BadgeCheck className="h-4 w-4 text-primary fill-primary" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>@{post.profiles?.username}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </Link>

        {isOwnPost && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(post.id)}
              >
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mb-3">
        <p className="text-foreground whitespace-pre-wrap break-words">{post.content}</p>
      </div>

      {post.image_url && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img
            src={post.image_url}
            alt="Post content"
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-1 pt-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${liked ? 'text-destructive' : 'text-muted-foreground'}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
          {likeCount > 0 && <span>{likeCount}</span>}
        </Button>

        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <MessageCircle className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}