import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useApp } from '../context/AppContext';
import { Button, Badge, RatingStars, BottomSheet } from '../components';
import ProblemUploader from '../components/ProblemUploader';
import {
  services as allServices,
  addresses,
  reviews,
} from '../data/dummyData';

import { submitBooking } from '../services/api';

const TIME_SLOTS = [
  '09:00 AM',
  '11:00 AM',
  '01:00 PM',
  '03:00 PM',
  '05:00 PM',
  '07:00 PM',
];

export default function ServiceDetailsScreen({ navigation, route }) {
  const {
    theme,
    addresses: ctxAddresses,
    selectedAddressId,
    setSelectedAddressId,
    setActiveBooking,
  } = useApp();

  const insets = useSafeAreaInsets();

  const service = route?.params?.service || allServices[0];

  const [slot, setSlot] = useState(TIME_SLOTS[1]);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const selectedAddress =
    (ctxAddresses || addresses).find(
      (a) => a.id === selectedAddressId
    ) || addresses[0];

  // --------------------------------------------------
  // BOOK SERVICE
  // --------------------------------------------------

  const handleBook = async () => {
    if (bookingLoading) {
      return;
    }

    try {
      setBookingLoading(true);

      const bookingPayload = {
        service,
        slot,
        address: selectedAddress,
      };

      console.log('--------------------------------');
      console.log('Submitting booking to Firebase...');
      console.log('Service:', service.name);
      console.log('Slot:', slot);
      console.log('Address:', selectedAddress.line);
      console.log('--------------------------------');

      const result = await submitBooking(bookingPayload);

      if (!result.success) {
        console.error('Firebase booking failed:', result.error);

        Alert.alert(
          'Booking Failed',
          result.error || 'Unable to create booking.'
        );

        return;
      }

      console.log('--------------------------------');
      console.log('BOOKING CREATED SUCCESSFULLY');
      console.log('Firebase Booking ID:', result.bookingId);
      console.log('--------------------------------');

      // Store booking locally for the existing app flow
      setActiveBooking({
        ...bookingPayload,
        bookingId: result.bookingId,
        status: 'SEARCHING',
      });

      // Move to finding professional screen
      navigation.navigate('FindingProfessional');
    } catch (error) {
      console.error('BOOKING ERROR:', error);

      Alert.alert(
        'Booking Error',
        error?.message || 'Something went wrong while booking.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 130,
        }}
      >
        {/* HERO */}
        <LinearGradient
          colors={[service.color, service.color + 'CC']}
          style={[
            styles.hero,
            {
              paddingTop: insets.top + 16,
            },
          ]}
        >
          <View style={styles.heroTopRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.heroBtn}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color="#fff"
              />
            </Pressable>

            <Pressable style={styles.heroBtn}>
              <Ionicons
                name="heart-outline"
                size={20}
                color="#fff"
              />
            </Pressable>
          </View>

          <View style={styles.heroIconWrap}>
            <Ionicons
              name={service.icon}
              size={64}
              color="#fff"
            />
          </View>
        </LinearGradient>

        {/* BODY */}
        <View style={styles.body}>
          {/* Gallery thumbnails */}
          <View style={styles.galleryRow}>
            {[
              service.icon,
              'image-outline',
              'image-outline',
              'image-outline',
            ].map((ic, i) => (
              <View
                key={i}
                style={[
                  styles.galleryThumb,
                  {
                    backgroundColor:
                      service.color +
                      (i === 0 ? '22' : '12'),
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={ic}
                  size={20}
                  color={service.color}
                />
              </View>
            ))}
          </View>

          <Animated.View entering={FadeInDown.duration(400)}>
            {/* TITLE */}
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.colors.text,
                  },
                ]}
              >
                {service.name}
              </Text>

              <Badge
                label={service.category}
                tone="primary"
                size="sm"
              />
            </View>

            {/* RATING */}
            <View style={styles.ratingRow}>
              <RatingStars
                rating={service.rating}
                showValue
                count={service.reviews}
              />

              <View style={styles.dotSep} />

              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.subtitle}
              />

              <Text
                style={{
                  color: theme.colors.subtitle,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {' '}
                {service.duration}
              </Text>
            </View>

            {/* ABOUT */}
            <Text
              style={[
                styles.sectionLabel,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              About this service
            </Text>

            <Text
              style={[
                styles.description,
                {
                  color: theme.colors.subtitle,
                },
              ]}
            >
              {service.description}
            </Text>

            {/* INCLUDED */}
            <Text
              style={[
                styles.sectionLabel,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              What's included
            </Text>

            {service.includes.map((inc) => (
              <View
                key={inc}
                style={styles.includeRow}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={theme.colors.success}
                />

                <Text
                  style={[
                    styles.includeText,
                    {
                      color: theme.colors.text,
                    },
                  ]}
                >
                  {inc}
                </Text>
              </View>
            ))}

            {/* TIME SLOT */}
            <Text
              style={[
                styles.sectionLabel,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              Select time slot
            </Text>

            <FlatList
              data={TIME_SLOTS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSlot(item)}
                  style={[
                    styles.slotChip,
                    {
                      backgroundColor:
                        slot === item
                          ? theme.colors.primary
                          : theme.colors.card,

                      borderColor:
                        slot === item
                          ? theme.colors.primary
                          : theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        slot === item
                          ? '#fff'
                          : theme.colors.text,

                      fontWeight: '700',
                      fontSize: 12,
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />

            {/* PROBLEM PHOTO & DESCRIPTION UPLOADER */}
            <ProblemUploader
              theme={theme}
              onPhotosChange={setPhotos}
              showAiAnalysis={true}
            />

            {/* SERVICE ADDRESS */}
            <Text
              style={[
                styles.sectionLabel,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              Service address
            </Text>

            <Pressable
              onPress={() =>
                setShowAddressSheet(true)
              }
              style={[
                styles.addressCard,
                {
                  backgroundColor:
                    theme.colors.card,

                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name={selectedAddress.icon}
                size={20}
                color={theme.colors.primary}
              />

              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}
              >
                <Text
                  style={[
                    styles.addressLabel,
                    {
                      color: theme.colors.text,
                    },
                  ]}
                >
                  {selectedAddress.label}
                </Text>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.addressLine,
                    {
                      color:
                        theme.colors.subtitle,
                    },
                  ]}
                >
                  {selectedAddress.line}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.subtitle}
              />
            </Pressable>

            {/* REVIEWS */}
            <Text
              style={[
                styles.sectionLabel,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              Ratings & Reviews
            </Text>

            {reviews.map((r) => (
              <View
                key={r.id}
                style={[
                  styles.reviewCard,
                  {
                    borderColor:
                      theme.colors.border,
                  },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Text
                    style={[
                      styles.reviewName,
                      {
                        color: theme.colors.text,
                      },
                    ]}
                  >
                    {r.name}
                  </Text>

                  <Text
                    style={{
                      color:
                        theme.colors.subtitle,
                      fontSize: 11,
                    }}
                  >
                    {r.time}
                  </Text>
                </View>

                <RatingStars
                  rating={r.rating}
                  size={13}
                />

                <Text
                  style={[
                    styles.reviewComment,
                    {
                      color:
                        theme.colors.subtitle,
                    },
                  ]}
                >
                  {r.comment}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>
      </ScrollView>

      {/* STICKY BOTTOM BAR */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor:
              theme.colors.card,

            borderColor:
              theme.colors.border,

            paddingBottom:
              insets.bottom + 14,
          },
        ]}
      >
        <View>
          <Text
            style={{
              color: theme.colors.subtitle,
              fontSize: 11,
              fontWeight: '600',
            }}
          >
            Total (Approx)
          </Text>

          <Text
            style={[
              styles.bottomPrice,
              {
                color: theme.colors.text,
              },
            ]}
          >
            ₹{service.price}
          </Text>
        </View>

        <Button
          title={
            bookingLoading
              ? 'Booking...'
              : 'Book Now'
          }
          onPress={handleBook}
          fullWidth={false}
          disabled={bookingLoading}
          style={{
            width: 170,
          }}
        />

        {bookingLoading && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={{
              position: 'absolute',
              right: 45,
            }}
          />
        )}
      </View>

      {/* ADDRESS BOTTOM SHEET */}
      <BottomSheet
        visible={showAddressSheet}
        onClose={() =>
          setShowAddressSheet(false)
        }
      >
        <Text
          style={[
            styles.sheetTitle,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Select address
        </Text>

        {(ctxAddresses || addresses).map(
          (a) => (
            <Pressable
              key={a.id}
              onPress={() => {
                setSelectedAddressId(a.id);
                setShowAddressSheet(false);
              }}
              style={[
                styles.sheetAddressRow,
                {
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name={a.icon}
                size={20}
                color={theme.colors.primary}
              />

              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}
              >
                <Text
                  style={[
                    styles.addressLabel,
                    {
                      color: theme.colors.text,
                    },
                  ]}
                >
                  {a.label}
                </Text>

                <Text
                  style={[
                    styles.addressLine,
                    {
                      color:
                        theme.colors.subtitle,
                    },
                  ]}
                >
                  {a.line}
                </Text>
              </View>

              {selectedAddressId ===
                a.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.success}
                />
              )}
            </Pressable>
          )
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 220,
    paddingHorizontal: 20,
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heroBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor:
      'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroIconWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    paddingHorizontal: 20,
    marginTop: -24,
  },

  galleryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },

  galleryThumb: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
    flex: 1,
    marginRight: 10,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },

  dotSep: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 8,
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 10,
  },

  description: {
    fontSize: 13.5,
    lineHeight: 21,
    marginBottom: 4,
  },

  includeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },

  includeText: {
    fontSize: 13.5,
    fontWeight: '500',
  },

  slotChip: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 10,
  },

  photoRow: {
    flexDirection: 'row',
    gap: 10,
  },

  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  photoAdd: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },

  addressLabel: {
    fontSize: 14,
    fontWeight: '700',
  },

  addressLine: {
    fontSize: 12,
    marginTop: 2,
  },

  reviewCard: {
    borderTopWidth: 1,
    paddingVertical: 14,
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  reviewName: {
    fontSize: 13.5,
    fontWeight: '700',
  },

  reviewComment: {
    fontSize: 12.5,
    marginTop: 6,
    lineHeight: 18,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },

  bottomPrice: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },

  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 16,
  },

  sheetAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
  },
});