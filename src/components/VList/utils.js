// 二分查找
/** 查找起始位置索引
 *  传入元素位置信息，和当前的 scrollTop  找到对应位置的 start索引
 * @export
 * @param {*} list
 * @param {*} value
 * @return {*} startIndex
 */
export function binarySearch(list, value) {
    let start = 0;
    let end = list.length - 1;
    let tempIndex = null;
    while (start <= end) {
        let midIndex = parseInt((start + end) / 2);
        let midValue = list[midIndex].bottom;
        if (midValue === value) {
            return midIndex + 1;
        } else if (midValue < value) {
            start = midIndex + 1;
        } else if (midValue > value) {
            if (tempIndex === null || tempIndex > midIndex) {
                tempIndex = midIndex;
            }
            end = end - 1;
        }
    }
    return tempIndex;
}
