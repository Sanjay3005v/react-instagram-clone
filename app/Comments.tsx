import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { useTheme } from "@/utils/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock comments data structure
interface MockComment {
  id: string;
  text: string;
  user: string;
}

const mockCommentsData: { [postId: string]: MockComment[] } = {
  "1": [
    { id: "c1", text: "Great shot!", user: "userA" },
    { id: "c2", text: "Love this!", user: "userB" },
  ],
  "2": [{ id: "c3", text: "Amazing!", user: "userC" }],
  // Add more mock comments for other postIds if needed
};

const Comments = () => {
  const { theme } = useTheme();
  const { background, text } = theme.colors;
  const params = useLocalSearchParams<{ postId?: string }>();
  const postId = params.postId;

  const comments = postId ? mockCommentsData[postId] || [] : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.header, { color: text }]}>
        Comments for Post {postId || "N/A"}
      </Text>
      {postId ? (
        comments.length > 0 ? (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={[styles.commentUser, { color: text }]}>
                  {item.user}
                </Text>
                <Text style={[styles.commentText, { color: text }]}>
                  {item.text}
                </Text>
              </View>
            )}
            style={{ width: "100%" }}
          />
        ) : (
          <Text style={[styles.noCommentsText, { color: text }]}>
            No comments yet for this post.
          </Text>
        )
      ) : (
        <Text style={[styles.noCommentsText, { color: text }]}>
          No post selected.
        </Text>
      )}
    </SafeAreaView>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 16,
  },
  noCommentsText: {
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
});
