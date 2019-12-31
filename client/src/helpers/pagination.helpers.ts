export const determineNewPageNumber = (
    currentPage: number,
    currentPageSize: number,
    newPageSize: number,
    useTopIndex: boolean = true
  ): number => {
    const currentIndex =
      Math.max(1, currentPage * currentPageSize - (useTopIndex ? currentPageSize : 0)) + 1;
    let newPage = currentIndex / newPageSize;
    newPage = newPage % 1 === 0 ? newPage : newPage++;
    return Math.floor(newPage) + 1; // 1 indexed
}
