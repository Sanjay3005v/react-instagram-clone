import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react"; // इंश्योर useEffect and useState are imported
import Posts from "@/constants/posts";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons"; // Added Ionicons
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const StoryUI = () => {
  const params = useLocalSearchParams<{
    userId?: string;
    postImageUrl?: string;
    username?: string;
    userAvatar?: string;
  }>();

  // State for multi-story view (from user's stories)
  const initialUserIndex = params.userId
    ? Posts.findIndex((p) => p.user.id === params.userId)
    : -1;
  const [userIndex, setUserIndex] = useState(
    initialUserIndex !== -1 ? initialUserIndex : 0,
  );
  const [storyIndex, setStoryIndex] = useState(0);

  useEffect(() => {
    if (params.userId) {
      const newUserIndex = Posts.findIndex((p) => p.user.id === params.userId);
      if (newUserIndex !== -1) {
        setUserIndex(newUserIndex);
        setStoryIndex(0);
      }
    }
  }, [params.userId]);

  // Determine mode: single post view or user story view
  const isSinglePostView = !!params.postImageUrl;

  let displayImageUrl: string | null = null;
  let displayUsername: string = "";
  let displayUserAvatar: string | undefined = undefined;
  let displayStories: string[] = []; // For indicators in multi-story view

  if (isSinglePostView) {
    displayImageUrl = params.postImageUrl!;
    displayUsername = params.username || "User";
    displayUserAvatar = params.userAvatar;
  } else {
    const currentUserData = Posts[userIndex];
    if (currentUserData) {
      displayStories = currentUserData.images.length > 0 ? currentUserData.images : [];
      displayImageUrl = displayStories.length > 0 ? displayStories[storyIndex] : null;
      displayUsername = currentUserData.user.username;
      displayUserAvatar = currentUserData.user.avatar_url;
    } else {
      // Fallback or error state if userIndex is out of bounds (should not happen with findIndex logic)
      displayImageUrl = null;
      displayUsername = "Unknown User";
    }
  }

  const goToPreviousStory = () => {
    setStoryIndex((index) => {
      if (index === 0) {
        goToPrevUser(); // Navigate to previous user's stories
        return 0; // This will be reset by useEffect for the new user
      }
      return index - 1;
    });
  };

  const goToPrevUser = () => {
    setUserIndex((prevUserIndex) => {
      if (prevUserIndex === 0) {
        // Optionally, loop back to the last user or do nothing
        return Posts.length - 1; // Loop to last user
        // return prevUserIndex; // Stay on first user
      }
      return prevUserIndex - 1;
    });
    setStoryIndex(0); // Reset story index for the new user
  };

  const goToNextStory = () => {
    if (isSinglePostView) return; // No next/prev for single post view
    const currentUserData = Posts[userIndex];
    const currentStories = currentUserData.images;
    setStoryIndex((index) => {
      if (index === currentStories.length - 1) {
        goToNextUser(); // Navigate to next user's stories
        return 0; // This will be reset by useEffect for the new user
      }
      return index + 1;
    });
  };

  const goToNextUser = () => {
    setUserIndex((prevUserIndex) => {
      if (prevUserIndex === Posts.length - 1) {
        // Optionally, loop back to the first user, or exit
        // router.back(); // Exit after last user
        return 0; // Loop to first user
        // return prevUserIndex; // Stay on last user
      }
      return prevUserIndex + 1;
    });
    setStoryIndex(0); // Reset story index for the new user
  };

  return (
    <View style={styles.container}>
      {displayImageUrl ? (
        <Image
          source={{
            uri: displayImageUrl,
          }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.centeredContent]}>
          <Text style={{ color: "white", textAlign: "center" }}>
            {isSinglePostView ? "Post not available." : "No story available."}
          </Text>
        </View>
      )}

      {!isSinglePostView && displayStories.length > 1 && ( // Only show nav for multi-story
        <>
          <Pressable
            style={[styles.navPressable, { left: 0 }]}
            onPress={goToPreviousStory}
          />
          <Pressable
            style={[styles.navPressable, { right: 0 }]}
            onPress={goToNextStory}
          />
        </>
      )}
       <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>


      <View style={styles.header}>
        {!isSinglePostView && displayStories.length > 0 && (
          <View style={styles.indicatorRow}>
            {displayStories.map((_, index) => {
              const color = index === storyIndex ? "white" : "gray"; // Highlight current story
              return (
                <View
                  key={index}
                  style={[styles.indicator, { backgroundColor: color }]}
                />
              );
            })}
          </View>
        )}

        <View style={styles.profileContainer}>
          {displayUserAvatar && (
            <Image
              source={{ uri: displayUserAvatar }}
              style={styles.avatarSmall} // Consistent avatar style
            />
          )}
          <Text style={styles.username}>{displayUsername}</Text>
        </View>
      </View>

      {/* Footer can be conditional or adapted based on view type */}
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Send Message"
          placeholderTextColor={"white"}
        />
        <FontAwesome name="heart-o" size={28} color="white" />
        <Feather name="send" size={28} color="white" />
      </View>
    </View>
  );
};

export default StoryUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    flex: 1,
  },
  header: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    top: 0,
    width: "100%",
    padding: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {
    color: "white",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    width: "100%",
    backgroundColor: "black",
  },
  input: {
    borderWidth: 1,
    flex: 1,
    color: "white",
    borderColor: "gray",
    padding: 10,
    borderRadius: 50,
  },
  navPressable: {
    position: "absolute",
    width: "35%",
    height: "100%",
  },
  indicatorRow: {
    gap: 5,
    marginBottom: 8,
    flexDirection: "row",
  },
  indicator: {
    flex: 1,
    borderRadius: 4,
    height: 2,
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSmall: {
    width: 32, // Adjusted size
    height: 32, // Adjusted size
    borderRadius: 16, // Half of width/height
    marginRight: 8, // Added some margin
  },
  backButton: {
    position: "absolute",
    top: 40, // Adjust as needed for status bar height
    left: 10,
    zIndex: 10, // Ensure it's above other elements
    padding: 8, // Add some padding for easier touch
  },
});
