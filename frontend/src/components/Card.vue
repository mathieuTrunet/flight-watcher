<template>
  <div>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@import '../styles/main.scss';

div {
  background: $space-back;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.4px);
  -webkit-backdrop-filter: blur(7.4px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding-inline: 8px;
}
</style>
