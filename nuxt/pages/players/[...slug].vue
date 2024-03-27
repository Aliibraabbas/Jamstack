<script lang="ts" setup>
    import type { Player } from '~/models/player.model';

    const { findOne } = useStrapi4()
    const route = useRoute()

    const { data: player, pending } = useAsyncData('player',
        () => findOne<{ data: Player }>(`players/${route.params.slug}`)
    )
</script>

<template>
    <section class="player-section">
      <div class="player-container">
        <div class="player-info">
          <NuxtImg v-if="player?.data.image" :src="player?.data.image?.url" :alt="player?.data.slug" class="player-image" />
          <div class="player-details">
            <h2>{{player?.data.first_name}} {{player?.data.last_name}}</h2>
            <div>Ranking: {{player?.data.ranking}}</div>
            <div class="competition-info">
              <span v-if="player?.data.competitions && player.data.competitions.length >= 1">Competition: </span>
              <span v-else>Aucune compétition:</span>
              <div v-for="(competition, index) in player?.data.competitions" :key="index">
                <div v-if="competition"> {{ competition.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <style scoped>
  
  .player-section {
    display: flex;
    justify-content: center;
    
  }
  
  .player-info {
    text-align: center;
    font-weight: 500;
  }
  
  .player-image {
    width: 600px; 
    height: 400px;
    object-fit: cover;
    border-radius: 5px;
  }
  
  .player-details {
    margin-top: 20px;
  }
  
  .competition-info {
    display: flex;
    justify-content: center;
    /* align-items: center; */
    /* margin-top: 20px; */

  }


  
@media (max-width: 768px) {
  .player-image {
    width: 100%; 
    height: auto; 
    /* border-radius: 0;  */
  }
}


@media (max-width: 480px) {
  .player-section {
    flex-direction: column; 
    align-items: center; 
  }
}
  </style>
  

