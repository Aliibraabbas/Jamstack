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
const pageSize = ref(6);

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
    
        <div>
            <input class="" type="text" v-model="search" @input="searchPlayers" placeholder="Search">
            <template v-if="!search">
            </template>
        </div>


        <template v-if="!search">
            <div class=""> 
                <template v-if="competitionsPending">
                    <span>Loading Competitions....</span>
                </template>
                <template v-else>
                    <div class="">
                        <button v-for="competition in competitions?.data"
                        :key="competition.id"
                        :class="[filters.includes(competition.name) ? 'bg-gray-200' : 'bg-white']" 
                        @click="addFilter(competition.name)"
                        class=""
                        >
                            {{ competition.name }}
                        </button>
                    </div>
                </template>
            </div>


            <div class="">
                <template v-if="playersPending">
                    <span >Loading players....</span>
                </template>
                <template v-else>
                    <div class="">
                        <div v-for="player in (search ? searchResults : players?.data)" :key="player.slug">
                            <a :href="`/players/${player.slug}`">
                                <!-- <NuxtImg v-if="player.image" :src="player.image?.url" :alt="player.slug" class="w-full h-48 object-cover" /> -->
                                <div class="">
                                    <div> {{player.ranking}}</div>
                                    <h2>{{player.first_name}} {{player.last_name}}</h2>
                                </div>
                            </a>
                        </div> 
                    </div>
                </template>
                <UPagination v-if="players?.meta && players?.meta.pagination.pageCount > 1" 
                    v-model="page" 
                    :page-count="pageSize" 
                    :total="players?.meta.pagination.total"
                    class=""
                /> 
            </div>
        </template>

        

        <template v-else>
            <div class="">
                <template v-if="searchedPlayersPending">
                    <span>Loading players....</span>
                </template>
                <template v-else>
                    <div>
                        <div v-for="player in (search ? searchResults : searchedPlayers?.data)" :key="player.slug">
                            <a :href="`/players/${player.slug}`">
                                <!-- <NuxtImg v-if="player.image" :src="player.image?.url" :alt="player.slug" class="w-full h-48 object-cover" /> -->
                                <div>
                                    <div> {{player.ranking}}</div>
                                    <h2>{{player.first_name}} {{player.last_name}}</h2>
                                </div>
                            </a>
                        </div> 
                    </div>
                </template>
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
  