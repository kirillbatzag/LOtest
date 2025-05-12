import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

interface Post {
  id: number;
  message: string;
  time: number;
  likes: {count: number};
  comments: {count: number};
  reposts: {count: number};
  views: {count: number};
  user: {
    firstName: string;
    lastName: string;
    photo: {xs: string};
  };
  photos?: Array<{photo: {xs: {src: string}}}>;
  url: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({post}) => {
  const userPhoto = post.user?.photo?.xs;
  const postImage = post.photos?.[0]?.photo?.xs?.src;

  const safeUri = (uri: any): string | null => {
    return typeof uri === 'string' ? uri : null;
  };

  const validUserPhoto = safeUri(userPhoto);
  const validPostImage = safeUri(postImage);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {validUserPhoto ? (
          <Image source={{uri: validUserPhoto}} style={styles.avatar} />
        ) : null}
        <Text style={styles.name}>
          {post.user.firstName} {post.user.lastName}
        </Text>
      </View>

      <Text style={styles.message}>{post.message}</Text>

      {validPostImage ? (
        <Image source={{uri: validPostImage}} style={styles.postImage} />
      ) : null}

      <View style={styles.stats}>
        <Text style={styles.stat}>❤️ {post.likes.count}</Text>
        <Text style={styles.stat}>💬 {post.comments.count}</Text>
        <Text style={styles.stat}>🔁 {post.reposts.count}</Text>
        <Text style={styles.stat}>👁️ {post.views.count}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stat: {
    fontSize: 12,
    color: '#666',
  },
});

export default PostCard;
