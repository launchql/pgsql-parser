import { For, useMetadata } from "@genomoic/stubs";
import Stack from "../stack";
import Box from "../box";
import BondingCard from "../bonding-card";
import { BondingCardListProps } from "./bonding-card-list.types";
import { BondingCardProps } from "../bonding-card/bonding-card.types";

useMetadata({
  rsc: {
    componentType: "client",
  },
});

export default function PoolCardList(props: BondingCardListProps) {
  return (
    <Box>
      <Stack
        space="$10"
        attributes={{
          flexWrap: "nowrap",
        }}
      >
        <For each={props.list}>
          {(item: BondingCardProps, index: number) => (
            <Box width="33.33%" key={item.title}>
              <BondingCard
                title={item.title}
                value={item.value ? `${item.value.toFixed(2)}%` : "0%"}
              />
            </Box>
          )}
        </For>
      </Stack>
    </Box>
  );
}
