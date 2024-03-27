<script lang="ts" setup>
    import type { Player } from '~/models/player.model';

    const { findOne } = useStrapi4()
    const route = useRoute()

    const { data: player, pending } = useAsyncData('player',
        () => findOne<{ data: Player }>(`players/${route.params.slug}`)
    )
</script>

<template>

        <div class="">
            <NuxtImg v-if="player?.data.image" :src="player?.data.image?.url" :alt="player?.data.slug" class="" />
            <div class="">
                <div class="">
                    <h2>{{player?.data.first_name}} {{player?.data.last_name}}</h2>
                    <div>Ranking: {{player?.data.ranking}}</div>
                </div>
                <div class="">
                    <span v-if="player?.data.competitions && player.data.competitions.length >= 1">Compétition:</span>
                    <span v-else>Aucune compétition:</span>
                    <div v-for="(competition, index) in player?.data.competitions" :key="index">
                        <div v-if="competition">
                            {{ competition.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

</template>
