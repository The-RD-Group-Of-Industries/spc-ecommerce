import { useEffect } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";

export default function NotFoundCatchAll() {
  const linkTo = useRouter();

  useEffect(() => {
    // When unknown route comes, fallback to index or do nothing
    linkTo.replace("/"); // Or stay silent if you prefer
  }, []);

  return <Text>Redirecting...</Text>;
}
