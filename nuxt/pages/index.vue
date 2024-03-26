<script>
import { PlayerResponse } from '~/models/player.model';
import { useStrapi, useAsyncData } from '@nuxtjs/strapi';

export default {
    async asyncData() {
        const { find } = useStrapi();
        const { data, pending, error } = await useAsyncData<PlayerResponse>('players', async () => {
            return await find<PlayerResponse>('players');
        });

        return {
            data,
            pending,
            error
        };
    }
}
</script>

<template>
    <h1>Hello world</h1>
    <pre>{{ data }}</pre>
</template>

<style scoped>

</style>
