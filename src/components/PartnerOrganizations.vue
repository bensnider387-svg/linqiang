<template>
  <div v-if="organizations.length > 0" class="partner-footer">
    <div class="partner-wrap">
      <h3 class="partner-title">{{ sectionTitle }}</h3>
      <div class="partner-list">
        <div
          v-for="org in organizations"
          :key="org.id"
          class="partner-card"
          @click="handleClick(org)"
        >
          <div class="partner-logo">
            <img
              v-if="org.logo_url"
              :src="org.logo_url"
              :alt="org.name"
              @error="handleImageError"
            />
            <div v-else class="partner-logo-placeholder">
              <i class="bi bi-building"></i>
            </div>
          </div>
          <div class="partner-name">{{ org.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPartnerOrganizations, type PartnerOrganization } from '../api/module/partnerOrganizations';
import { DEFAULT_PARTNER_SECTION_TITLE, normalizePartnerSectionTitle } from '../utils/partnerOrganizations';

const organizations = ref<PartnerOrganization[]>([]);
const sectionTitle = ref(DEFAULT_PARTNER_SECTION_TITLE);

const loadOrganizations = async () => {
  try {
    const response = await getPartnerOrganizations();
    if (response.success && response.data) {
      organizations.value = response.data;
      sectionTitle.value = normalizePartnerSectionTitle(response.section_title);
    }
  } catch (error) {
    console.error('Failed to load partner organizations:', error);
  }
};

const handleClick = (org: PartnerOrganization) => {
  if (org.website_url) {
    window.open(org.website_url, '_blank');
  }
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
  const placeholder = img.nextElementSibling as HTMLElement;
  if (placeholder) {
    placeholder.style.display = 'flex';
  }
};

onMounted(() => {
  loadOrganizations();
});
</script>

<style scoped>
.partner-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 32px 16px;
  margin-top: 32px;
  padding-bottom: calc(32px + env(safe-area-inset-bottom, 0px));
}

.partner-wrap {
  max-width: 1100px;
  margin: 0 auto;
}

.partner-title {
  margin: 0 0 20px;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
}

.partner-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
}

.partner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 110px;
  padding: 12px 10px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.partner-card:hover {
  border-color: rgba(102, 126, 234, 0.35);
  background: var(--bg-glass-hover);
}

.partner-logo {
  width: 52px;
  height: 52px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.partner-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.partner-logo-placeholder {
  display: none;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: 1.25rem;
}

.partner-name {
  width: 100%;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.35;
  word-break: break-word;
}

@media (max-width: 768px) {
  .partner-footer {
    padding: 24px 12px calc(80px + env(safe-area-inset-bottom, 0px));
    margin-top: 24px;
  }

  .partner-title {
    font-size: 1rem;
    margin-bottom: 16px;
  }

  .partner-list {
    gap: 10px;
  }

  .partner-card {
    width: calc(33.333% - 7px);
    min-width: 96px;
    max-width: 120px;
    padding: 10px 8px;
  }

  .partner-logo {
    width: 44px;
    height: 44px;
    margin-bottom: 6px;
  }

  .partner-name {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .partner-card {
    width: calc(50% - 5px);
    max-width: none;
  }
}
</style>
