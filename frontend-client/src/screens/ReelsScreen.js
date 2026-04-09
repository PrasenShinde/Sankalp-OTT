import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 32) / 3; // 3 columns with padding

// Local thumbnails
const thumbnails = [
  require('../../assets/pic_01.jpg'),
  require('../../assets/pic_02.jpg'),
  require('../../assets/pic_03.jpg'),
  require('../../assets/pic_04.jpg'),
  require('../../assets/pic_05.jpg'),
];

// Mock data matching the UI titles/stats (now using local images)
const DATA = [
  { id: '1', title: 'Sleeping with My Ex Husband\'s Son', views: '3.5M', tag: null, category: 'Age-Gap Love', image: thumbnails[0] },
  { id: '2', title: 'This Letter To You Is My Last', views: '14.6M', tag: 'Hot', category: 'All-Too-Late', image: thumbnails[1] },
  { id: '3', title: 'Run into the CEO\'s Secret Playroom', views: '68.8M', tag: 'Hot', category: 'Billionaire', image: thumbnails[2] },
  { id: '4', title: 'Daddy Dominant\'s Good Girl', views: '158M', tag: 'Hot', category: 'Age-Gap Love', image: thumbnails[3] },
  { id: '5', title: 'Baby Wants Her Hockey Daddy', views: '1.4M', tag: 'New', category: 'Athlete', image: thumbnails[4] },
  { id: '6', title: 'Too Wild to Love', views: '12.3M', tag: null, category: 'Family Bonds', image: thumbnails[0] },
  { id: '7', title: 'Boss for a Baby', views: '8.7M', tag: 'Hot', category: 'Boss Romance', image: thumbnails[1] },
  { id: '8', title: 'Cheer Up', views: '2.1M', tag: 'New', category: 'Young Adult', image: thumbnails[2] },
  { id: '9', title: 'The Scars You Carved', views: '5.4M', tag: null, category: 'DramaBox Exclusive', image: thumbnails[3] },
];

const DramaCard = ({ item }) => (
  <TouchableOpacity style={styles.cardContainer}>
    <View style={styles.imageWrapper}>
      <Image style={styles.posterImage} source={item.image} resizeMode="cover" />

      {/* Top Left Tag (Hot/New) */}
      {item.tag && (
        <View style={[styles.statusTag, { backgroundColor: item.tag === 'Hot' ? '#FF2D55' : '#7B2FFF' }]}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      )}

      {/* Play Count Overlay */}
      <View style={styles.viewCountContainer}>
        <Ionicons name="play" size={10} color="#fff" />
        <Text style={styles.viewCountText}>{item.views}</Text>
      </View>
    </View>

    <Text style={styles.dramaTitle} numberOfLines={2}>{item.title}</Text>
    <Text style={styles.categoryText}>{item.category}</Text>
  </TouchableOpacity>
);

export default function PopularScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#666" style={{ marginRight: 8 }} />
          <Text style={styles.searchPlaceholder}>Your Loser Husband Is A Big Shot</Text>
        </View>
        <View style={styles.headerIcons}>
          <View style={styles.vipIcon}><Text style={styles.vipText}>V</Text></View>
          <Ionicons name="gift" size={24} color="#FFD700" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Popular', 'New', 'Rankings', 'Categories', 'Anime'].map((tab, i) => (
          <Text key={tab} style={[styles.tabText, i === 0 && styles.activeTabText]}>
            {tab}
          </Text>
        ))}
      </View>

      {/* 3-Column Grid */}
      <FlatList
        data={DATA}
        renderItem={({ item }) => <DramaCard item={item} />}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />

      {/* Floating Continue Banner */}
      {/* <View style={[styles.continueBanner, { bottom: insets.bottom + 10 }]}>
        <Image style={styles.bannerThumb} source={{ uri: 'https://placeholder.com/50' }} />
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerTitle} numberOfLines={1}>No Escape From The Mafia King's Embr...</Text>
          <Text style={styles.bannerEp}>EP.4 / EP.54</Text>
        </View>
        <TouchableOpacity style={styles.continueBtn}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
        <Ionicons name="close" size={20} color="#666" style={{ marginLeft: 8 }} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flex: 1,
    height: 36,
    backgroundColor: '#1A1A1A',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchPlaceholder: {
    color: '#666',
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    gap: 15,
  },
  vipIcon: {
    backgroundColor: '#FFD700',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vipText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 20,
  },
  tabText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  listContent: {
    paddingHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 15,
  },
  cardContainer: {
    width: COLUMN_WIDTH,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  statusTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomLeftRadius: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewCountContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  dramaTitle: {
    color: '#FFF',
    fontSize: 13,
    marginTop: 8,
    fontWeight: '500',
    lineHeight: 18,
  },
  categoryText: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
  },
  continueBanner: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 60,
    backgroundColor: '#222',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation: 5,
  },
  bannerThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444',
  },
  bannerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bannerEp: {
    color: '#888',
    fontSize: 10,
  },
  continueBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  continueBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});