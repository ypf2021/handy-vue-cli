<template>
  <div
    ref="list"
    :style="{ height }"
    class="infinite-list-container"
    @scroll="scrollEvent($event)"
  >
    <div ref="phantom" class="infinite-list-phantom"></div>
    <div ref="content" class="infinite-list">
      <div
        ref="items"
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item._index"
        :id="item._index"
      >
        <slot ref="Slot" :item="item.item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { binarySearch } from "./utils";
export default {
  name: "VirtualList",
  props: {
    //所有列表数据
    listData: {
      type: Array,
      default: () => [],
    },

    // 每一项的预估高度
    estimatedItemSize: {
      type: Number,
      require: true,
    },

    // 容器的高度
    height: {
      type: String,
      default: "100%",
    },

    // 缓冲区域和真实显示区域的比例
    bufferScale: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    // 简单处理一下数据，呈现时呈现的是这个里面的item
    _listData() {
      return this.listData.map((item, index) => {
        return {
          // 加了一个 _index
          _index: `${index}`,
          item,
        };
      });
    },

    //可显示的列表项数
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize);
    },

    //获取真实显示列表数据
    visibleData() {
      console.log(this.aboveCount);
      let start = this.start - this.aboveCount;
      console.log("start:", this.start);
      let end = this.end + this.belowCount;
      // 将缓存区的数据也截取出来，但显示还是根据 this.start 计算 offsetTop 的
      return this._listData.slice(start, end);
    },

    // 上面的缓存数据
    aboveCount() {
      return Math.min(this.start, this.bufferScale * this.visibleCount);
    },
    // 下面的缓存数据
    belowCount() {
      return Math.min(
        this.listData.length - this.end,
        this.bufferScale * this.visibleCount
      );
    },
  },

  created() {
    this.initPositions();
  },

  updated() {
    this.$nextTick(function () {
      if (!this.$refs.items || !this.$refs.items.length) {
        return;
      }
      //获取真实元素大小，修改对应的尺寸缓存
      this.updateItemsSize();
      //更新列表总高度
      let height = this.positions[this.positions.length - 1].bottom;
      this.$refs.phantom.style.height = height + "px";
      //更新真实偏移量
      this.setStartOffset();
    });
  },

  mounted() {
    this.screenHeight = this.$el.clientHeight;
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  data() {
    return {
      //可视区域高度
      screenHeight: 0,
      //起始索引
      start: 0,
      //结束索引
      end: null,
    };
  },
  methods: {
    scrollEvent() {
      //当前滚动位置
      let scrollTop = this.$refs.list.scrollTop;
      //此时的开始索引
      this.start = this.getStartIndex(scrollTop);
      //此时的结束索引
      this.end = this.start + this.visibleCount;
      //此时的偏移量
      this.setStartOffset();
    },

    initPositions() {
      // 初始化每一个元素的位置
      this.positions = this.listData.map((d, index) => ({
        index,
        height: this.estimatedItemSize,
        top: index * this.estimatedItemSize,
        bottom: (index + 1) * this.estimatedItemSize,
      }));
    },

    // 获取列表起始索引
    getStartIndex(scrollTop = 0) {
      return binarySearch(this.positions, scrollTop);
    },

    //渲染完成后获取列表项的当前真实尺寸 修改 this.positions值
    updateItemsSize() {
      let nodes = this.$refs.items;
      nodes.forEach((node) => {
        // 获取渲染之后的结果位置信息
        let rect = node.getBoundingClientRect();
        let height = rect.height;
        let index = +node.id.slice(1);
        let oldHeight = this.positions[index].height;
        let dValue = oldHeight - height;
        //存在差值
        if (dValue) {
          this.positions[index].bottom = this.positions[index].bottom - dValue;
          this.positions[index].height = height;

          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom;
            this.positions[k].bottom = this.positions[k].bottom - dValue;
          }
        }
      });
    },

    //获取当前的偏移量 偏移量就是滚动条所处在的位置
    setStartOffset() {
      let startOffset;
      if (this.start >= 1) {
        let size =
          this.positions[this.start].top -
          (this.positions[this.start - this.aboveCount]
            ? this.positions[this.start - this.aboveCount].top
            : 0);
        startOffset = this.positions[this.start - 1].bottom - size;
      } else {
        startOffset = 0;
      }
      this.$refs.content.style.transform = `translate3d(0,${startOffset}px,0)`;
    },
  },
};
</script>

<style scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>