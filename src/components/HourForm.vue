<template>
  <div class="flex items-center gap-2">
    <van-button
      icon="arrow-left"
      size="small"
      @click="onDelta(-1)"
    />

    <div class="w-3rem text-center">
      {{ label }}
    </div>

    <van-button
      icon="arrow"
      size="small"
      @click="onDelta(1)"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: number,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value?: number): void,
}>()

const value = computed({
  get: () => props.modelValue ?? 1,
  set: (value?: number) => emit('update:modelValue', value),
})

const label = computed(() => {
  return value.value + ' 時'
})

///

const onDelta = (delta: number) => {
  let number = value.value + delta
  if (number <= -1) { number = 23 }
  if (number >= 24) { number = 0 }

  value.value = number
}
</script>
