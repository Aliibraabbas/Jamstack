<script setup lang="ts">
// import { ref, watch } from 'vue';

import type { Player } from '~/models/player.model';
import type { Meta } from "~/models/strapi.model";
import type { Competition } from "~/models/competition.model";

const { find } = useStrapi4();
const competitions = ref<{ data: Competition[] }>({ data: [] });
const players = ref<{ data: Player[], meta: Meta }>({ data: [], meta: {} });
const filters = ref<string[]>([]);
const page = ref(1);
const pageSize = ref(5);

const {  pending: playersPending, refresh: refreshPlayers } = useAsyncData('players', async () => {
  players.value = await find<{ data: Player[], meta: Meta }>('players', {
    populate: '*',
    pagination: {
      page: page.value,
      pageSize: pageSize.value
    },
    filters: {
      competitions: {
        name: {
          $in: filters.value
        }
      }
    }
  });
}, {
  watch: [page, filters],
});

const { pending: competitionsPending } = useAsyncData('competitions', async () => {
  competitions.value = await find<{ data: Competition[] }>('competitions');
});

const addFilter = (filter: string) => {
  if (!filters.value.includes(filter)) {
    filters.value.push(filter);
  } else {
    filters.value = filters.value.filter(f => f !== filter);
  }
  refreshPlayers();
};

</script>

<template>
    
    <template v-if="competitionsPending">
          <span>Loading Competitions....</span>
      </template>
  
      <template v-else>
          <div class="">
              <h3>Compétitions</h3>
              <button v-for="competition in competitions?.data"
              :key="competition.id"
              :class="[filters.includes(competition.name) ? 'bg-gray-300 ' : ' bg-white']" 
              @click="addFilter(competition.name)">
                  {{ competition.name }}
              </button>
          </div>
      </template>
  
      <template v-if="playersPending">
          <span>Loading players....</span>
      </template>
  
      <template v-else>
          <div class="">
              <div v-for="player in players?.data" :key="player.slug">
                  <a :href="`/players/${player.slug}`" class="underline">
                      <h2>{{player.first_name}} {{player.last_name}}</h2>
                  </a>
              </div>
              <UPagination v-if="players?.meta && players?.meta.pagination.pagecount > 1" 
                          v-model="page" 
                          :page-count="players?.meta.pagination.pagecount" 
                          :total="players?.Meta.pagination.total"
                          class=""
              />
          </div>
      </template>
  </template>

  
  <style scoped>
        .active {
            background-color: #000;
            color: #fff;
        }

        button {
            margin: 0 5px;
            padding: 5px 10px;
            border: 1px solid #000;
            border-radius: 5px;
            cursor: pointer;
        }

        button.active {
            background-color: #000;
            color: #fff;
        }

        .underline {
            text-decoration: underline;
        }

        .pagination {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .pagination button {
            margin: 0 5px;
            padding: 5px 10px;
            border: 1px solid #000;
            border-radius: 5px;
            cursor: pointer;
        }

        .pagination button.active {
            background-color: #000;
            color: #fff;
        }
  </style>
  