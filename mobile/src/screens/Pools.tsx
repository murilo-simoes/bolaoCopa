import { useCallback, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import Button from "../components/Button";
import { Header } from "../components/Header";
import { Octicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { PoolCard, PoolCardPros } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardPros[]>([]);
  const toast = useToast();
  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get("/pools");
      setPools(response.data.pools);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os bolões!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [])
  );

  return (
    <VStack flex={1} bgColor={"gray.900"}>
      <Header title="Meus bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size={"md"} />
          }
          title={"BUSCAR BOLÃO POR CÓDIGO"}
          onPress={() => navigate("find")}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate("details", { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}

      {/* <Loading /> */}
    </VStack>
  );
}
