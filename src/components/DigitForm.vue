<template>
  <div class="flex items-center gap-2">
    <van-button
      icon="arrow-left"
      size="small"
      @click="onDelta(-0.05)"
    />

    <div>{{ label }}</div>

    <van-button
      icon="arrow"
      size="small"
      @click="onDelta(0.05)"
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
  return Math.round(value.value * 100) + '%'
})

///

const onDelta = (delta: number) => {
  let number = value.value + delta
  if (number < 0.5) { number = 0.5 }
  if (number > 2) { number = 2 }

  value.value = Math.round(number * 100) / 100
}
</script>
