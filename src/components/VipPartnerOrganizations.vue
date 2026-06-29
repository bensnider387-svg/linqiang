<template>
  <div v-if="organizations.length > 0 && !loading" class="partner-footer">
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
import { getVipPartnerOrganizations, type PartnerOrganization } from '../api/module/partnerOrganizations';
import { DEFAULT_PARTNER_SECTION_TITLE, normalizePartnerSectionTitle } from '../utils/partnerOrganizations';

const organizations = ref<PartnerOrganization[]>([]);
const loading = ref(false);
const sectionTitle = ref(DEFAULT_PARTNER_SECTION_TITLE);

const loadOrganizations = async () => {
  try {
    loading.value = true;
    const response = await getVipPartnerOrganizations();
    if (response.success) {
      if (Array.isArray(response.data)) {
        organizations.value = response.data;
      } else if (response.data && typeof response.data === 'object') {
        organizations.value = Object.values(response.data);
      } else {
        organizations.value = [];
      }
      sectionTitle.value = normalizePartnerSectionTitle(response.section_title);
    }
  } catch (error) {
    console.error('Failed to load VIP partner organizations:', error);
    organizations.value = [];
  } finally {
    loading.value = false;
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
  background: linear-gradient(120deg, #181c2b 0%, #23243a 100%);
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  padding: 32px 16px;
  width: 100%;
}

.partner-wrap {
  max-width: 1100px;
  margin: 0 auto;
}

.partner-title {
  margin: 0 0 20px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffd700;
  text-align: center;
}

.partner-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.partner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 110px;
  padding: 12px 10px;
  background: rgba(35, 43, 62, 0.6);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.partner-card:hover {
  border-color: rgba(255, 215, 0, 0.4);
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
  color: #ffd700;
  font-size: 1.25rem;
}

.partner-name {
  width: 100%;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  line-height: 1.35;
  word-break: break-word;
}

@media (max-width: 768px) {
  .partner-footer {
    padding: 24px 12px;
  }

  .partner-card {
    width: calc(33.333% - 7px);
    min-width: 96px;
    max-width: 120px;
  }

  .partner-logo {
    width: 44px;
    height: 44px;
  }
}
</style>
