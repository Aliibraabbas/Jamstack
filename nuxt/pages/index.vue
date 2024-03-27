<script setup lang="ts">
// import { ref, watch } from 'vue';

import type { Player } from '~/models/player.model';
import type { Meta } from "~/models/strapi.model";
import type { Competition } from "~/models/competition.model";
import Fuse from 'fuse.js'

const { find } = useStrapi4();


// const competitions = ref<{ data: Competition[] }>({ data: [] });
// const players = ref<{ data: Player[], meta: Meta }>({ data: [], meta: {} });
const filters = ref<string[]>([]);
const search = ref<string>('')
const page = ref(1);
const pageSize = ref(4);

const { data: players, pending: playersPending, refresh: refreshPlayers } = useAsyncData('players', () => find<{ 
        data: Player[],
        meta: Meta
        }>('players', { 
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
                },
            }
        }), {
            watch: [page, filters],
        }
    )

    const { data: searchedPlayers, pending: searchedPlayersPending } = useAsyncData('searchedPlayers',() => find<{
        data: Player[] 
        }>('players', { 
            populate: '*',
            filters: {
                competitions: {
                    name: {
                        $in: filters.value
                    }
                },
            }
        }),  {
            watch: [filters, search],
        }
    )

    const { data: competitions, pending: competitionsPending } = useAsyncData('competitions',
        () => find<{ data: Competition[] }>('competitions')
    )

    const addFilter = (filter: string) => {
        if(!filters.value.includes(filter)) {
            filters.value.push(filter)
        } else {
            filters.value = filters.value.filter(f => f !== filter)
        }
        refreshPlayers()
    }



    let fuse: Fuse<Player> | null = null;
    let searchResults = ref<Player[]>([]);

    watch(searchedPlayers, () => {
      if (searchedPlayers.value) {
        fuse = new Fuse(searchedPlayers.value.data, {
          keys: ['first_name' , 'last_name'],
          threshold: 0.1
        });
      }
    });

    const searchPlayers = () => {
      if (fuse) {
        searchResults.value = fuse.search(search.value).map((result: Fuse.FuseResult<Player>) => result.item);
      } else {
        searchResults.value = [];
      }
    }

    // watch(search, () => {
    //   searchPlayers();
    // });

    // onMounted(() => {
    //     if (!competitions.value) {
    //         find<{ data: Competition[] }>('competitions')
    //     }
    // })

    // onUnmounted(() => {
    //     filters.value = []
    // })

    // onBeforeUnmount(() => {
    //     filters.value = []
    // })


</script>

<template>

    <div class="search-container">
      <input class="search-input" type="text" v-model="search" @input="searchPlayers" placeholder="Search">
      <template v-if="!search">
      </template>
    </div>
  
    <template v-if="!search">
      <div class="competitions-container"> 
        <template v-if="competitionsPending">
          <span class="loading-message">Loading Competitions....</span>
        </template>
        <template v-else>
          <div class="competition-buttons">
            <button v-for="competition in competitions?.data"
                    :key="competition.id"
                    :class="[filters.includes(competition.name) ? 'bg-gray-200' : 'bg-white', 'competition-button']" 
                    @click="addFilter(competition.name)"
                    >
              {{ competition.name }}
            </button>
          </div>
        </template>
      </div>
  
      <div class="players-container">
        <template v-if="playersPending">
          <span class="loading-message">Loading players....</span>
        </template>
        <template v-else>
          <div class="player-items">
            <div v-for="player in (search ? searchResults : players?.data)" :key="player.slug" class="player-item">
              <a :href="`/players/${player.slug}`" class="player-link">
                <NuxtImg v-if="player.image" :src="player.image?.url" :alt="player.slug" class="player-image" />
                <div class="player-details">
                  <div class="player-ranking">Ranking: {{player.ranking}}</div>
                  <h2 class="player-name">{{player.first_name}} {{player.last_name}}</h2>
                </div>
              </a>
            </div> 
          </div>
        </template>
        <UPagination v-if="players?.meta && players?.meta.pagination.pageCount > 1" 
                    v-model="page" 
                    :page-count="pageSize" 
                    :total="players?.meta.pagination.total"
                    class="pagination"
        /> 
      </div>
    </template>
  
    <template v-else>
      <div class="searched-players-container">
        <template v-if="searchedPlayersPending">
          <span class="loading-message">Loading players....</span>
        </template>
        <template v-else>
          <div class="player-items">
            <div v-for="player in (search ? searchResults : searchedPlayers?.data)" :key="player.slug" class="player-item">
              <a :href="`/players/${player.slug}`" class="player-link">
                <NuxtImg v-if="player.image" :src="player.image?.url" :alt="player.slug" class="player-image" />
                <div class="player-details">
                  <div class="player-ranking">{{player.ranking}}</div>
                  <h2 class="player-name">{{player.first_name}} {{player.last_name}}</h2>
                </div>
              </a>
            </div> 
          </div>
        </template>
      </div>
    </template>
  
  </template>
  
  
  <style scoped>
        /* .active {
            background-color: #000;
            color: #fff;
        } */



        /* button.active {
            background-color: #000;
            color: #fff;
        } */

        /* .underline {
            text-decoration: underline;
        } */

        /* .pagination {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        } */

        /* .pagination button {
            margin: 0 5px;
            padding: 5px 10px;
            border: 1px solid #000;
            border-radius: 5px;
            cursor: pointer;
        } */

        /* .pagination button.active {
            background-color: #000;
            color: #fff;
        } */

button {
    margin: 0 5px;
    padding: 5px 10px;
    border: 2px solid #979797;
    border-radius: 5px;
    /* background-color: #74ccdc; */
    cursor: pointer;
}       

.search-container {
  display: flex;
  justify-content: center; 
  margin-bottom: 20px;
}


.search-input {
  width: calc(40% - 10px); 
  padding: 10px;
  font-size: 16px;
  border: 2px solid #323232;
  border-radius: 5px;
}

.competitions-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  
}

.loading-message {
  display: block;
  margin-top: 20px;
}

.competition-buttons {
  display: flex;
  flex-wrap: wrap;
}

.competition-button {
  margin: 5px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.players-container {
  margin-bottom: 20px;
}

.player-items {
  display: flex;
  flex-wrap: wrap;
}

.player-item {
  width: calc(25% - 20px);
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  /* border: 2px solid #979797; */
  box-shadow: 10px 10px 40px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.player-link {
  text-decoration: none;
  color: inherit;
}

.player-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.player-details {
  padding: 10px;
}

.player-ranking {
  font-weight: bold;
}

.player-name {
  margin-top: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}


/* Styles pour les écrans plus petits que 768px (tablettes et smartphones en mode portrait) */
@media (max-width: 855px) {
  .search-input {
    width: 100%; 
    margin-right: 0; 
    margin-bottom: 10px; 
  }

  .competition-buttons {
    flex-direction: column;
    align-items: center; 
  }

  .player-item {
    width: calc(50% - 20px); 
  }
}

@media (max-width: 880px) {
  .player-item {
    width: 100%; 
  }
  .player-item {
    width: calc(50% - 20px); 
  }

  .competition-buttons{
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 690px) {
  .player-item {
    width: 100%; 
  }
  .player-item {
    width: calc(100% - 20px); 
  }

  .competition-buttons{
    flex-direction: row;
    justify-content: center;
  }
}
</style>

  