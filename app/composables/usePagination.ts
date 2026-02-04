import { ref, computed, watch, type Ref } from 'vue'

export interface PaginationOptions {
  initialPage?: number
  initialPageSize?: number
}

export function usePagination<T>(data: Ref<T[]>, options: PaginationOptions = {}) {
  const currentPage = ref(options.initialPage || 1)
  const pageSize = ref(options.initialPageSize || 10)
  const pageSizes = [10, 25, 50]

  const totalItems = computed(() => data.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

  watch(data, () => {
    currentPage.value = 1
  })

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return data.value.slice(start, start + pageSize.value)
  })

  const rangeStart = computed(() => 
    data.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
  )

  const rangeEnd = computed(() => 
    Math.min(currentPage.value * pageSize.value, data.value.length)
  )

  function prevPage() {
    if (currentPage.value > 1) currentPage.value--
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++
  }

  return {
    currentPage,
    pageSize,
    pageSizes,
    totalPages,
    totalItems,
    paginatedData,
    rangeStart,
    rangeEnd,
    prevPage,
    nextPage,
  }
}
