import { useState, useEffect } from "react";
import { Share } from "react-native";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";
import { Header } from "../components/Header";

import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { Option } from "../components/Option";
import { PoolCardPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";

interface RouteParams {
  id: string;
}

export function Details() {
  const route = useRoute();
  const toast = useToast();
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>(
    {} as PoolCardPros
  );
  const { id } = route.params as RouteParams;

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: "Entre nesse bolão com o código " + poolDetails.code,
    });
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <VStack flex={1} bgColor={"gray.900"}>
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor={"gray.800"} p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "guesses" ? true : false}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do Grupo"
              isSelected={optionSelected === "ranking" ? true : false}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>
          <Guesses poolId={poolDetails.id} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
