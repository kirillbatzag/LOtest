import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation';
import PostCard from '../components/PostCard';
import {FlashList} from '@shopify/flash-list';
import {fetchPosts, Post} from '../api/posts';

type PostsScreenRouteProp = RouteProp<RootStackParamList, 'Posts'>;

const LIMIT = 10;

const PostsScreen = () => {
  const route = useRoute<PostsScreenRouteProp>();
  const {token} = route.params;

  const navigation = useNavigation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setRefreshing(true);
        } else {
          setIsFetchingMore(true);
        }

        const currentOffset = reset ? 0 : offset;
        const newPosts = await fetchPosts(token, currentOffset, LIMIT);

        setHasMore(newPosts.length === LIMIT);
        setPosts(prev => (reset ? newPosts : [...prev, ...newPosts]));
        setOffset(reset ? LIMIT : currentOffset + LIMIT);
      } catch (error: any) {
        if (error.code === 401) {
          Alert.alert('Ошибка авторизации', 'Неверный токен. Войдите снова.');
          navigation.goBack();
        } else {
          Alert.alert('Ошибка', error.message || 'Не удалось загрузить посты');
        }
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
        setRefreshing(false);
      }
    },
    [token, offset, navigation],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const newPosts = await fetchPosts(token, 0, LIMIT);
        setPosts(newPosts);
        setOffset(LIMIT);
        setHasMore(newPosts.length === LIMIT);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const onRefresh = useCallback(() => {
    loadPosts(true);
  }, [loadPosts]);

  const handleLoadMore = () => {
    if (!isFetchingMore && hasMore && !loading && !refreshing) {
      loadPosts();
    }
  };

  const renderItem = ({item}: {item: Post}) => <PostCard post={item} />;

  if (loading && posts.length === 0) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlashList
      data={posts}
      estimatedItemSize={300}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingMore ? <ActivityIndicator /> : null}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 12,
  },
});

export default PostsScreen;
