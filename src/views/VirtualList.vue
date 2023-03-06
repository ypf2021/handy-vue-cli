<template>
  <div style="height: 400px; width: 1000px; margin: 0 auto; border: 1px solid">
    <vlist
      :listData="data"
      :itemSize="100"
      v-slot="slotProps"
      :estimatedItemSize="70"
    >
      <Item :item="slotProps.item"></Item>
    </vlist>
  </div>
</template>

<script>
import vlist from "@/components/VList/index.vue";
import Item from "@/components/VList/Item.vue";
import faker from "faker";

let data = [];
for (let id = 0; id < 1000; id++) {
  data.push({
    id,
    value: faker.lorem.sentences(), // 长文本
  });
}
export default {
  components: {
    vlist,
    Item,
  },
  data() {
    return {
      data,
    };
  },
};
</script>

<style></style>
