import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
// import { useNotifications } from '@/hooks/useNotifications';

export default function Notifications() {
  // const { notifications } = useNotifications();

  return (
    <Screen>
      <Header title="Notifications" />

      {/* <FlatList
        data={notifications}
        keyExtractor={(item) => item?.$id}
        renderItem={({ item }) => (
          <Text>{item?.type}</Text>
        )}
      /> */}
    </Screen>
  );
}
