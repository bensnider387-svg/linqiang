<template>
  <div
    class="global-tab"
    v-if="appStore.tab"
    :class="appStore.tagsTheme === 'designer' ? 'designer' : ''"
  >
    <div class="global-tab-list">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="global-tab-item"
        :class="{ 'is-active': currentPath === tab.id }"
        @click="to(tab.id)"
      >
        <span class="dot"></span>
        <span class="global-tab-title">{{ tab.title }}</span>
        <lay-icon
          v-if="tab.closable !== false"
          type="layui-icon-close"
          class="global-tab-close"
          @click.stop="close(tab.id)"
        />
      </div>
    </div>
    <lay-dropdown>
      <lay-icon
        type="layui-icon-down"
        :class="appStore.tagsTheme === 'designer' ? 'designer-last-icon' : 'global-tab-menu'"
      ></lay-icon>
      <template #content>
        <lay-dropdown-menu>
          <lay-dropdown-menu-item @click="closeAll">
            关闭全部
          </lay-dropdown-menu-item>
        </lay-dropdown-menu>
        <lay-dropdown-menu>
          <lay-dropdown-menu-item @click="closeOther">
            关闭其他
          </lay-dropdown-menu-item>
        </lay-dropdown-menu>
        <lay-dropdown-menu>
          <lay-dropdown-menu-item @click="closeCurrent">
            关闭当前
          </lay-dropdown-menu-item>
        </lay-dropdown-menu>
      </template>
    </lay-dropdown>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlobalTab'
}
</script>

<script lang="ts" setup>
import { useAppStore } from '../../store/app'
import { useTab } from '../composable/useTab'

const appStore = useAppStore()
const { tabs, to, close, closeAll, closeOther, closeCurrent, currentPath } = useTab()
</script>

<style lang="less">
.global-tab {
  display: flex;
  align-items: stretch;
  flex: 0 0 auto;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-top: 1px solid whitesmoke;
  background: #fff;
  z-index: 999;
  min-height: 40px;
}

.global-tab-list {
  display: flex;
  align-items: stretch;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.global-tab-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  font-size: 14px;
  color: dimgray;
  cursor: pointer;
  border-right: 1px solid whitesmoke;
  flex-shrink: 0;
  user-select: none;
}

.global-tab-item.is-active {
  color: var(--global-primary-color, #009688);
}

.global-tab-item .dot {
  display: inline-block;
  background-color: whitesmoke;
  margin-right: 4px;
  border-radius: 50px;
  height: 8px;
  width: 8px;
}

.global-tab-item.is-active .dot {
  background-color: var(--global-primary-color, #009688);
}

.global-tab-close {
  margin-left: 6px;
  font-size: 12px !important;
  color: #999;
}

.global-tab-close:hover {
  color: #ff5722;
}

.global-tab-menu {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-left: 1px solid whitesmoke;
  background: #fff;
  flex-shrink: 0;
}

.global-tab.designer {
  box-shadow: unset;
  padding-left: 5px;
  min-height: 37px;
}

.global-tab.designer .global-tab-list {
  align-items: flex-end;
  padding-top: 5px;
}

.global-tab.designer .global-tab-item {
  height: 32px;
  line-height: 32px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  background: #fff;
}

.designer-last-icon {
  width: 32px !important;
  height: 32px !important;
  background: white;
  margin-top: 5px;
  line-height: 32px !important;
  text-align: center;
  border-radius: 4px;
  border-left: none !important;
}
</style>
