import { FlatList, View } from "react-native";
import Posts, { PostType } from "@/constants/posts";
import SingleStory from "../SingleStory";

const Story = () => {
  return (
    <View>
      <FlatList
        data={Posts} // Assuming Posts contains unique users for stories or can be adapted
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
        }}
        style={{
          paddingVertical: 16,
          marginLeft: 12,
        }}
        renderItem={({ item }: { item: PostType }) => (
          <SingleStory
            imageUrl={item.user.avatar_url}
            size={75}
            user={item.user} // Pass the user object
          />
        )}
        keyExtractor={(item, index) => `story-${item.user.id}-${index}`} // Ensure unique keys if users can have multiple "story" entries from posts
      />
    </View>
  );
};

export default Story;
